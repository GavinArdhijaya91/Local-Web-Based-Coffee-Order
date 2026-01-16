import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const API = "http://localhost:3000/api";

function parsePrice(str) {
  if (typeof str === "number") return Number(str);
  if (!str) return 0;
  return Number(String(str).replace(/[^\d]/g, "")) || 0;
}

function formatCurrency(num) {
  return new Intl.NumberFormat("id-ID").format(Number(num || 0));
}

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const menu = location.state?.menu || null;

  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const unitPrice = menu ? parsePrice(menu.price) : 0;
  const total = unitPrice * Number(qty || 0);

  async function submitOrder() {
    if (!name) return alert("Nama wajib diisi");
    if (!tableNumber) return alert("Nomor meja wajib diisi");
    if (!menu) {
      if (!confirm("Tidak memilih menu. Lanjutkan?")) return;
    }

    if (paymentMethod === "qris" && !paid) {
    alert("Silakan konfirmasi pembayaran QRIS terlebih dahulu 🙏");
    return;
    }

    const payload = {
      name,
      tableNumber,
      menu: menu ? { id: menu.id, name: menu.name, price: menu.price, image: menu.image } : null,
      qty: Number(qty),
      createdAt: new Date().toISOString(),
      paymentMethod,
      total,
      paid: paymentMethod === "qris" ? paid : false
    };

    try {
      setLoading(true);
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Gagal mengirim pesanan");
      }

      const body = await res.json();
      localStorage.setItem("lastOrderCode", body.orderCode || "");
      alert("Pesanan dikirim 🚀 (kode: " + (body.orderCode || "-") + ")");
      navigate("/");
    } catch (e) {
      alert("Gagal mengirim pesanan: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function dec() {
    setQty((p) => Math.max(1, Number(p) - 1));
  }
  function inc() {
    setQty((p) => Number(p) + 1);
  }

  return (
    <div className="order-wrapper">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Form Pesanan</h2>

        {menu && (
          <div className="mb-4 selected-item">
            <img src={menu.image} alt={menu.name} className="selected-thumb" />
            <div>
              <div style={{ fontWeight: 700 }}>{menu.name}</div>
              <div style={{ fontSize: 13, color: "#6b4b3a" }}>
                Harga: Rp {formatCurrency(unitPrice)}
              </div>
            </div>
          </div>
        )}

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Nama Pemesan"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Nomor Meja"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />

        <div className="flex gap-2 items-center mb-4">
          <button onClick={dec} aria-label="kurangi" className="qty-btn" type="button">−</button>

          <input
            type="number"
            min="1"
            className="qty-input w-full border p-2 rounded text-center"
            value={qty}
            readOnly
          />

          <button onClick={inc} aria-label="tambah" className="qty-btn" type="button">+</button>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Metode Pembayaran</label>
          <div style={{ display: "flex", gap: 8 }}>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="radio" name="pay" value="cash" checked={paymentMethod === "cash"} onChange={() => { 
                setPaymentMethod("cash");
                setPaid(false);
                }} />
              Cash
            </label>
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="radio" name="pay" value="qris" checked={paymentMethod === "qris"} onChange={() => setPaymentMethod("qris")} />
              QRIS
            </label>
          </div>
        </div>

        <div className="mb-4 total-row">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>Total</div>
            <div style={{ fontWeight: 800 }}>Rp {formatCurrency(total)}</div>
          </div>
        </div>

        {paymentMethod === "qris" && (
          <div className="qris-box mb-4">
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Scan QR untuk bayar</div>
            <div className="qris-visual">
              <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="qris-svg">
                <rect width="160" height="160" fill="#111" rx="8" />
                <rect x="12" y="12" width="40" height="40" fill="#fff" />
                <rect x="108" y="12" width="40" height="40" fill="#fff" />
                <rect x="12" y="108" width="40" height="40" fill="#fff" />
                <text x="80" y="90" fill="#fff" fontSize="12" fontFamily="VT323" textAnchor="middle">QRIS</text>
              </svg>
              <div style={{ marginLeft: 12 }}>
                <div>Jumlah yang harus dibayar</div>
                <div style={{ fontWeight: 800, marginTop: 6 }}>Rp {formatCurrency(total)}</div>
              </div>
            </div>

            <label className="qris-confirm" style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" className="qris-checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} />
              Saya sudah membayar (konfirmasi)
            </label>
          </div>
        )}

        <div className="flex gap-2">
          <button
          type="button"
          onClick={submitOrder}
          disabled={loading}
          className="flex-1 btn-primary">
          {loading ? "Mengirim..." : "Pesan"}
          </button>

          <button onClick={() => navigate("/")} className="flex-1 btn-ghost">Batal</button>
        </div>
      </div>
    </div>
  );
}