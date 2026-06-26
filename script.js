document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-motion");

    const revealTargets = document.querySelectorAll(".reveal");

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
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    revealTargets.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 40, 200)}ms`;
        observer.observe(element);
    });
});
