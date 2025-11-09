async function loadFeatured() {
    const loader = document.getElementById("page-loader");
  try {
    loader.style.display = "flex"; // show loader
    const response = await fetch('/.netlify/functions/getMenu');
    if (!response.ok) throw new Error("Failed to fetch menu");
    const menu = await response.json();

    // Filter top 3 featured / best sellers
    // Assuming your data has `featured: true` property
    const featuredItems = menu.filter(item => item.is_featured).slice(0, 3);

    const grid = document.getElementById("featured-grid");
    grid.innerHTML = "";

    featuredItems.forEach(item => {
      const imagesArray = item.images.split(",");
      const card = document.createElement("a");
      card.href = "menu.html";
      card.className = "group block bg-gradient-to-b from-white to-[rgba(255,249,250,1)] rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-[rgba(140,25,67,0.1)] hover:-translate-y-2";

      card.innerHTML = `
        <div class="overflow-hidden rounded-2xl mb-5">
          <img src="${imagesArray[0]}" alt="${item.name}"
            class="rounded-2xl w-full h-60 object-cover transform group-hover:scale-110 transition-transform duration-700" />
        </div>
        <h3 class="font-semibold text-2xl text-[color:var(--brand-magenta)] mb-2 group-hover:text-[color:var(--brand-secondary)] transition-colors">
          ${item.name}
        </h3>
        <p class="text-gray-600 text-base">${item.description}</p>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading featured items:", err);
  } finally {
    loader.style.display = "none"; // hide loader after data is ready
  }
}

// Load featured items on page load
document.addEventListener("DOMContentLoaded", loadFeatured);
