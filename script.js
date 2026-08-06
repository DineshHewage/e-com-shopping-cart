const productListEl = document.getElementById("product-list");
const cartListEl = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total");

// Load the cart from the loacalStorage - always guaranteed to be an array.
let cart;
try {
  const store = JSON.parse(localStorage.getItem("cartItem"));
  cart = Array.isArray(store) ? store : [];
} catch (error) {
  cart = [];
}

// Static product caterlog - defined by the developer and never changers at runtime.
const products = [
  {
    id: "0001",
    description: "Polo Dry fit T-shirt(Size - S)",
    price: 5.5,
    quantity: 3,
    Image: "images/polo-t-shirt.jpg",
  },
  {
    id: "0002",
    description: "Single Jersey Crew neck T-shirt (Size - M)",
    price: 4.3,
    quantity: 15,
    Image: "images/T-Shirt-Black.jpg",
  },
  {
    id: "0003",
    description: "Slim fit long sleeve shirt(Size - 15 1/2)",
    price: 8.0,
    quantity: 20,
    Image: "images/LS-shirt.jpg",
  },
  {
    id: "0004",
    description: "Polo Slim Cotton Pant (Size - 34)",
    price: 10.5,
    quantity: 15,
    Image: "images/cotton-pant.jpg",
  },
  {
    id: "0005",
    description: "Cotton short(Size - 34)",
    price: 9.5,
    quantity: 17,
    Image: "images/cotton-short.jpg",
  },
];

// ─── Render products ────────────────────────────────────────────────────────
function renderProducts() {
  productListEl.innerHTML = "";

  // Display products in the products array on the screen.
  products.forEach((product) => {
    // [image] [product discription : price] [-] [Number] [+] [Add to cart Btn]

    const li = document.createElement("li");
    li.dataset.id = product.id; // Like varibles, don't have to define id and selectQty.
    li.dataset.selectQty = 0; // store selectQty on the element so event delegation can read it

    // product Image
    const productImg = document.createElement("img");
    productImg.src = product.Image;
    productImg.alt = product.description;
    productImg.classList.add("product-img");
    productImg.addEventListener("error", () => {
      productImg.style.display = "none";
    });

    //Product discription & price
    const productsSpan = document.createElement("span");
    productsSpan.textContent = `${product.description} : $${product.price.toFixed(2)}`;
    productsSpan.classList.add("product-info");

    // Error message (Shown when the user tries to exceed stock)
    const errorMsg = document.createElement("p");
    errorMsg.classList.add("qty-error");

    // Quantity display
    const qtyDisplay = document.createElement("span");
    qtyDisplay.textContent = 0;
    qtyDisplay.classList.add("qty-display");

    // Quntity controls wrapper
    const qtyWrapper = document.createElement("div");
    qtyWrapper.classList.add("qty-wrapper");

    // Minus button
    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("qty-btn");
    minusBtn.addEventListener("click", () => {
      let selectQty = Number(li.dataset.selectQty);
      if (selectQty > 0) {
        selectQty--;
        li.dataset.selectQty = selectQty;
        qtyDisplay.textContent = selectQty;
        errorMsg.textContent = "";
      }
    });

    // Plus button
    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("qty-btn", "plus-btn");

    plusBtn.addEventListener("click", () => {
      let selectQty = Number(li.dataset.selectQty);
      if (selectQty >= product.quantity) {
        // control point and Cannot exceed available stock
        errorMsg.textContent = `only ${product.quantity} is avilble in the stok`;
      } else {
        selectQty++;
        li.dataset.selectQty = selectQty;
        qtyDisplay.textContent = selectQty;
        errorMsg.textContent = ""; // clear error on valid increment
      }
    });

    // Add to cart button
    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Add to cart";
    addToCartBtn.classList.add("add-to-cart-btn");

    // Assemble quntity controls
    qtyWrapper.appendChild(minusBtn);
    qtyWrapper.appendChild(qtyDisplay);
    qtyWrapper.appendChild(plusBtn);

    // Assemble the full li
    li.appendChild(productImg);
    li.appendChild(productsSpan);
    li.appendChild(qtyWrapper);
    li.appendChild(errorMsg);
    li.appendChild(addToCartBtn);

    // Display
    productListEl.appendChild(li);
  });
}

