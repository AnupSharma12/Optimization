// ===== Theme Toggle =====
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ===== Mobile Menu =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close menu when a link is clicked
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
  }
});

// ===== Platform Filter =====
const filterButtons = document.querySelectorAll(".filter");
const sections = document.querySelectorAll("#content > section");
const noResults = document.getElementById("noResults"); // may be null — guarded below

let activeFilter = "all";

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

function applyFilters() {
  const query = document.getElementById("searchBox").value.toLowerCase().trim();
  let anyVisible = false;

  sections.forEach((section) => {
    const platform = section.dataset.platform;
    const cards = section.querySelectorAll(".card");
    let sectionHasVisible = false;

    const platformMatch =
      activeFilter === "all" ||
      platform === activeFilter ||
      platform === "general";

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const matchesSearch = !query || text.includes(query);
      const matchesFilter = platformMatch;

      if (matchesSearch && matchesFilter) {
        card.style.display = "";
        sectionHasVisible = true;
        anyVisible = true;
      } else {
        card.style.display = "none";
      }
    });

    section.style.display = sectionHasVisible ? "" : "none";

    const subHeadings = section.querySelectorAll(".sub-heading");
    subHeadings.forEach((heading) => {
      const grid = heading.nextElementSibling;
      if (grid && grid.classList.contains("card-grid")) {
        const hasVisible = Array.from(grid.querySelectorAll(".card")).some(
          (c) => c.style.display !== "none"
        );
        heading.style.display = hasVisible ? "" : "none";
      }
    });
  });


  if (noResults) {
    noResults.style.display = anyVisible ? "none" : "block";
  }
}

// ===== Search =====
const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("input", () => {
  applyFilters();
});

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('#navLinks a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      filterButtons.forEach((b) => b.classList.remove("active"));
      document.querySelector('.filter[data-filter="all"]').classList.add("active");
      activeFilter = "all";
      searchBox.value = "";
      applyFilters();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});