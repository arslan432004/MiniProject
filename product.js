const productContainer = document.getElementById('productContainer');
const backBtn = document.getElementById('backBtn');

// Get selected product from localStorage
const product = JSON.parse(localStorage.getItem('selectedProduct'));

if (!product) {
  productContainer.innerHTML = "<p>No product selected.</p>";
} else {
  // Display product details
  const img = document.createElement('img');
  img.src = product.thumbnail;
  img.alt = product.title;

  const title = document.createElement('h2');
  title.textContent = product.title;

  const desc = document.createElement('p');
  desc.textContent = product.description;

  const price = document.createElement('p');
  price.className = 'price';
  price.textContent = `$ ${product.price}`;

  productContainer.appendChild(img);
  productContainer.appendChild(title);
  productContainer.appendChild(desc);
  productContainer.appendChild(price);
}

// Back button
backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

