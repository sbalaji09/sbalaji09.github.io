// Nothing here is load-bearing. Turn JS off and the site still reads fine —
// you just miss the cursor and the little entrance animations. Your call.

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.body.classList.remove("is-loading");
    document.body.classList.add("js-on");
    // next frame, let the hero animations fire
    requestAnimationFrame(() => document.body.classList.add("ready"));

    // ── time-aware greeting. small thing, but it means a real person thought
    //    about when you'd show up. ──
    const greetingEl = document.querySelector("[data-greeting]");
    if (greetingEl) {
        const h = new Date().getHours();
        let g = "Hey there —";
        if (h < 5)        g = "It's late. Go to bed (after this) —";
        else if (h < 12)  g = "Morning —";
        else if (h < 17)  g = "Afternoon —";
        else if (h < 22)  g = "Evening —";
        else              g = "Late one, huh —";
        greetingEl.textContent = g;
    }

    // ── scroll reveals ──
    const revealTargets = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );
        revealTargets.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i * 45, 220)}ms`;
            observer.observe(el);
        });
    } else {
        revealTargets.forEach((el) => el.classList.add("is-visible"));
    }

    // ── custom cursor: a little coral ring that lags behind, grows over links.
    //    only on devices that actually have a pointer. ──
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cursor = document.querySelector(".cursor");
    if (cursor && finePointer && !reduceMotion) {
        let tx = 0, ty = 0, cx = 0, cy = 0, awake = false;

        window.addEventListener("mousemove", (e) => {
            tx = e.clientX; ty = e.clientY;
            if (!awake) { cx = tx; cy = ty; cursor.classList.add("is-awake"); awake = true; }
        });
        window.addEventListener("mouseout", (e) => {
            if (!e.relatedTarget) cursor.classList.remove("is-awake");
        });

        const tick = () => {
            cx += (tx - cx) * 0.18;   // lerp = the lag that makes it feel alive
            cy += (ty - cy) * 0.18;
            cursor.style.transform = `translate(${cx}px, ${cy}px)`;
            requestAnimationFrame(tick);
        };
        tick();

        const grow = () => cursor.classList.add("is-grown");
        const shrink = () => cursor.classList.remove("is-grown");
        document.querySelectorAll("a, .hero-name, .scribble").forEach((el) => {
            el.addEventListener("mouseenter", grow);
            el.addEventListener("mouseleave", shrink);
        });
    }

    // ── easter egg: double-click my name, find a thing ──
    const name = document.querySelector("[data-secret]");
    if (name) {
        name.addEventListener("dblclick", () => {
            name.classList.toggle("secret-open");
        });
    }

    // ── for the curious who open devtools. hi. ──
    const style = "color:#c8553d; font-family:monospace; font-size:13px;";
    console.log("%c hey — you opened the console. that's the spirit.", style);
    console.log("%c this whole site is hand-written. if you want to talk shop: siddharthbalaji6@gmail.com", "color:#6d655a; font-family:monospace;");
});
