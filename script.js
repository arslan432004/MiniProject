const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestionsBox = document.getElementById("suggestions");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

// load history from localStorage
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

let allProducts = [];
let currentPage = 1;
const itemsPerPage = 7; // adjust as needed

// --------------------------
// Display products with pagination
function displayProducts(products) {
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML = "<p>No products found</p>";
    pageInfo.textContent = "";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = products.slice(start, end);

  paginatedProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = product.thumbnail;
    img.alt = product.title;

    const title = document.createElement("h3");
    title.textContent = product.title;

    const desc = document.createElement("p");
    desc.textContent = product.description.slice(0, 60) + "...";

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `₹ ${product.price}`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);

    // redirect on click
    card.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "product.html";
    });

    productsContainer.appendChild(card);
  });

  // update pagination info
  const totalPages = Math.ceil(products.length / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// --------------------------
// Search functionality
function searchProducts() {
  const value = searchInput.value.toLowerCase().trim();
  if (!value) return;

  // store search history
  if (!searchHistory.includes(value)) {
    searchHistory.push(value);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  const filtered = allProducts.filter(product =>
    product.title.toLowerCase().includes(value)
  );

  currentPage = 1; // reset to first page on new search
  displayProducts(filtered);
  suggestionsBox.innerHTML = ""; // clear suggestions after search
}

// --------------------------
// Fetch products
function fetchProducts() {
  return new Promise((resolve, reject) => {
    fetch("https://dummyjson.com/products")
      .then(res => res.json())
      .then(data => resolve(data.products))
      .catch(err => reject(err));
  });
}

fetchProducts()
  .then(products => {
    allProducts = products;
    displayProducts(products);
  })
  .catch(err => {
    productsContainer.innerHTML = "<p>Failed to load products</p>";
    console.error(err);
  });

// --------------------------
// Event listeners

// Search
searchBtn.addEventListener("click", searchProducts);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchProducts();
});

// Suggestions while typing
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!value) return;

  const matchedHistory = searchHistory.filter(item =>
    item.startsWith(value)
  );

  matchedHistory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;

    li.addEventListener("click", () => {
      searchInput.value = item;
      searchProducts();
    });

    suggestionsBox.appendChild(li);
  });
});

// --------------------------
// Pagination buttons
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    displayProducts(filtered);
  }
});

nextBtn.addEventListener("click", () => {
  const filtered = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayProducts(filtered);
  }
});
