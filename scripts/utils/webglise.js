(function() {

tm.define("WebGLise", {

    init: function(app) {
        this.app = app;

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

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.flush();
        };
        
        app.update = function() {
            render();
        };
    }
});

WebGLise.vs = "\n\
attribute vec3 position;\n\
attribute vec2 texCoord;\n\
uniform mat4 matMvp;\n\
varying vec4 vColor;\n\
varying vec2 vTexCoord;\n\
\n\
void main(void) {\n\
    vTexCoord = texCoord;\n\
    gl_Position = matMvp * vec4(position, 1.0);\n\
}\n\
";

WebGLise.fs = "\n\
precision mediump float;\n\
\n\
uniform sampler2D texture;\n\
varying vec4 vColor;\n\
varying vec2 vTexCoord;\n\
\n\
const vec2 center = vec2(200.0, 300.0);\n\
const float pi = 3.14159;\n\
const float ringRadius = 100.0;\n\
const float ringWidth = 60.0;\n\
\n\
void main(void) {\n\
    gl_FragColor = texture2D(texture, vTexCoord);\n\
}\n\
";

})();
