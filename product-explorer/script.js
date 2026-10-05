// ---------- Settings & state ----------
const MAX_HISTORY = 5;

let allProducts = [];       // flat list of every product
let recentlyViewed = [];    // newest product is at index 0
let cart = [];              // each cart item stores a product and its quantity
let undoStack = [];          // previous cart actions
let redoStack = [];          // actions that can be applied again

// ---------- Page elements ----------
const productGrid = document.getElementById("productGrid");
const recentContainer = document.getElementById("recentlyViewed");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModalBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

// ---------- Data ----------
// data.js groups products by category, so we collect them into one flat array.
function getAllProducts() {
  const list = [];
  if (typeof storeData === "undefined" || !storeData.categories) {
    return list;
  }
  storeData.categories.forEach(function (category) {
    category.products.forEach(function (product) {
      list.push(product);
    });
  });
  return list;
}

// ---------- Small helpers ----------
function formatPrice(price) {
  return "₹" + Number(price || 0).toLocaleString("en-IN");
}

function getRatingText(product) {
  if (product.rating === undefined || product.rating === null) {
    return "No ratings yet";
  }
  const reviews = product.reviews || 0;
  return "★ " + product.rating + " (" + reviews + " reviews)";
}

// Image box: shows the image if it exists, otherwise the emoji icon.
function createMedia(product) {
  const box = document.createElement("div");
  box.className = "card-media";
  box.textContent = product.icon || "📦";

  if (product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.onload = function () {
      box.textContent = "";
      box.appendChild(img);
    };
    // If the image fails to load, the emoji stays.
  }
  return box;
}

// ---------- All Products ----------
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "card";

  card.appendChild(createMedia(product));

  const name = document.createElement("h3");
  name.textContent = product.name;
  card.appendChild(name);

  const brand = document.createElement("div");
  brand.className = "brand";
  brand.textContent = product.brand || "Unknown brand";
  card.appendChild(brand);

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = formatPrice(product.price);
  card.appendChild(price);

  const rating = document.createElement("div");
  rating.className = "rating";
  rating.textContent = getRatingText(product);
  card.appendChild(rating);

  const button = document.createElement("button");
  button.className = "btn btn-ghost add-to-cart-btn";
  button.textContent = "Add to Cart";
  button.addEventListener("click", function () {
    addToCart(product.id);
  });
  card.appendChild(button);

  const viewButton = document.createElement("button");
  viewButton.className = "btn";
  viewButton.textContent = "View Product";
  viewButton.addEventListener("click", function () {
    viewProduct(product.id);
  });
  card.appendChild(viewButton);

  return card;
}

function displayProducts() {
  productGrid.innerHTML = "";

  if (allProducts.length === 0) {
    productGrid.innerHTML = '<p class="empty-state">No products available.</p>';
    return;
  }
  allProducts.forEach(function (product) {
    productGrid.appendChild(createProductCard(product));
  });
}

// ---------- Viewing a product ----------
function viewProduct(productId) {
  const product = allProducts.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    console.warn("Product not found: " + productId);
    return;
  }

  addToRecentlyViewed(product);
  displayRecentlyViewed();
  showProductDetails(product);
}

// ---------- Recently Viewed (core logic) ----------
function addToRecentlyViewed(product) {
  // 1. Remove the product if it is already in the history (checked by id)
  recentlyViewed = recentlyViewed.filter(function (item) {
    return item.id !== product.id;
  });

  // 2. Put it at the beginning
  recentlyViewed.unshift(product);

  // 3. Keep only 5: remove the oldest (last) item if too long
  if (recentlyViewed.length > MAX_HISTORY) {
    recentlyViewed.pop();
  }
}

function displayRecentlyViewed() {
  recentContainer.innerHTML = "";

  if (recentlyViewed.length === 0) {
    recentContainer.innerHTML = '<p class="empty-state">No recently viewed products.</p>';
    return;
  }

  recentlyViewed.forEach(function (product, index) {
    const item = document.createElement("div");
    item.className = "recent-item";
    if (index === 0) {
      item.classList.add("newest");
    }

    item.appendChild(createMedia(product));

    const name = document.createElement("strong");
    name.textContent = product.name;
    item.appendChild(name);

    const price = document.createElement("small");
    price.textContent = formatPrice(product.price);
    item.appendChild(price);

    // Clicking a recent item reopens its details
    item.addEventListener("click", function () {
      viewProduct(product.id);
    });

    recentContainer.appendChild(item);
  });
}

