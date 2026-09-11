// Respect users who prefer reduced motion
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Scroll reveal ---
if (!prefersReducedMotion) {
  const revealTargets = document.querySelectorAll(".col");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
} else {
  document.querySelectorAll(".col").forEach((el) => el.classList.add("is-visible"));
}

// --- Smooth FAQ accordion (progressive enhancement over native <details>) ---
document.querySelectorAll(".faq details").forEach((details) => {
  const content = details.querySelector("p");
  content.style.overflow = "hidden";

  details.addEventListener("click", (e) => {
    if (e.target.tagName !== "SUMMARY") return;
    e.preventDefault();

    const isOpen = details.hasAttribute("open");

    if (isOpen) {
      // closing
      content.style.height = content.scrollHeight + "px";
      requestAnimationFrame(() => { content.style.height = "0px"; });
      content.addEventListener("transitionend", function handler() {
        details.removeAttribute("open");
        content.removeEventListener("transitionend", handler);
      }, { once: true });
    } else {
      // closing any other open item for a clean single-open accordion feel
      document.querySelectorAll(".faq details[open]").forEach((other) => {
        if (other !== details) other.querySelector("summary").click();
      });

      details.setAttribute("open", "");
      content.style.height = "0px";
      requestAnimationFrame(() => {
        content.style.height = content.scrollHeight + "px";
      });
      content.addEventListener("transitionend", function handler() {
        content.style.height = "auto";
        content.removeEventListener("transitionend", handler);
      }, { once: true });
    }
  });
});