// ─── Event delegation for product list ───────────────────────────────────────
// One listner on the <ui> handles all "Add to cart" clicks.
productListEl.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-to-cart-btn")) return;

  // Wlak up to the parent <li> to get the product id
  const li = e.target.closest("li");
  // console.log(li);
  // console.log(li.dataset.id);
  // console.log(li.dataset.selectQty);

  const seletedId = li.dataset.id;
  const seletedQty = Number(li.dataset.selectQty);
  addToCart(seletedId, seletedQty);
});

// ─── Cart functions ──────────────────────────────────────────────────────────
function addToCart(id, selectedQty) {
  // Not to accept o for number of items.
  // Find the product in products array by id.
  // Take the discription and price
  // Take the selected quntity by the user
  // Create a new Cart item by combining all three
  // push into cart
  // Call saveCart() to write cart to localstorage.
  // Call renderCart() to display items in the cart on the screen.

  // Block adding 0 item - User must select at least 1.
  if (selectedQty === 0) return;

  // find the selected product from the Products array.
  const selectedProduct = products.find((p) => p.id === id);

  // check if the selected product is avilable in the Cart
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    //Based on truthy and falsy, if the matching product does not exists in cart, existingItem = falsy.
    // Alredy exist in the cart and increase the quntity
    existingItem.quantity += selectedQty;
  } else {
    const cartItem = {
      id: selectedProduct.id,
      description: selectedProduct.description,
      price: selectedProduct.price,
      quantity: selectedQty,
    };

    cart.push(cartItem);
    //console.log(cart); // {id: '0005', description: 'Cotton short(Size - 34)', price: 9.5, quantity: 3}
  }

  saveCart();
  renderCart();
}

function saveCart() {
  try {
    // Save cart items in local-storage.
    localStorage.setItem("cartItem", JSON.stringify(cart));
  } catch {
    console.error("Could not save Cart to localstorage");
  }
}

function renderCart() {
  // Load items in cart to the screen
  cartListEl.innerHTML = "";

  if (cart.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "Your cart is empty";
    emptyMsg.classList.add("cart-empty-msg");
    cartListEl.appendChild(emptyMsg);
    cartTotalEl.textContent = "Total: $0.00";
    return;
  }

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.dataset.id = item.id;

    // [image] [product discription] [price:${price}] [Qty:${quntity}] [Remove button]

    // Item discription.
    const cartDiscription = document.createElement("span");
    cartDiscription.textContent = item.description;
    cartDiscription.classList.add("cart-item-desc");

    // Item quantity and price
    const cartQtyPrice = document.createElement("span");
    cartQtyPrice.textContent = `Qty : ${item.quantity} Price : $${(item.price * item.quantity).toFixed(2)}`;
    cartQtyPrice.classList.add("cart-item-detail");

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      removeFromCart(item.id);
    });

    li.appendChild(cartDiscription);
    li.appendChild(cartQtyPrice);
    li.appendChild(removeBtn);
    cartListEl.appendChild(li);
  });

  calculateTotal();
}

function removeFromCart(id) {
  cart = cart.filter((element) => element.id !== id);
  console.log(cart);

  saveCart();
  renderCart();
}

function calculateTotal() {
  let total = 0;
  cart.forEach((p) => {
    total += p.price * p.quantity;
  });
  cartTotalEl.textContent = `The total : $${total.toFixed(2)}`;
}

// ─── Initialise ─────────────────────────────────────────────────────────────
renderProducts();
renderCart();
