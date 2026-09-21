const orders = JSON.parse(localStorage.getItem("orders")) || [];
const tbody = document.getElementById("ordersBody");

if (!orders.length) {
  tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No orders yet.</td></tr>`;
} else {
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.date}</td>
      <td>${o.items.map(i => `${i.name} x ${i.qty}`).join(", ")}</td>
      <td>$${o.total.toFixed(2)}</td>
    </tr>
  `).join("");
}