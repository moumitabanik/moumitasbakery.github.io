// Navbar Interactivity
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
  menuToggle.classList.toggle("open");
});

// Filter Menu Items
const tabs = document.querySelectorAll(".tab-btn");
const items = document.querySelectorAll(".menu-card");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(btn => btn.classList.remove("bg-[color:var(--brand-magenta)]", "text-white"));
    tab.classList.add("bg-[color:var(--brand-magenta)]", "text-white");

    const category = tab.dataset.category;
    items.forEach(item => {
      item.style.display = (item.dataset.category === category) ? "block" : "none";
    });
  });
});