document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-motion");

    const revealTargets = document.querySelectorAll(".reveal");
    const navLinks = document.querySelectorAll('.site-nav a[href^="#"], .scroll-link[href^="#"], .site-mark[href^="#"]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.16,
            rootMargin: "0px 0px -10% 0px",
        }
    );

    revealTargets.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
        observer.observe(element);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            const target = targetId ? document.querySelector(targetId) : null;

            if (!target) {
                return;
            }

            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const header = document.querySelector(".site-header");
            const headerOffset = header ? header.offsetHeight + 24 : 0;
            const targetTop = Math.max(
                target.getBoundingClientRect().top + window.scrollY - headerOffset,
                0
            );
            const currentTop = window.scrollY;

            event.preventDefault();

            if (Math.abs(currentTop - targetTop) < 8) {
                return;
            }

            window.scrollTo({
                top: targetTop,
                behavior: reduceMotion ? "auto" : "smooth",
            });
        });
    });
});
