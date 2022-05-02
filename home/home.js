
async function fetchProducts(){
    fetch('http://localhost:3000/getproducts')
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
	for(var i=0; i < data.length; i++){
		const prod_container =document.getElementById("products-container")
		var newelement = document.createElement("div");
		newelement.classList.add('product_card')
		newelement.classList.add(data[i].product_id)
		var image = document.createElement("img");
		image.src = "./images/image8.jpg";
		var desc = document.createElement("p");
		var tempstring = "Product name: "+data[i].product_name + "<br>Price " + data[i].price.toString();
		desc.innerHTML= tempstring;
		newelement.appendChild(image);
		newelement.appendChild(desc);
		prod_container.appendChild(newelement);
	}
}