

const site_url = "http://localhost:3000"

async function fetchProducts(){
    fetch('http://localhost:3000/getCart')
	.then(response=>{
		if(!response.ok){
			throw new Error(`HTTP Error: ${response.status}`)
		}
		return response.json()
	}).then(
		json=>renderProducts(json))
		.catch(err => console.error(`Fetch Problem: ${err.message}`));
}

function renderProducts(data){
	for(let i=0; i < data.length; i++){
		console.log(data[i].product_id)
		const prod_container =document.getElementById("cart-item-holder")
		let newelement = document.createElement("div");
		newelement.classList.add('cart_card')
		newelement.classList.add("id:"+data[i].product_id)
		let image = document.createElement("img");
		image.src = "/images/image8.jpg";
		let desc = document.createElement("p");
		desc.classList.add('product_info')
		let tempstring = "Product name: "+data[i].product_name + "<br>Price " + data[i].price.toString() + "<br>Manufacturer: "+data[i].manufacturer;
		desc.innerHTML= tempstring;
		tempstring = "Quantity: " + data[i].quantity.toString()
		let quantity = document.createElement('p')
		quantity.classList.add('quantity')
		quantity.innerHTML = tempstring
		newelement.appendChild(image);
		newelement.appendChild(desc);
		newelement.appendChild(quantity);
		prod_container.appendChild(newelement);
	}
}