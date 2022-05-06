
const site_url = "http://localhost:3000"


function init(){
	fetchProducts();
}
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

function checkout(){
	let fullName = document.getElementById('fname').value
	let email = document.getElementById('email').value
	let address = document.getElementById('adr').value
	let city = document.getElementById('city').value
	let state = document.getElementById('state').value
	let zipcode = document.getElementById('zip').value

	let nameOnCard = document.getElementById('cname').value
	let cardNumber = document.getElementById('ccnum').value
	let expMonth = document.getElementById('expmonth').value
	let expYear = document.getElementById('expyear').value
	let cvv = document.getElementById('cvv').value

	console.log(fullName,email,address,city,state,zipcode)

	if(fullName && email && address && city && state && zipcode && nameOnCard && cardNumber && expMonth && expYear && cvv){
		const requrl = (site_url + "/createOrder").toString()
		fetch(requrl,{
			method:"POST",

			body: JSON.stringify({
				fullName:fullName,
				email:email,
				address:address,
				city:city,
				state:state,
				zipcode:zipcode,
				nameOnCard:nameOnCard,
				cardNumber:cardNumber,
				expMonth:expMonth,
				expYear:expYear,
				cvv:cvv
			}),
			headers:{
				"Content-type": "application/json; charset=UTF-8"
			}
		}).then(console.log("checkout information sent"))
	}else{
		console.log('required information not provieded')
	}
}