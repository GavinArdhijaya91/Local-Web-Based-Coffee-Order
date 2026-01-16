import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MenuCard from "../components/MenuCard";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = "http://localhost:3000/api";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders`);
      if (!res.ok) throw new Error("Gagal mengambil pesanan");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    const id = setInterval(loadOrders, 12000);
    return () => clearInterval(id);
  }, []);

  const menus = [
    { id: 1, name: "Kopi Susu", price: "10.000", image: "/src/assets/menu/Kopi-Susu.jpg" },
    { id: 2, name: "Americano Coffee", price: "16.000", image: "/src/assets/menu/Kopi-Americano.jpg" },
    { id: 3, name: "Teh Melati", price: "7.000", image: "/src/assets/menu/Teh-Melati.jpg" },
    { id: 4, name: "Roti Bakar Rasa Keju", price: "12.000", image: "/src/assets/menu/Roti-Bakar-Keju.png" },
  ];

  const formatTime = (ts) => {
    if (!ts) return "—";
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return String(ts);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="wrapper">
        <h1 className="page-title">| Menu Hari Ini |</h1>

        {loading ? (
          <div style={{ color: "#fff", marginBottom: 12 }}>Memuat pesanan...</div>
        ) : orders.length > 0 ? (
          <section className="order-section w-full mb-6">
            <h2 className="order-section-title">Pesanan Anda</h2>
            <div className="order-list">
              {orders.map((o) => (
                <div key={o.id} className={`order-item ${o.status === "selesai" ? "selesai" : ""}`}>
                  <div className="order-item-inner">
                    <div className="order-left">
                      { (o.menu?.image || o.itemImage) && (
                        <img
                          src={o.menu?.image ?? o.itemImage}
                          alt={o.menu?.name ?? o.itemName}
                          className="order-thumb"
                        />
                      )}
                      <div className="order-info">
                        <div className="order-name">{o.menu?.name ?? o.itemName ?? "(tidak ada item)"}</div>
                        <div className="order-meta">
                          Pemesan: <strong>{o.name}</strong>
                          <span className="sep"> | </span>
                          Meja: <span className="order-table">{o.tableNumber ?? (o.table ?? "—")}</span>
                          <span className="sep"> | </span>
                          Jumlah: <span className="order-qty">{o.qty ?? "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-right">
                      <span className={`status-badge ${o.status}`}>{o.status}</span>
                      
                      <div className="order-time">Dipesan: {formatTime(o.createdAt ?? o.created_at ?? o.timestamp)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div style={{ color: "#fff", marginBottom: 12 }}>Belum ada pesanan.</div>
        )}

        <div className="center-grid">
          {menus.map((menu, idx) => (
            <MenuCard
              key={menu.id}
              index={idx}
              {...menu}
              onOrder={() => navigate("/order", { state: { menu } })}
            />
          ))}
        </div>

        <footer className="shop-footer">
        <div className="shop-footer-inner">
          <div className="shop-info">
            <div className="shop-name">HAZELAA</div>
            <div className="shop-info2">More Information</div>

                <div className="shop-contact">
                  <a href="https://wa.me/089523774286"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="green" className="bi bi-whatsapp" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg> 0895 2377 4286</a>
                  <a href="https://instagram.com/gavin.ardhijaya" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="palevioletred" className="bi bi-instagram" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                  </svg> @hazel400</a>
                  <a href="https://tiktok.com/@namakopi" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="black" className="bi bi-tiktok" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                  </svg> @hazel401</a>
                </div>
            </div>
          </div>
        </footer>
      </div>

    <nav className="feedback-nav">
    <span className="feedback-text left">Kritik</span>

    <a
    href="https://forms.gle/h5tkzVYZdRPfVLgG9"
    target="_blank"
    className="feedback-btn"
    aria-label="Saran dan Kritik">
    📜
    </a>

    <span className="feedback-text right">Saran</span>
    </nav>

    </div>

    
  );

  
}