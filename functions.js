export const fetchData = async () => {
  const URL =
    "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";
  const jsonResponse = await fetch("/restaurant.json");
  const objectResponse = await jsonResponse.json();
  return objectResponse;
};

var cartItems = [];

const updateCartSize = () => {
  const productsGrid = document.getElementById("cart-size");
  productsGrid.innerHTML = cartItems.length;
};

var removeFromCart = (item) => {
  const index = cartItems.indexOf(item);
  if (index !== -1) {
    cartItems.splice(index, 1);
    updateCartSize();
  }
};

var addToCart = (item) => {
  cartItems.push(item);
  updateCartSize();
};

const getCartSummary = () => {
  let cartSummary = cartItems;

  let countObject = {};

  cartSummary.forEach((item) => {
    if (countObject[item.name] == undefined) {
      countObject[item.name] = 1;
    } else {
      countObject[item.name] += 1;
    }
  });

  let resultArray = [];

  for (const key in countObject) {
    let originalItem = cartSummary.find((it) => it.name === key);
    originalItem.quantity = countObject[key];
    originalItem.total = (originalItem.quantity * originalItem.price).toFixed(
      2
    );
    resultArray.push(originalItem);
  }

  return resultArray;
};

const openCart = () => {
  const categoriesTitle = document.getElementById("category-title");
  categoriesTitle.innerHTML = "Order detail";
  let cartSummary = getCartSummary();
  let cartTotal = cartSummary.reduce(function (a, b) {
    return a + parseFloat(b["total"]);
  }, 0);

  const cartBody = document.getElementById("products-grid");
  cartBody.innerHTML = `
    <table class="table table-striped">
      <thead>
      <tr>
        <th scope="col">Item</th>
        <th scope="col">Qty.</th>
        <th scope="col">Description</th>
        <th scope="col">Unit Price</th>
        <th scope="col">Amount</th>
        <th scope="col">Modify</th>
      </tr>
      </thead>
      <tbody id="cart-table-body">
      </tbody>
    </table>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <b>Total: $${cartTotal.toFixed(2)}</b>
      </div>
      <div>
        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#exampleModal">
          Cancel
        </button>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Cancel the order</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">Are yo usure you want to cancel the order?</div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  id="cancel-order-button"
                >
                  Yes, I want to cancel the order
                </button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">
                  No, I want to continue adding products
                </button>
              </div>
            </div>
          </div>
        </div>
        <button id="confirm-button" class="btn btn-warning">
          Confirm order
        </button>
      </div>
    </div>
  `;

  document
    .getElementById("cancel-order-button")
    .addEventListener("click", () => {
      cartItems = [];
      openCart();
    });

  document.getElementById("confirm-button").addEventListener("click", () => {
    console.log("Resumen del pedido:");
    console.log(cartSummary);
  });

  const cartTableBody = document.getElementById("cart-table-body");

  let cartRowsHTML = "";

  cartSummary.forEach((item, i) => {
    cartRowsHTML += `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${item.quantity}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.total}</td>
      <td>
        <div style="display: flex;">
          <button id="add-${item.name}-button" class="btn btn-secondary">
            +
          </button>
          &nbsp;
          <button id="remove-${item.name}-button" class="btn btn-secondary">
            -
          </button>
        </div>
      </td>
    </tr>
    `;
  });

  cartTableBody.innerHTML = cartRowsHTML;

  cartSummary.forEach((item) => {
    document
      .getElementById(`add-${item.name}-button`)
      .addEventListener("click", () => {
        addToCart(item);
        openCart();
      });

    document
      .getElementById(`remove-${item.name}-button`)
      .addEventListener("click", () => {
        removeFromCart(item);
        openCart();
      });
  });
};

export const drawCartItem = () => {
  const cartButtonContainer = document.getElementById("cartButtonContainer");
  cartButtonContainer.innerHTML = `
    <button
      class="btn btn-outline-transparent my-2 my-sm-0 cart-button"
      id="cart-button"
      type="submit"
    >
      <img src="assets/carrito.png" class="cart-icon" alt="CARRITO" />
      <div id="cart-size">0</div>
      &nbsp;items
    </button>
  `;

  document
    .getElementById("cart-button")
    .addEventListener("click", () => openCart());
};

export const drawCategoriesNav = (menu, cartItemsCount) => {
  const categoriesNav = document.getElementById("categories-nav-ul");

  let innerHtml = "";

  menu.forEach((category, i) => {
    innerHtml += `
    <li class="nav-item">
      <a class="nav-link" id="nav-${category.name}">
        ${category.name}
      </a>
    </li>`;
  });

  categoriesNav.innerHTML = innerHtml;

  drawItems(menu, menu[0].name);

  menu.forEach((category) => {
    document
      .getElementById(`nav-${category.name}`)
      .addEventListener("click", () => drawItems(menu, category.name));
  });
};

export const drawItems = (menu, categoryName) => {
  let productsHTML = "";

  let category = null;

  menu.forEach((cat) => {
    if (cat.name === categoryName) {
      category = cat;
    }
  });

  const categoriesTitle = document.getElementById("category-title");
  categoriesTitle.innerHTML = category.name;

  category.products.forEach((prod) => {
    productsHTML += `
        <div class="col-3">
            <div class="card">
                <img class="card-img-top" src="${prod.image}" alt="Card image cap">
                <div class="card-body">
                  <div>
                    <h5 class="card-title">${prod.name}</h5>
                    <p class="card-text">${prod.description}</p>
                  </div>
                  <div style="display: flex; flex-direction: column;">
                    <b class="card-text" style="margin-top: 1rem; margin-bottom: 1rem;">$${prod.price}</b>
                    <a class="btn btn-dark" id="button-${prod.name}">Add to cart</a>
                  </div>
                </div>
            </div>
        </div>
      `;
  });

  const productsGrid = document.getElementById("products-grid");
  productsGrid.innerHTML = productsHTML;

  category.products.forEach((prod) => {
    document
      .getElementById(`button-${prod.name}`)
      .addEventListener("click", () => addToCart(prod));
  });
};
