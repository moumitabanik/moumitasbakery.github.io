function trackAndOpenWhatsApp(productName, price) {
  const phone = "917439688236";
  const ref = crypto.randomUUID().slice(0, 6);

  // CLEAN PRICE → remove ₹ and commas
  const cleanedPrice = Number(price.replace(/[^0-9.]/g, ""));

  fetch('/.netlify/functions/trackclick', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productName, price: cleanedPrice, ref }),
  });

  const msg = encodeURIComponent(
    `Hello Moumita's Bakery! 👋\n` +
    `I want to order *${productName}* (₹${cleanedPrice}).\n` +
    `Ref: ${ref}`
  );

  window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
}
