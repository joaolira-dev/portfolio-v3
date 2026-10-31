const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (motionOK && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");
  const targets = document.querySelectorAll(
    ".section-heading, .project, .experience-grid, .about > div, .contact-grid",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px 40px 0px" },
  );
  targets.forEach((target) => observer.observe(target));
}
