// ---------- Settings & state ----------
const MAX_HISTORY = 5;

let allProducts = [];       // flat list of every product
let recentlyViewed = [];    // newest product is at index 0

// ---------- Page elements ----------
const productGrid = document.getElementById("productGrid");
const recentContainer = document.getElementById("recentlyViewed");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModalBtn");

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
  button.className = "btn";
  button.textContent = "View Product";
  button.addEventListener("click", function () {
    viewProduct(product.id);
  });
  card.appendChild(button);

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
