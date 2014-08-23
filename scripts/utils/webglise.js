(function() {

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

            ctex.drawImage(app.element, 0, 0, app.width, app.height, 0, 0, ctex.width, ctex.height);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctex.element);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.uniform1i(uniformLocation.texture, 0);

            gl.uniform1f(uniformLocation.labelAreaHeight, params.labelAreaHeight)

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
varying vec4 vColor;
varying vec2 vTexCoord;

const float seed = 604.361;
float rnd(){
    return fract(sin(dot(gl_FragCoord.stp + seed, vec3(12.9898, 78.233, 151.7182))) * 43758.5453 + seed);
}

void main(void) {
    vec4 result;
    vec4 sample = texture2D(texture, vTexCoord);

    if (320.0 - labelAreaHeight <= gl_FragCoord.y && gl_FragCoord.y < 320.0 + labelAreaHeight) {
        vec3 neg = vec3(sample.r, 1.0 - sample.g, 1.0 - sample.b);
        result = vec4(neg.r * 0.48, neg.g * 0.05, neg.b * 0.08, sample.a);
    } else {
        result = sample;
    }

    gl_FragColor = result;
}
";

})();
