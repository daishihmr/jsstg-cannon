(function() {

/**
 * tm.display.CanvasAppをWebGL化する
 */
tm.define("WebGLise", {

    init: function(app) {
        this.app = app;
        var params = this.params = cannon.WebGLParams();

        app.element.style.display = "none";

        var ctex = tm.graphics.Canvas();
        ctex.element.style.display = "none";
        ctex.resize(512, 512);

        var c3d = document.createElement("canvas");
        document.body.appendChild(c3d);
        c3d.width = app.width;
        c3d.height = app.height;

        var _fitFunc = function() {
            var s = c3d.style;
            s.position = "absolute";
            s.margin = "auto";
            s.left = "0px";
            s.top  = "0px";
            s.bottom = "0px";
            s.right = "0px";

            var rateWidth = c3d.width/window.innerWidth;
            var rateHeight= c3d.height/window.innerHeight;
            var rate = c3d.height/c3d.width;

            if (rateWidth > rateHeight) {
                s.width  = innerWidth+"px";
                s.height = innerWidth*rate+"px";
            }
            else {
                s.width  = innerHeight/rate+"px";
                s.height = innerHeight+"px";
            }
        }.bind(this);
        _fitFunc();
        window.addEventListener("resize", _fitFunc, false);

        var gl = c3d.getContext("webgl");

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);

        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, WebGLise.vs)
        gl.compileShader(vs);

        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, WebGLise.fs);
        gl.compileShader(fs);

        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        var attribLocation = {
            position: gl.getAttribLocation(program, "position"),
            texCoord: gl.getAttribLocation(program, "texCoord"),
        };
        var uniformLocation = {
            matMvp: gl.getUniformLocation(program, "matMvp"),
            texture: gl.getUniformLocation(program, "texture"),
            labelAreaHeight: gl.getUniformLocation(program, "labelAreaHeight"),
            strength: gl.getUniformLocation(program, "strength"),
            centerOffset: gl.getUniformLocation(program, "centerOffset"),
            lightRadius: gl.getUniformLocation(program, "lightRadius"),
        };

        var positionData = [
            -1,  1, 0,
             1,  1, 0,
             1, -1, 0,
             1, -1, 0,
            -1, -1, 0,
            -1,  1, 0,
        ];
        var position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, position);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(attribLocation.position);
        gl.vertexAttribPointer(attribLocation.position, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var texCoordData = [
             0.0,  0.0,
             1.0,  0.0,
             1.0,  1.0,
             1.0,  1.0,
             0.0,  1.0,
             0.0,  0.0,
        ];
        var texCoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordData), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(attribLocation.texCoord);
        gl.vertexAttribPointer(attribLocation.texCoord, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        var matM = mat4.create();
        var matV = mat4.create();
        var matP = mat4.create();
        var matMvp = mat4.create();

        mat4.lookAt(matV, [0.0, 0.0, 1.0], [0, 0, 0], [0, 1, 0]);
        mat4.ortho(matP, -1, 1, -1, 1, 0.1, 2);
        mat4.multiply(matMvp, matP, matV);
        mat4.multiply(matMvp, matM, matMvp);
        gl.uniformMatrix4fv(uniformLocation.matMvp, false, matMvp);

        var render = function() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            mat4.identity(matM);
            if (params.quake > 0.0) {
                mat4.translate(matM, matM, [Math.randf(-params.quake * 0.01, params.quake * 0.01), Math.randf(-params.quake * 0.01, params.quake * 0.01), 0]);
                mat4.rotateZ(matM, matM, Math.randf(-params.quake * 0.01, params.quake * 0.01));
            }
            mat4.multiply(matMvp, matP, matV);
            mat4.multiply(matMvp, matM, matMvp);
            gl.uniformMatrix4fv(uniformLocation.matMvp, false, matMvp);

            ctex.drawImage(app.element, 0, 0, app.width, app.height, 0, 0, ctex.width, ctex.height);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctex.element);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.uniform1i(uniformLocation.texture, 0);

            gl.uniform1f(uniformLocation.labelAreaHeight, params.labelAreaHeight);

            gl.uniform1f(uniformLocation.strength, params.strength);
            gl.uniform2fv(uniformLocation.centerOffset, params.centerOffset);

            gl.uniform1f(uniformLocation.lightRadius, params.lightRadius);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.flush();
        };

        app.update = function() {
            render();
        };
    }
});

WebGLise.vs = "
attribute vec3 position;
attribute vec2 texCoord;
uniform mat4 matMvp;
varying vec4 vColor;
varying vec2 vTexCoord;

void main(void) {
    vTexCoord = texCoord;
    gl_Position = matMvp * vec4(position, 1.0);
}
";

WebGLise.fs = "
precision mediump float;

uniform sampler2D texture;
uniform float labelAreaHeight;
uniform float strength;
uniform vec2 centerOffset;
uniform float lightRadius;

varying vec4 vColor;
varying vec2 vTexCoord;

const float tFragX = 1.0 / 960.0;
const float tFragY = 1.0 / 640.0;
const float nFrag = 1.0 / 30.0;
// const vec2 centerOffset = vec2(960.0 / 2.0, 640.0 / 2.0);

float rnd(float seed){
    return fract(sin(dot(gl_FragCoord.stp + seed, vec3(12.9898, 78.233, 151.7182))) * 43758.5453 + seed);
}

void main(void) {
    vec4 result;

    vec2 fc = vec2(gl_FragCoord.x, 640.0 - gl_FragCoord.y);
    vec2 fcc = fc - centerOffset;

    vec4 blured;
    if (strength > 0.001) {
        vec3 temp = vec3(0.0);
        float random = rnd(604.361);
        float totalWeight = 0.0;

        for(float i = 0.0; i <= 30.0; i++){
            float percent = (i + random) * nFrag;
            float weight = percent - percent * percent;
            vec2 t = fc - fcc * percent * strength * nFrag;
            temp += texture2D(texture, vec2(t.x * tFragX, t.y * tFragY)).rgb * weight;
            totalWeight += weight;
        }
        blured = vec4(temp / totalWeight, 1.0);
    } else {
        blured = texture2D(texture, vTexCoord);
    }

    if (lightRadius > 0.001) {
        float addition = clamp((lightRadius - length(fcc)) / lightRadius, 0.0, 1.0);
        blured += vec4(vec3(addition), 0.0);
        blured += vec4(vec3(addition), 0.0);
    }

    if (320.0 - labelAreaHeight <= gl_FragCoord.y && gl_FragCoord.y < 320.0 + labelAreaHeight) {
        vec3 neg = vec3(1.0 - blured.r, 1.0 - blured.g, 1.0 - blured.b);
        result = vec4(neg.r * 0.62, neg.g * 0.10, neg.b * 0.12, blured.a);
    } else {
        result = blured;
    }

    gl_FragColor = result;
}
";

})();