function clearHistory() {
  recentlyViewed = [];
  displayRecentlyViewed();
}

// ---------- Cart and undo/redo stacks ----------
function getCartQuantity(productId) {
  const item = cart.find(function (cartItem) {
    return cartItem.product.id === productId;
  });
  return item ? item.quantity : 0;
}

function changeCartQuantity(productId, newQuantity) {
  const product = allProducts.find(function (item) {
    return item.id === productId;
  });
  if (!product) return;

  const previousQuantity = getCartQuantity(productId);
  if (previousQuantity === newQuantity) return;

  // Store both quantities so Undo and Redo can restore either state.
  undoStack.push({
    productId: productId,
    previousQuantity: previousQuantity,
    newQuantity: newQuantity
  });
  // A new action starts a new history, so old redo actions are discarded.
  redoStack = [];
  applyCartQuantity(productId, newQuantity);
}

function applyCartQuantity(productId, quantity) {
  const product = allProducts.find(function (item) {
    return item.id === productId;
  });
  if (!product) return;

  const item = cart.find(function (cartItem) {
    return cartItem.product.id === productId;
  });

  if (quantity <= 0) {
    cart = cart.filter(function (cartItem) {
      return cartItem.product.id !== productId;
    });
  } else if (item) {
    item.quantity = quantity;
  } else {
    cart.push({ product: product, quantity: quantity });
  }

  displayCart();
}

function addToCart(productId) {
  changeCartQuantity(productId, getCartQuantity(productId) + 1);
}

function removeFromCart(productId) {
  if (getCartQuantity(productId) > 0) {
    changeCartQuantity(productId, 0);
  }
}

function undoCartAction() {
  if (undoStack.length === 0) return;

  const action = undoStack.pop();
  redoStack.push(action);
  applyCartQuantity(action.productId, action.previousQuantity);
}

function redoCartAction() {
  if (redoStack.length === 0) return;

  const action = redoStack.pop();
  undoStack.push(action);
  applyCartQuantity(action.productId, action.newQuantity);
}

function displayCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
  } else {
    cart.forEach(function (cartItem) {
      const product = cartItem.product;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.appendChild(createMedia(product));

      const details = document.createElement("div");
      details.className = "cart-item-details";

      const name = document.createElement("strong");
      name.textContent = product.name;
      details.appendChild(name);

      const quantity = document.createElement("span");
      quantity.textContent = "Quantity: " + cartItem.quantity;
      details.appendChild(quantity);

      const subtotal = document.createElement("span");
      subtotal.textContent = formatPrice(product.price) + " each";
      details.appendChild(subtotal);
      row.appendChild(details);

      const removeButton = document.createElement("button");
      removeButton.className = "btn btn-ghost remove-from-cart-btn";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", function () {
        removeFromCart(product.id);
      });
      row.appendChild(removeButton);

      cartItemsContainer.appendChild(row);
      total += product.price * cartItem.quantity;
    });
  }

  cartTotal.textContent = formatPrice(total);
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;
}

// ---------- Modal ----------
function showProductDetails(product) {
  modalContent.innerHTML = "";
  modalContent.appendChild(createMedia(product));

  const title = document.createElement("h2");
  title.textContent = product.name;
  modalContent.appendChild(title);

  const brand = document.createElement("div");
  brand.className = "brand";
  brand.textContent = product.brand || "Unknown brand";
  modalContent.appendChild(brand);

  const price = document.createElement("div");
  price.className = "price";
  price.textContent = formatPrice(product.price);
  modalContent.appendChild(price);

  const rating = document.createElement("div");
  rating.className = "rating";
  rating.textContent = getRatingText(product);
  modalContent.appendChild(rating);

  const description = document.createElement("p");
  description.textContent = product.description || "No description available.";
  modalContent.appendChild(description);

  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

// ---------- Events ----------
clearHistoryBtn.addEventListener("click", clearHistory);
closeModalBtn.addEventListener("click", closeModal);
undoBtn.addEventListener("click", undoCartAction);
redoBtn.addEventListener("click", redoCartAction);

// Click on the dark area outside the modal box closes it
modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// ---------- Start ----------
allProducts = getAllProducts();
displayProducts();
displayRecentlyViewed();
displayCart();
