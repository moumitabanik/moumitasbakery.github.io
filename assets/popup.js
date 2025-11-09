document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("modal-content");
  const closeModal = document.getElementById("close-modal");
  const mainImage = document.getElementById("modal-main-image");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-description");
  const price = document.getElementById("modal-price");
  const thumbsContainer = document.getElementById("modal-thumbnails");
  const orderBtn = document.getElementById("order-now-btn");

  // Event delegation for dynamically loaded menu cards
  document.getElementById("menu-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".menu-card");
    if (!card) return;

    const name = card.querySelector("h3").innerText;
    const description = card.querySelector("p:not(.font-semibold)").innerText;
    const priceText = card.querySelector("p.font-semibold").innerText;
    const mainImg = card.querySelector("img").src;
    const extraImages = card.dataset.images
      ? card.dataset.images.split(",")
      : [mainImg];

    title.textContent = name;
    desc.textContent = description;
    price.textContent = priceText;
    mainImage.src = mainImg;

    thumbsContainer.innerHTML = "";
    extraImages.forEach((img) => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.className =
        "rounded-xl object-cover h-20 w-full cursor-pointer hover:opacity-80";
      thumb.addEventListener("click", () => (mainImage.src = img));
      thumbsContainer.appendChild(thumb);
    });

    // WhatsApp order link
    const phone = "917439688236";
    const message = encodeURIComponent(
      `Hello Moumita's Bakery! 👋\nI’d like to order or know more about "${name}".`
    );
    orderBtn.onclick = () =>
      window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Show modal
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    setTimeout(() => {
      modalContent.classList.remove("opacity-0", "scale-95");
      modalContent.classList.add("opacity-100", "scale-100");
    }, 10);
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modalContent.classList.add("opacity-0", "scale-95");
    modalContent.classList.remove("opacity-100", "scale-100");
    setTimeout(() => modal.classList.add("hidden"), 300);
  });

  // Close modal when clicking outside content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal.click();
  });
});
