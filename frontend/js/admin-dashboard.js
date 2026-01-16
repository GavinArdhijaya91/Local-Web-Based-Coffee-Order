const token = localStorage.getItem("token");
const tbody = document.getElementById("order-list");
const API = "http://localhost:3000/api";

if (!token) {
  window.location.href = "login.html";
}

async function loadOrders() {
  try {
    const res = await fetch(`${API}/admin/orders`, {
      headers: { Authorization: "Bearer " + token }
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      }
      throw new Error("Gagal mengambil orders");
    }
    const data = await res.json();
    renderOrders(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="8" class="muted">Gagal memuat pesanan.</td></tr>`;
  }
}

function renderOrders(orders) {
  tbody.innerHTML = "";

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="muted">Belum ada pesanan.</td></tr>`;
    return;
  }

  orders.forEach(order => {
    const menuName =
      (order.menu && (order.menu.name || order.menu)) ||
      order.itemName ||
      "-";

    const table = order.tableNumber ?? order.table ?? "-";
    const qty = order.qty ?? "-";
    const created = order.createdAt || order.created_at || order.timestamp || null;
    const createdStr = created ? new Date(created).toLocaleString() : "-";
    const paymentMethod = order.paymentMethod ?? order.payment_method ?? (order.paid ? "qris" : "-");
    const total = order.total != null
      ? Number(order.total)
      : (order.menu?.price ? Number(String(order.menu.price).replace(/[^\d]/g,'')) * (order.qty || 1) : "-");
    const paid = order.paid ? "Sudah bayar" : "-";

    if ((order.status || "").toLowerCase() === "selesai") {
      const finishedAt = order.finishedAt ? new Date(order.finishedAt).getTime() : null;
      const now = Date.now();
      if (finishedAt && now - finishedAt >= 60 * 1000) {
        return;
      }
    }

    const tr = document.createElement("tr");


    tr.innerHTML = `
      <td>
        <div class="small">${escapeHtml(order.name || "-")}</div>
        <div class="muted">kode: ${escapeHtml(order.orderCode || String(order.id || "-"))}</div>
      </td>

      <td>
        <div class="small">${escapeHtml(menuName)}</div>
      </td>

      <td>${escapeHtml(String(table))}</td>
      <td>${escapeHtml(String(qty))}</td>

      <td>
        <div class="small">${escapeHtml(String(paymentMethod))}</div>
        ${total !== "-" ? 
        
        `<div class="small muted">Rp ${new Intl.NumberFormat('id-ID').format(total)}</div>` : "" }
        ${paid ? 
        
        `<div class="small" title="Status bayar">${escapeHtml(paid)}</div>` : "" }
      </td>

      <td class="status-cell">${escapeHtml(String(order.status ?? "-"))}</td>

      <td class="small muted">${escapeHtml(createdStr)}</td>

      <td class="center action-cell">
        <select data-id="${order.id}">
          <option value="pending">pending</option>
          <option value="diproses">diproses</option>
          <option value="selesai">selesai</option>
        </select>
      </td>
    `;

    const select = tr.querySelector("select");
    if (select) {
      select.value = order.status || "pending";
      select.addEventListener("change", () => updateStatus(order.id, select.value));
    }

    tbody.appendChild(tr);
    if ((order.status || "").toLowerCase() === "selesai") {
      const finishedAt = order.finishedAt ? new Date(order.finishedAt).getTime() : Date.now();
      const now = Date.now();
      const elapsed = now - finishedAt;
      const remaining = Math.max(0, 60 * 1000 - elapsed);

      tr.style.transition = "opacity 600ms ease, transform 600ms ease";

      const timeoutId = setTimeout(() => {
        tr.style.opacity = "0";
        tr.style.transform = "translateY(-6px)";
        setTimeout(() => {
          if (tr.parentNode) tr.parentNode.removeChild(tr);
        }, 600);
      }, remaining);

      if (select) {
        select.addEventListener("focus", () => clearTimeout(timeoutId));
      }
    }
  });
}

async function updateStatus(id, status) {
  try {
    const res = await fetch(`${API}/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      }
      throw new Error("Gagal mengubah status");
    }

    await loadOrders();
  } catch (e) {
    alert("Gagal memperbarui status: " + e.message);
    console.error(e);
  }
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadOrders();