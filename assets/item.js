async function loadMenu() {
    const loader = document.getElementById("page-loader");
  try {
    loader.style.display = "flex"; // show loader
    const response = await fetch('/.netlify/functions/getMenu');
    if (!response.ok) throw new Error("Failed to fetch menu");
    const menu = await response.json();

    const menuGrid = document.getElementById("menu-grid");
    menuGrid.innerHTML = ""; // clear previous items

    menu.forEach(item => {
      const imagesArray = item.images.split(",");
      const card = document.createElement("div");
      card.className = `menu-card rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-shadow duration-300`;
      card.dataset.category = item.category;
      card.dataset.images = item.images;

      card.innerHTML = `
        <img src="${imagesArray[0]}" alt="${item.name}" class="rounded-xl w-full h-56 object-cover mb-4" />
        <h3 class="text-xl font-semibold text-[color:var(--brand-primary)]">${item.name}</h3>
        <p class="text-gray-600 mt-1">${item.description}</p>
        <p class="text-[color:var(--brand-primary)] mt-2 font-semibold">₹${item.price}</p>
      `;

      menuGrid.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading menu:", err);
  } finally {
    loader.style.display = "none"; // hide loader after data is ready
  }
}

// Load menu on page load
document.addEventListener("DOMContentLoaded", loadMenu);
