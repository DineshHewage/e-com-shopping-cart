const productLists = document.getElementById("product-list");

let products = [
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

function renderProducts() {
  products.forEach((product) => {
    let selectQty = 0;
    const li = document.createElement("li");
    li.dataset.id = product.id;

    //[product discription : price] [image] [-] [Number] [+] [Add to cart Btn]

    //Product discription & price
    const productsSpan = document.createElement("span");
    productsSpan.textContent = `${product.description} : $${product.price.toFixed(2)}`;
    productsSpan.classList.add("product-info");

    // Image
    const productImg = document.createElement("img");
    productImg.src = product.Image;
    productImg.alt = product.description;
    productImg.classList.add("product-img");

    // Quntity controls wrapper
    const qtyWrapper = document.createElement("div");
    qtyWrapper.classList.add("qty-wrapper");

    // Error message
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "";
    errorMsg.classList.add("qty-error");

    // Minus button
    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("qty-btn");
    minusBtn.addEventListener("click", () => {
      if (selectQty > 0) {
        selectQty--;
        qtyDisplay.textContent = selectQty;
      }
    });

    // Quantity display
    const qtyDisplay = document.createElement("span");
    qtyDisplay.textContent = 0;
    qtyDisplay.classList.add("qty-display");

    // Plus button
    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("qty-btn");

    plusBtn.addEventListener("click", () => {
      if (selectQty >= product.quantity) {
        errorMsg.textContent = `only ${product.quantity} is avilble in the stok`;
      } else {
        selectQty++;
        qtyDisplay.textContent = selectQty;
        errorMsg.textContent = ""; // clear error on valid increment
      }
    });

    // Add to cart button
    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Add to cart";
    addToCartBtn.classList.add("add-to-cart-btn");
    addToCartBtn.addEventListener("click", () => {
      addProductToCart(product.id);
    });

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

    productLists.appendChild(li);
  });
}

renderProducts();

// addProductToCart();
