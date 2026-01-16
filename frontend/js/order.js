function order() {

  const paymentMethod = document.querySelector(
    'input[name="pay"]:checked'
  )?.value || "cash";

  const paid =
    paymentMethod === "qris"
      ? document.getElementById("paid")?.checked || false
      : false;

  fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      menu: document.getElementById("menu").value,
      qty: document.getElementById("qty").value,
      paymentMethod,
      paid,
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("ORDER CODE:", data.orderCode);
    localStorage.setItem("orderCode", data.orderCode);
    alert("Pesanan Dibuat");
    window.location.href = "customer-dashboard.html";  
  })
  .catch(err => {
    console.error(err);
    alert("Gagal membuat pesanan");
  });
}