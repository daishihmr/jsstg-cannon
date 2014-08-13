tm.main(function() {

    cannon.app = cannon.Application("#main");

    if (location.hostname === "localhost") {
        tm.util.Script.loadStats().onload = function() {
            cannon.app.enableStats();
        };
    }

    var fonts = ["MagicRing", "OFL", "UFL"].map(function(ff) {
        var font = { loaded: false };

        var tester = document.createElement("span");
        tester.style.fontFamily = "'{0}', 'monospace'".format(ff);
        tester.innerHTML = "QW@HhsXJ";
        document.body.appendChild(tester);
        var before = tester.offsetWidth;
        var timeout = 30;

        var checkLoadFont = function() {
            timeout -= 1;
            if (tester.offsetWidth !== before || timeout < 0) {
                document.body.removeChild(tester);
                font.loaded = true;
            } else {
                setTimeout(checkLoadFont, 100);
            }
        };
        checkLoadFont();

        return font;
    });

    var check = function() {
        if (fonts.some(function(f){ return !f.loaded })) {
            setTimeout(check, 100);
        } else {
            cannon.app.run();
        }
    };
    check();
});
