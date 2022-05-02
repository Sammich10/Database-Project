
const site_url = "http://localhost:3000"
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
		newelement.classList.add("id:"+data[i].product_id)
		var image = document.createElement("img");
		image.src = "./images/image8.jpg";
		var desc = document.createElement("p");
		var tempstring = "Product name: "+data[i].product_name + "<br>Price " + data[i].price.toString() + "<br>Manufacturer: "+data[i].manufacturer;
		desc.innerHTML= tempstring;
		addToCart = document.createElement('button')
		addToCart.innerHTML = "Add to cart"
		addToCart.id = data[i].product_id.toString()
		addToCart.addEventListener("click",function(){
			var product_id=this.id.toString()
			addItemToCart(product_id)
		})
		newelement.appendChild(image);
		newelement.appendChild(desc);
		newelement.appendChild(addToCart)
		prod_container.appendChild(newelement);
	}
}

function addItemToCart(data){
	console.log(data+" added to cart!")
	const callurl = (site_url + "/addToCart").toString()
	fetch(callurl,{
		method:"POST",

		body: JSON.stringify({
			product_id: data
		}),
		headers:{
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then(console.log("request made"))
}


