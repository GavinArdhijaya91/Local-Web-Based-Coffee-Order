function deleteOrder() {
  const orderCode = localStorage.getItem("orderCode");
  if (!orderCode) return alert("Tidak ada pesanan");

  if (!confirm("Yakin ingin membatalkan pesanan?")) return;

  fetch(`http://localhost:3000/api/orders/${orderCode}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(msg => {
      alert(msg.message);
      localStorage.removeItem("orderCode");
      window.location.href = "order.html";
    })
    .catch(() => {
      alert("Gagal membatalkan pesanan");
    });
}

function showDeleteButton() {
  if (localStorage.getItem("orderCode")) {
    document.getElementById("deleteBtn").hidden = false;
  }
}

showDeleteButton();

function loadStatus() {
  const orderCode = localStorage.getItem("orderCode");
  if (!orderCode) return;

  fetch(`http://localhost:3000/api/orders/${orderCode}`)
    .then(res => res.json())
    .then(order => {
      document.getElementById("statusText").innerText = order.status;

      if (order.status === "pending") {
        document.getElementById("deleteBtn").hidden = false;
      } else {
        document.getElementById("deleteBtn").hidden = true;
      }
    })
    .catch(() => {
      document.getElementById("statusText").innerText = "Pesanan tidak ditemukan";
    });
}

loadStatus();