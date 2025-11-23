const params = new URLSearchParams(window.location.search);
const PId = params.get("id");

const product = Products.find(p => p.id === PId);

document.getElementById('rating').innerText = product.rating;
document.getElementById('cardImg').src = product.img;
document.getElementById('crdName').innerText = product.name;
document.getElementById('description').innerText = product.description;
document.getElementById('price').innerText = `$${product.price}`;

//cart notification dot
const addToCart = document.getElementById('addToCart');

addToCart.addEventListener("click", function() {
	document.querySelector(".crt-notif").style.display = "block";
	
	let cart = JSON.parse(localStorage.getItem("cart")) || [];
	cart.push(product);
	localStorage.setItem("cart", JSON.stringify(cart));
	
})