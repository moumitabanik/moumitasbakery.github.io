async function loadMenu(selectedCategory = "all cakes") {
  const menuGrid = document.getElementById("menu-grid");

  try {
    // Show loader while fetching
    menuGrid.innerHTML = `
      <div class="col-span-3 flex justify-center items-center py-10 flex-col">
        <div class="w-10 h-10 border-4 border-[color:var(--brand-primary)] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-[color:var(--brand-primary)] font-medium">Loading menu...</p>
      </div>
    `;

    const response = await fetch("/.netlify/functions/getMenu");
    if (!response.ok) throw new Error("Failed to fetch menu");
    const menu = await response.json();

    // Normalize category name for comparison
    const normalizedCategory = selectedCategory.toLowerCase().replace(/-/g, " ");
    const filteredMenu =
      normalizedCategory === "all cakes"
        ? menu
        : menu.filter(
            (item) =>
              item.category &&
              item.category.toLowerCase() === normalizedCategory
          );

    menuGrid.innerHTML = "";

    if (filteredMenu.length === 0) {
      menuGrid.innerHTML = `<p class="col-span-3 text-gray-600 text-center">No items found in this category.</p>`;
      return;
    }

    // Display cards
    filteredMenu.forEach((item) => {
      // Inside filteredMenu.forEach
      const imagesArray = item.images
        ? item.images.split(",")
        : [item.image_url || "assets/images/placeholder.jpg"];

      const imagePath = imagesArray[0].startsWith("http")
        ? imagesArray[0]
        : "/" + imagesArray[0].replace(/^\/+/, "");

      const card = document.createElement("div");
      card.className = "menu-card rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-shadow duration-300";
      card.dataset.category = item.category;
      // Add all images as comma-separated list for the modal
      card.dataset.images = imagesArray.join(",");

      card.innerHTML = `
        <img src="${imagePath}" alt="${item.name}" class="rounded-xl w-full h-56 object-cover mb-4" />
        <h3 class="text-xl font-semibold text-[color:var(--brand-primary)]">${item.name}</h3>
        <p class="text-gray-600 mt-1">${item.description}</p>
        <p class="text-[color:var(--brand-primary)] mt-2 font-semibold">₹${item.price}</p>
        <p class="text-gray-500">
          ${
            item.pound && item.pound !== "0"
              ? `Pounds: ${item.pound}`
              : item.pcs && item.pcs !== "0"
                ? `Pieces: ${item.pcs}`
                : "Pounds: 1 Pound"
          }
        </p>

      `;
      menuGrid.appendChild(card);

    });

    // Scroll up smoothly after loading
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Error loading menu:", err);
    menuGrid.innerHTML = `<p class="col-span-3 text-red-500">Error loading menu. Please try again later.</p>`;
  }
}

// Handle category tabs + hash logic
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-btn");

  // Read hash (e.g. #dry-cakes)
  const hash = window.location.hash.replace("#", "");
  let initialCategory = hash ? hash.replace(/-/g, " ") : "all cakes";

  // Function to activate the correct tab visually
  const activateTab = (categoryName) => {
    buttons.forEach((btn) => {
      const btnCategory = btn.getAttribute("data-category");
      if (btnCategory.toLowerCase() === categoryName.toLowerCase()) {
        btn.classList.add("bg-[color:var(--brand-primary)]", "text-white");
        btn.classList.remove("bg-[color:var(--brand-yellow)]", "text-[color:var(--brand-primary)]");
      } else {
        btn.classList.remove("bg-[color:var(--brand-primary)]", "text-white");
        btn.classList.add("bg-[color:var(--brand-yellow)]", "text-[color:var(--brand-primary)]");
      }
    });
  };

  // Tab click event
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.getAttribute("data-category");
      const hashValue = selectedCategory.toLowerCase().replace(/\s+/g, "-");

      // Update hash in URL (so shareable)
      window.location.hash = hashValue;

      activateTab(selectedCategory);
      loadMenu(selectedCategory);
    });
  });

  // On page load, activate tab based on hash
  activateTab(initialCategory);
  loadMenu(initialCategory);
});
