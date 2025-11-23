const cart = JSON.parse(localStorage.getItem("cart")) || [];
const container = document.getElementById("cartContainer");

cart.forEach((c, index) => {
  const div = document.createElement("div");
  div.classList.add("cart-card");

  div.innerHTML = `
    <div class="cart-img-wrap">
      <img src="${c.img}" alt="Product Image">
    </div>

    <div class="cart-details">
      <h3 class="cart-title">${c.name}</h3>
      <p class="cart-price">$${c.price}</p>

      <div class="cart-qty">
        <button class="qty-btn minus">-</button>
        <span class="qty-number">1</span>
        <button class="qty-btn plus">+</button>
      </div>
    </div>

    <button class="remove-btn" data-index="${index}">
      <i class='bx bx-trash'></i>
    </button>
  `;

  container.appendChild(div);
});

//Remove button
container.addEventListener("click", function(e){
	if(e.target.closest('.remove-btn')) {
		const i = e.target.closest('.remove-btn').dataset.index;
		
		cart.splice(i, 1);
		localStorage.setItem("cart", JSON.stringify(cart));
		location.reload();
    }
})