//Define the variables at the top
const productDiv = document.getElementById("productDiv");
const categoryList = document.getElementById("category");
const allCat = []; // Ensure allCat is declared here
// let cart = JSON.parse(localStorage.getItem("cart")) || []; // Get existing cart from localStorage
const viewCartDiv = document.querySelector(".viewCart");

let isAddingToCart = false; // Flag to prevent multiple additions
let clickCount = 0; // Debug: track number of clicks

// Modal and search elements
const searchInput = document.getElementById("searchInput");
const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalContent = document.getElementById("modalContent");

// Function to reset the cart
function resetCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCartUI();
}

let cart = [];

function removeEventListeners() {
  const cartButtons = productDiv.querySelectorAll(".addtoCart");
  cartButtons.forEach((button) => {
    button.removeEventListener("click", addToCartHandler);
  });
}

const displayProduct = async (allCheckCat = []) => {
  console.log("displayProduct called with categories:", allCheckCat);
  productDiv.innerHTML = "";
  const product = await fetch('https://fakestoreapi.com/products');
  const finalProduct = await product.json();

  finalProduct.forEach((element) => {
    const description = element.description;

    // Check if the category is already added
    if (!allCat.includes(element.category)) {
      allCat.push(element.category);
      categoryList.innerHTML += `
        <label for="product" class="flex gap-[5px]">
          <input type="checkbox" onclick="catFun()" value="${element.category}">${element.category}
        </label>
      `;
    }

    if (allCheckCat.length === 0 || allCheckCat.includes(element.category)) {
      productDiv.innerHTML += `
        <div class="w-[100%] shadow-lg pb-[10px] pt-[10px] cursor-pointer flex flex-col justify-between">
          <div class="flex justify-center">
            <img src="${element.image}" alt="img" class="w-[150px] h-[150px]">
          </div>
          <div class="flex flex-col gap-[0.5rem] pl-[10px] pt-[10px] pr-[10px]">
            <h1 class="text-[14px] font-bold">${element.title}</h1>
            <p class="text-[12px] text-gray-500">
              <span class="text-[14px] font-semibold text-gray-700">Description</span>: ${description.length > 20 ? description.substring(0, 20).concat('...More') : description}
            </p>
            <div class="flex justify-between text-[14px] font-semibold text-gray-700">
              <p>Rs. ${element.price}</p>
              <p>${element.rating.rate}</p>
            </div>
            <button class="addtoCart bg-purple-400 p-[10px] rounded text-white hover:bg-purple-500 focus:outline-none active:bg-purple-400"
              data-image="${element.image}" data-title="${element.title}" data-price="${element.price}">
              Add To Cart
            </button>
          </div>
        </div>`;
    }
  });

  // Attach event listeners
  setupCartButtons();
};

function setupCartButtons() {
  console.log("Setting up cart buttons");
  const cartButtons = productDiv.querySelectorAll(".addtoCart");
  cartButtons.forEach((button, index) => {
    console.log(`Setting up button ${index}`);
    button.removeEventListener("click", addToCartHandler);
    button.addEventListener("click", addToCartHandler);
  });
}

function addToCartHandler(event) {
  clickCount++;
  console.log(`Button clicked. Click count: ${clickCount}`);
  console.log("Event target:", event.target);
  console.log("Current target:", event.currentTarget);
  
  event.preventDefault();
  event.stopPropagation();
  
  if (isAddingToCart) {
    console.log("Already processing a cart addition. Ignoring this click.");
    return;
  }
  
  isAddingToCart = true;
  
  const productImage = this.getAttribute("data-image");
  const productTitle = this.getAttribute("data-title");
  const productPrice = this.getAttribute("data-price");
  
  console.log("Before addtoCart call");
  addtoCart(productImage, productTitle, productPrice);
  console.log("After addtoCart call");
  
  isAddingToCart = false;
}

function addtoCart(productImage, productTitle, productPrice) {
  console.log("addtoCart function called");
  console.log(`ProductImage: ${productImage}`);
  console.log(`ProductTitle: ${productTitle}`);
  console.log(`ProductPrice: ${productPrice}`);

  // Create product object
  const product = {
    image: productImage,
    title: productTitle,
    price: productPrice,
    quantity: 1
  };

  // Check if the product already exists in the cart
  const existingProductIndex = cart.findIndex(item => item.title === productTitle && item.price === productPrice);

  if (existingProductIndex !== -1) {
    console.log("Product exists, incrementing quantity");
    cart[existingProductIndex].quantity += 1;
  } else {
    console.log("Adding new product to cart");
    cart.push(product);
  }

  // Update localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  console.log("Current cart state:", JSON.stringify(cart, null, 2));
  
  // Optionally, update the UI to reflect the cart change
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartValueElement = document.getElementById("cartValue");
  if (cartValueElement) {
    cartValueElement.textContent = totalItems;
  }
  console.log("Cart updated. Total items:", totalItems);
}

// Search functionality
searchInput.addEventListener("input", function() {
  const searchTerm = searchInput.value.toLowerCase();
  
  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(products => {
      const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));
      if (filteredProducts.length > 0) {
        showModal(filteredProducts[0]);
      }
    });
});

// Show the modal with a transition
function showModal(product) {
  modalContent.innerHTML = `
    <h1 class="text-lg font-bold">${product.title}</h1>
    <img src="${product.image}" alt="${product.title}" class="w-[200px] h-[200px] mx-auto">
    <p class="text-gray-700">${product.description}</p>
    <p class="text-xl font-semibold">Price: $${product.price}</p>
  `;
  
  // Add 'show' class to initiate the smooth transition
  productModal.classList.add("show");
}

// Close modal with a transition
closeModal.addEventListener("click", function() {
  productModal.classList.remove("show");
});

window.addEventListener("click", function(event) {
  if (event.target === productModal) {
    productModal.classList.remove("show");
  }
});
// View Cart
// const viewCartButton = document.querySelector('.viewCart');
// viewCartButton.addEventListener("click", ()=>{
//   window.location.href="cart.html"
// });

function catFun() {
  console.log("catFun called");
  const checkInput = document.querySelectorAll("input[type='checkbox']");
  const checkData = Array.from(checkInput).filter(e => e.checked).map(e => e.value);
  console.log("Selected categories:", checkData);
  displayProduct(checkData);
}

// Initial call to display products
console.log("Initial displayProduct call");
resetCart();
displayProduct();