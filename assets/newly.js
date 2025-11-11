async function loadNewCakes() {
  const grid = document.getElementById("new-cakes-grid");

  try {
    // Show loader inside the grid
    grid.innerHTML = `
      <div class="col-span-3 flex justify-center items-center py-10 flex-col">
        <div class="w-10 h-10 border-4 border-[color:var(--brand-primary)] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p class="text-[color:var(--brand-primary)] font-medium">Loading cakes...</p>
      </div>
    `;

    const response = await fetch("/.netlify/functions/getMenu");
    if (!response.ok) throw new Error("Failed to load new cakes");

    const menu = await response.json();

    // Filter only newly launched items
    const newCakes = menu.filter(item => item.is_new);

    grid.innerHTML = ""; // clear loader

    if (newCakes.length === 0) {
      grid.innerHTML = `<p class="col-span-3 text-gray-600">No new cakes available at the moment.</p>`;
      return;
    }

    newCakes.forEach(item => {
      // Split image list (if multiple images stored as comma-separated)
      const imagesArray = item.images ? item.images.split(",") : [item.image_url || "assets/images/placeholder.jpg"];
      const imagePath = imagesArray[0].startsWith("http")
        ? imagesArray[0]
        : "/" + imagesArray[0].replace(/^\/+/, "");

      const card = document.createElement("a");
      card.href = "menu.html";
      card.className =
        "group relative block bg-pink-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 hover:-translate-y-2";

      card.innerHTML = `
        <div class="relative rounded-2xl overflow-hidden mb-5">
          <!-- New Badge -->
          <span class="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
            NEW
          </span>

          <img src="${imagePath}" alt="${item.name}"
            class="rounded-2xl w-full h-60 object-cover transform group-hover:scale-105 transition-transform duration-500 z-0" />
        </div>

        <h3 class="font-semibold text-2xl text-[color:var(--brand-primary)] mb-2 group-hover:text-[color:var(--brand-secondary)] transition-colors">
          ${item.name}
        </h3>
        <p class="text-gray-600 text-base">${item.description}</p>
      `;


      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading new cakes:", err);
    grid.innerHTML = `<p class="col-span-3 text-red-500">Error loading cakes. Please try again later.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", loadNewCakes);
