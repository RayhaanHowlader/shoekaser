










// Add to Cart functionality


document.addEventListener("DOMContentLoaded", function () {
  const cartKey = "shoppingCart";

  // Load Cart from localStorage
  function loadCart() {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  }

  // Save Cart to localStorage
  function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }




  // Update the Subtotal
function updateSubtotal() {
  const cart = loadCart();
  const subtotalElement = document.querySelector(".subtotal strong");

  // If the cart is empty, set subtotal to 0
  if (cart.length === 0) {
    subtotalElement.textContent = `$0.00`;
  } else {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  }
}
updateSubtotal();
  // // Update the Subtotal
  // function updateSubtotal() {
  //   const cart = loadCart();
  //   const subtotalElement = document.querySelector(".subtotal strong");
  //   const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  //   subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  // }

  // Render Cart Items
  function renderCart() {
    const cart = loadCart();
    const cartList = document.querySelector(".cart_responsive");
    cartList.innerHTML = ""; // Clear current list

    if (cart.length === 0) {
      cartList.innerHTML = `<div class="empty-cart">Your cart is empty.</div>`;
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("tr_item");
      cartItem.innerHTML = `
        <div class="td_item item_img">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="td_item item_name">
          <label class="main">${item.name}</label><br />
          <label class="sub">Ref. ${item.ref}</label>
        </div>
        <div class="td_item item_color">
          <label>${item.color}</label>
        </div>
        <div class="td_item item_qty">
          <select data-index="${index}" class="quantity-selector">
            ${[...Array(10).keys()].map((x) =>
              `<option value="${x + 1}" ${item.quantity === x + 1 ? "selected" : ""}>${x + 1}</option>`
            )}
          </select>
        </div>
        <div class="td_item item_price">
          <label data-price="${item.price}">$ ${(item.price * item.quantity).toFixed(2)}</label>
        </div>
        <div class="td_item item_remove">
          <span class="material-icons-outlined remove-item" data-index="${index}">&#10005;</span>
        </div>
      `;
      cartList.appendChild(cartItem);
    });

    updateSubtotal();
    
  }

  // Add Event Listeners
  document.body.addEventListener("click", function (e) {
    // Remove Item
    if (e.target.classList.contains("remove-item")) {
      const index = e.target.dataset.index;
      const cart = loadCart();
      cart.splice(index, 1); // Remove item from cart
      saveCart(cart);
      renderCart();
    }
  });

  document.body.addEventListener("change", function (e) {
    // Update Quantity
    if (e.target.classList.contains("quantity-selector")) {
      const index = e.target.dataset.index;
      const cart = loadCart();
      cart[index].quantity = parseInt(e.target.value, 10);
      saveCart(cart);
      renderCart();
    }
  });

  // Add to Cart Button Click (for demonstration)
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const item = {
        name: this.dataset.name,
        ref: this.dataset.ref || "N/A",
        image: this.dataset.image || "default.jpg",
        color: this.dataset.color || "N/A",
        price: parseFloat(this.dataset.price),
        quantity: 1,
      };

      const cart = loadCart();
      const existingItem = cart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push(item);
      }

      saveCart(cart);
      alert(`${item.name} added to cart.`);
      renderCart();
    });
  });

  // Render cart items on page load
  renderCart();
});

// Function to update the individual item price and total cart amount
function updateCart() {
  let total = 0;

  // Loop through each item in the cart
  const items = document.querySelectorAll(".tr_item"); // All cart items
  items.forEach((item) => {
    const priceLabel = item.querySelector(".item_price label"); // Get the item's price
    const quantitySelect = item.querySelector(".item_qty select"); // Get the quantity select

    // Ensure that the original item price is a valid number (parse it correctly)
    const originalPrice = parseFloat(priceLabel.getAttribute("data-price"));

    if (isNaN(originalPrice)) {
      console.error("Invalid price for item");
      return;
    }

    // Get the selected quantity for the item
    const quantity = parseInt(quantitySelect.value);

    // Ensure the quantity is valid
    if (isNaN(quantity)) {
      console.error("Invalid quantity for item");
      return;
    }

    // Calculate the total price for this item
    const itemTotal = originalPrice * quantity;

    // Update the price displayed for this item
    priceLabel.textContent = `$ ${itemTotal.toFixed(2)}`;

    // Add this item total to the overall cart total
    total += itemTotal;
  });

  // Update the total amount in the cart footer
  document.querySelector(".subtotal strong").textContent = `$${total.toFixed(
    2
  )}`;
}

// Event listener for quantity changes
document.querySelectorAll(".item_qty select").forEach((select) => {
  select.addEventListener("change", updateCart);
});

// Call updateCart initially to calculate and display the correct total when the page loads
updateCart();

// Card formatting functions (unchanged)
function card_format(value) {
  var v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  var matches = v.match(/\d{4,16}/g);
  var match = (matches && matches[0]) || "";
  var parts = [];
  for (i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
}

document.getElementById("card_number").oninput = function () {
  this.value = card_format(this.value);
};

function ex_format(value) {
  var v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  var matches = v.match(/\d{2,4}/g);
  var match = (matches && matches[0]) || "";
  var parts = [];
  for (i = 0, len = match.length; i < len; i += 2) {
    parts.push(match.substring(i, i + 2));
  }
  if (parts.length) {
    return parts.join(" / ");
  } else {
    return value;
  }
}

document.getElementById("card_date").oninput = function () {
  this.value = ex_format(this.value);
};

function checkDigit(event) {
  var code = event.which ? event.which : event.keyCode;

  if ((code < 48 || code > 57) && code > 31) {
    return false;
  }

  return true;
}
