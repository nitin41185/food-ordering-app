let menuItems = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Fallback data if AJAX fails
const fallbackMenu = [
  { id: 1, name: "Cheese Burger", category: "Burger", price: 13, rating: 4.3, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
  { id: 2, name: "Elk Burger", category: "Burger", price: 15, rating: 4.3, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
  { id: 3, name: "Burrito", category: "Burrito", price: 10, rating: 4.5, img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400" },
  { id: 4, name: "Chocolate Dessert", category: "Desserts", price: 8, rating: 4.7, img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400" },
  { id: 5, name: "Donuts", category: "Donuts", price: 6, rating: 4.2, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400" },
  { id: 6, name: "Pizza", category: "Pizza", price: 12, rating: 4.6, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" }
];

// AJAX call to load menu
async function loadMenu() {
  try {
    const res = await fetch("data/menu.json");
    menuItems = await res.json();
  } catch (e) {
    console.warn("AJAX failed, using fallback data.");
    menuItems = fallbackMenu;
  }
  renderMenu(menuItems);
  updateCartCount();
}

function renderMenu(items) {
  const grid = document.getElementById("foodGrid");
  if (!items.length) {
    grid.innerHTML = `<p class="text-muted">No items found.</p>`;
    return;
  }
  grid.innerHTML = items.map(item => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card food-card h-100">
        <div class="position-relative">
          <img src="${item.img}" class="card-img-top" alt="${item.name}">
          <span class="badge bg-dark position-absolute top-0 start-0 m-2">⭐ ${item.rating}</span>
          <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2" onclick="toggleWishlist(${item.id})">
            <i class="bi ${wishlist.includes(item.id) ? "bi-heart-fill text-danger" : "bi-heart"}"></i>
          </button>
        </div>
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text fw-bold">Price : $${item.price}</p>
          <button class="btn btn-warning w-100" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${item.name} added to cart!`);
}

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(i => i !== id);
  } else {
    wishlist.push(id);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderMenu(menuItems);
}

function showCart() {
  const modalBody = document.getElementById("cartItems");
  if (!cart.length) {
    modalBody.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    modalBody.innerHTML = cart.map(i => `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span>${i.name} x ${i.qty}</span>
        <span>$${(i.price * i.qty).toFixed(2)}</span>
      </div>
    `).join("");
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    modalBody.innerHTML += `
      <hr>
      <div class="d-flex justify-content-between fw-bold">
        <span>Total</span><span>$${total.toFixed(2)}</span>
      </div>`;
  }
  new bootstrap.Modal(document.getElementById("cartModal")).show();
}

function checkout() {
  if (!cart.length) return alert("Cart is empty");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = {
    id: Date.now(),
    items: cart,
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    date: new Date().toLocaleString()
  };
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  bootstrap.Modal.getInstance(document.getElementById("cartModal")).hide();
  alert("Order placed successfully!");
}

function searchFood() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const filtered = menuItems.filter(i =>
    i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
  );
  renderMenu(filtered);
}

function filterCategory(cat) {
  document.getElementById("categoryTitle").textContent = cat === "All" ? "All Items" : cat;
  if (cat === "All") renderMenu(menuItems);
  else renderMenu(menuItems.filter(i => i.category === cat));
}

function showOrders() {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (!orders.length) return alert("No orders yet.");
  alert(orders.map(o => `Order #${o.id}\n${o.date}\nTotal: $${o.total.toFixed(2)}`).join("\n\n"));
}

function showWishlist() {
  const items = menuItems.filter(i => wishlist.includes(i.id));
  if (!items.length) return alert("Wishlist is empty.");
  alert("Wishlist:\n" + items.map(i => i.name).join("\n"));
}

document.addEventListener("DOMContentLoaded", loadMenu);