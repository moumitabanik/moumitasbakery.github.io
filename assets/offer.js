document.addEventListener("DOMContentLoaded", () => {
  const phone = "917439688236";

  // Offer 1 (10% OFF)
  const offer1Btn = document.getElementById("offer1-btn");
  const msg1 = encodeURIComponent(
    `Hello Moumita's Bakery! 👋\nI’d like to know more about the *10% OFF Dry Cakes* Christmas Offer.`
  );
  offer1Btn.onclick = () =>
    window.open(`https://wa.me/${phone}?text=${msg1}`, "_blank");

  // Offer 2 (Free Cake Offer)
  const offer2Btn = document.getElementById("offer2-btn");
  const msg2 = encodeURIComponent(
    `Hello Moumita's Bakery! 👋\nI’d like to know more about the *Free Cake on purchase of 2 Christmas Cakes* offer.`
  );
  offer2Btn.onclick = () =>
    window.open(`https://wa.me/${phone}?text=${msg2}`, "_blank");

  
  // Offer 2 (Free Cake Offer)
  const offer3Btn = document.getElementById("offer3-btn");
  const msg3 = encodeURIComponent(
    `Hello Moumita's Bakery! 👋\nI’d like to know more about the *Free Cake on purchase Celebration Cakes* offer.`
  );
  offer3Btn.onclick = () =>
    window.open(`https://wa.me/${phone}?text=${msg3}`, "_blank");
});
