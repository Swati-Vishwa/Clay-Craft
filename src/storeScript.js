const storeTitle = document.getElementById('store-head');
const charm = document.getElementById('charm');
const keyring= document.getElementById('keyring');
const magnet= document.getElementById('magnet');
const jewel = document.getElementById('jewel');

const chips = document.querySelectorAll(".aside-div ul li");

chips.forEach(chip => {
	chip.addEventListener("click", function(){
		chips.forEach(cl => cl.classList.remove("active"));
	    chip.classList.add("active");
  })
})

charm.addEventListener("click", function(){
	storeTitle.innerText = "Charms";
})

keyring.addEventListener("click", function(){
	storeTitle.innerText = "Keyrings";
})

magnet.addEventListener("click", function(){
	storeTitle.innerText = "Fridge magnet";
})

jewel.addEventListener("click", function(){
	storeTitle.innerText = "Jewellery";
})

//card data-id fetching
document.querySelectorAll(".card").forEach(card => {
	card.addEventListener("click", () => {
		const id = card.dataset.id;
		window.location.href = `product.html?id=${id}`;
  })
})
