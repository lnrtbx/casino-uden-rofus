const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Smooth FAQ accordion (progressive enhancement over native <details>) ---
document.querySelectorAll(".faq details").forEach((details) => {
  const content = details.querySelector("p");
  content.style.overflow = "hidden";

  details.addEventListener("click", (e) => {
    if (e.target.tagName === "A") return;
    e.preventDefault();

    const isOpen = details.hasAttribute("open");

    if (isOpen) {
      content.style.height = content.scrollHeight + "px";
      requestAnimationFrame(() => { content.style.height = "0px"; });
      content.addEventListener("transitionend", function handler() {
        details.removeAttribute("open");
        content.removeEventListener("transitionend", handler);
      }, { once: true });
    } else {
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

// --- Table of contents: highlight the section currently in view ---
const tocLinks = document.querySelectorAll(".toc a");
const sections = [...tocLinks].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

if (tocLinks.length && sections.length) {
  const setActive = (id) => {
    tocLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });

  sections.forEach((el) => io.observe(el));
}
