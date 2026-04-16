document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-motion");

    const revealed = document.querySelectorAll(".reveal");

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
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    revealed.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
        observer.observe(element);
    });
});
