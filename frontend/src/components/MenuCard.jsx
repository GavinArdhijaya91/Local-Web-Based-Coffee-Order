export default function MenuCard({ name, price, image, onOrder, index = 0 }) {
  return (
    <div className="menu-card" style={{ ["--order"]: index }}>
      <img src={image} alt={name} />
      <div className="menu-card-content">
        <h3>{name}</h3>
        <p>Rp {price}</p>
        <button onClick={onOrder}>Order</button>
      </div>
    </div>
  );
}