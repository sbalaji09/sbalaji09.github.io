(function () {
    "use strict";

    var canvas = document.getElementById("swim-canvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");

    var ROWS = 16;
    var CELL_W = 9;
    var CELL_H = 14;
    var TICK_MS = 130;

    var COLS = 40;
    var dpr = window.devicePixelRatio || 1;

    var COL_AIR_BG = "#e7e7e7";
    var COL_WATER_BG = "#d2d2d2";
    var COL_WATERLINE = "#8f8f8f";
    var COL_FIG = "#111111";
    var COL_BUBBLE = "#a9a9a9";

    // Poses: array of rows, each row a string. Space = empty cell.
    var POSE_STAND = [
        "  o  ",
        " /|\\ ",
        "  |  ",
        " / \\ "
    ];
    var POSE_ARMSUP = [
        "\\ o /",
        "  |  ",
        "  |  ",
        " / \\ "
    ];
    var POSE_DIVE_A = [
        " o  ",
        "/=\\ "
    ];
    var POSE_DIVE_B = [
        "  o ",
        " /=\\"
    ];
    var POSE_SWIM_LEFT_1 = [
        "o_   ",
        "  \\  "
    ];
    var POSE_SWIM_LEFT_2 = [
        "o_   ",
        "/    "
    ];
    var POSE_SWIM_RIGHT_1 = [
        "   _o",
        "  /  "
    ];
    var POSE_SWIM_RIGHT_2 = [
        "   _o",
        "    \\"
    ];

    function lerp(a, b, t) { return a + (b - a) * t; }
    function easeIn(t) { return t * t; }
    function easeOut(t) { return 1 - (1 - t) * (1 - t); }

    var PHASE_ORDER = ["stand", "dive", "swimOut", "swimBack", "surface", "climb"];
    var DURATIONS = { stand: 11, dive: 8, swimOut: 28, swimBack: 28, surface: 8, climb: 8 };

    var phaseIndex = 0;
    var t = 0; // tick within current phase
    var crossed = false; // one-shot splash trigger per phase
    var splashTimer = 0;
    var splashX = 0;
    var bubbles = [];

    function dims() {
        var WATER_ROW = 7;
        var BOARD_ROW = 6;
        return {
            COLS: COLS,
            ROWS: ROWS,
            WATER_ROW: WATER_ROW,
            BOARD_ROW: BOARD_ROW,
            BOARD_X: COLS - 15,
            STAND_X: COLS - 12,
            DIVE_X: COLS - 15,
            SWIM_LEFT_X: 3
        };
    }

    function getState() {
        var d = dims();
        var phase = PHASE_ORDER[phaseIndex];
        var dur = DURATIONS[phase];
        var p = t / dur;
        var standY = d.BOARD_ROW - 3;
        var underY = d.WATER_ROW + 2;
        var swimY;
        var x, y, pose, waterCrossAt;

        switch (phase) {
            case "stand":
                x = d.STAND_X;
                y = standY;
                pose = (t % 6 < 3) ? POSE_STAND : POSE_ARMSUP;
                break;
            case "dive":
                x = Math.round(lerp(d.STAND_X, d.DIVE_X, p));
                y = Math.round(lerp(standY, underY, easeIn(p)));
                pose = (p < 0.5) ? POSE_DIVE_A : POSE_DIVE_B;
                waterCrossAt = d.WATER_ROW;
                if (!crossed && y >= waterCrossAt) {
                    crossed = true;
                    splashTimer = 3;
                    splashX = x + 1;
                }
                break;
            case "swimOut":
                x = Math.round(lerp(d.DIVE_X, d.SWIM_LEFT_X, p));
                swimY = d.WATER_ROW + 4 + Math.round(Math.sin(p * Math.PI * 7) * 1);
                y = swimY;
                pose = (t % 6 < 3) ? POSE_SWIM_LEFT_1 : POSE_SWIM_LEFT_2;
                if (Math.random() < 0.3) {
                    bubbles.push({ x: x + 4, y: y - 1, life: 7 });
                }
                break;
            case "swimBack":
                x = Math.round(lerp(d.SWIM_LEFT_X, d.DIVE_X, p));
                swimY = d.WATER_ROW + 4 + Math.round(Math.sin(p * Math.PI * 7) * 1);
                y = swimY;
                pose = (t % 6 < 3) ? POSE_SWIM_RIGHT_1 : POSE_SWIM_RIGHT_2;
                if (Math.random() < 0.3) {
                    bubbles.push({ x: x, y: y - 1, life: 7 });
                }
                break;
            case "surface":
                x = Math.round(lerp(d.DIVE_X, d.STAND_X, p));
                y = Math.round(lerp(underY, d.BOARD_ROW - 1, easeOut(p)));
                pose = (p < 0.5) ? POSE_DIVE_B : POSE_DIVE_A;
                if (!crossed && y <= d.WATER_ROW) {
                    crossed = true;
                    splashTimer = 3;
                    splashX = x + 1;
                }
                break;
            case "climb":
                x = d.STAND_X;
                y = Math.round(lerp(d.BOARD_ROW - 1, standY, p));
                pose = (t % 4 < 2) ? POSE_ARMSUP : POSE_STAND;
                break;
        }

        return { x: x, y: y, pose: pose };
    }

    function advance() {
        var phase = PHASE_ORDER[phaseIndex];
        t++;
        if (t >= DURATIONS[phase]) {
            t = 0;
            crossed = false;
            phaseIndex = (phaseIndex + 1) % PHASE_ORDER.length;
        }
        if (splashTimer > 0) splashTimer--;
        for (var i = bubbles.length - 1; i >= 0; i--) {
            bubbles[i].y -= (i % 2 === 0) ? 1 : 0;
            bubbles[i].life--;
            if (bubbles[i].life <= 0) bubbles.splice(i, 1);
        }
    }

    function resize() {
        var container = canvas.parentElement;
        var width = container.clientWidth || 400;
        COLS = Math.max(30, Math.min(90, Math.floor(width / CELL_W)));
        dpr = window.devicePixelRatio || 1;
        canvas.width = COLS * CELL_W * dpr;
        canvas.height = ROWS * CELL_H * dpr;
        canvas.style.width = (COLS * CELL_W) + "px";
        canvas.style.height = (ROWS * CELL_H) + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
        var d = dims();
        ctx.clearRect(0, 0, COLS * CELL_W, ROWS * CELL_H);
        ctx.textBaseline = "top";

        // background digits + waterline
        ctx.font = (CELL_H - 3) + "px 'Courier New', monospace";
        for (var r = 0; r < ROWS; r++) {
            for (var c = 0; c < COLS; c++) {
                var ch, color;
                if (r === d.WATER_ROW) {
                    ch = (c % 4 < 2) ? "~" : "-";
                    color = COL_WATERLINE;
                } else if (r > d.WATER_ROW) {
                    ch = Math.random() < 0.5 ? "0" : "1";
                    color = COL_WATER_BG;
                } else {
                    ch = Math.random() < 0.5 ? "0" : "1";
                    color = COL_AIR_BG;
                }
                ctx.fillStyle = color;
                ctx.fillText(ch, c * CELL_W, r * CELL_H);
            }
        }

        // overlay layer: board, bubbles, splash, figure — bold black
        ctx.font = "bold " + (CELL_H - 3) + "px 'Courier New', monospace";
        ctx.fillStyle = COL_FIG;

        // diving board
        for (var bc = d.BOARD_X; bc < d.BOARD_X + 6; bc++) {
            if (bc >= 0 && bc < COLS) ctx.fillText("=", bc * CELL_W, d.BOARD_ROW * CELL_H);
        }

        // bubbles
        ctx.fillStyle = COL_BUBBLE;
        bubbles.forEach(function (b) {
            if (b.y >= 0 && b.y < ROWS && b.x >= 0 && b.x < COLS) {
                ctx.fillText("0", b.x * CELL_W, b.y * CELL_H);
            }
        });

        // splash
        if (splashTimer > 0) {
            ctx.fillStyle = COL_FIG;
            var s = splashTimer;
            var pts = [
                [splashX - s, d.WATER_ROW - 1, "'"],
                [splashX + s, d.WATER_ROW - 1, "'"],
                [splashX, d.WATER_ROW - 1, "*"],
                [splashX - 1, d.WATER_ROW, "*"],
                [splashX + 1, d.WATER_ROW, "*"]
            ];
            pts.forEach(function (pt) {
                if (pt[0] >= 0 && pt[0] < COLS && pt[1] >= 0 && pt[1] < ROWS) {
                    ctx.fillText(pt[2], pt[0] * CELL_W, pt[1] * CELL_H);
                }
            });
        }

        // figure
        var state = getState();
        ctx.fillStyle = COL_FIG;
        state.pose.forEach(function (row, i) {
            for (var j = 0; j < row.length; j++) {
                var ch = row[j];
                if (ch === " ") continue;
                var cx = state.x + j;
                var cy = state.y + i;
                if (cx >= 0 && cx < COLS && cy >= 0 && cy < ROWS) {
                    ctx.fillText(ch, cx * CELL_W, cy * CELL_H);
                }
            }
        });
    }

    function tick() {
        draw();
        advance();
    }

    resize();
    var resizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 150);
    });

    setInterval(tick, TICK_MS);
    draw();
})();
