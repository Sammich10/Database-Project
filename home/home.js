
const site_url = "http://localhost:3000"

function init(){
	fetchFilters()
	fetchProducts()
}

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

async function fetchFilters(){
    fetch('http://localhost:3000/getfilters')
	.then(response=>{
		if(!response.ok){
			throw new Error(`HTTP Error: ${response.status}`)
		}
		return response.json()
	}).then(
		json=>renderFilters(json))
		.catch(err => console.error(`Fetch Problem: ${err.message}`));
}


function renderProducts(data){
	document.querySelectorAll('.product_card').forEach(function(e){
		e.remove()
		console.log('removed an item')
	})
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
	return
}

function renderFilters(data){
	console.log(data)
	for(let i = 0; i < data.length; i++){
		let prod_type_list = document.getElementById('product_type_list')
		let man_list = document.getElementById('manufacturer_list')
		if (data[i].product_type){
			let newelement = document.createElement('li')
			let checkbox = document.createElement('input')
			checkbox.type="checkbox"
			checkbox.name="product_type"
			checkbox.value=data[i].product_type
			newelement.classList.add('product_type')
			newelement.innerHTML = data[i].product_type
			newelement.appendChild(checkbox)
			prod_type_list.appendChild(newelement)
		}
		if(data[i].manufacturer){
			let newelement = document.createElement('li')
			let checkbox = document.createElement('input')
			checkbox.type="checkbox"
			checkbox.name="manufacturer"
			checkbox.value=data[i].manufacturer
			newelement.classList.add('manufacturer')
			newelement.innerHTML = data[i].manufacturer
			newelement.appendChild(checkbox)
			man_list.appendChild(newelement)
		}
	}
}

function addItemToCart(data){
	console.log(data+" added to cart!")
	const requrl = (site_url + "/addToCart").toString()
	fetch(requrl,{
		method:"POST",

		body: JSON.stringify({
			product_id: data
		}),
		headers:{
			"Content-type": "application/json; charset=UTF-8"
		}
	}).then(console.log("item added to cart"))
}

function filter(){
	let type_list = ['product_type',]
	let manuf_list = ['manufacturer',]
	let price_list = [0,9999]
	let typeCheckBoxes = document.getElementsByName('product_type')
	let manufacturerCheckBoxes = document.getElementsByName('manufacturer')
	let price1 = document.getElementById('price1').value
	let price2 = document.getElementById('price2').value
	for(let i = 0; i < typeCheckBoxes.length; i++){
		if(typeCheckBoxes[i].checked){
			type_list.push(typeCheckBoxes[i].value)
		}
	}
	for(let i = 0; i < manufacturerCheckBoxes.length; i++){
		if(manufacturerCheckBoxes[i].checked){
			manuf_list.push(manufacturerCheckBoxes[i].value)
		}
	}
	if(price1){
		price_list[0] = price1
	}
	if(price2)[
		price_list[1] = price2
	]
	var filters = []
	filters.push(type_list)
	filters.push(manuf_list)
	filters.push(price_list)
	console.log(filters)
	getFilterdProducts(filters)
};

async function getFilterdProducts(filters){

	const response = await fetch(site_url+"/getFilteredProducts",{
		method:'POST',
		headers:{
			"Content-type": "application/json; charset=UTF-8"
		},
		body: JSON.stringify(filters)
	}).then(response=>{
		if(!response.ok){
			throw new Error(`HTTP Error: ${response.status}`)
		}
		return response.json()
	}).then(
		json=>renderProducts(json))
		.catch(err => console.error(`Fetch Problem: ${err.message}`))

}

