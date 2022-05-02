const { render } = require("ejs");


let request = async () => {
    const response = await fetch('http://localhost:3000/home/showproducts');
    const data = await response.json();
    render(data);
}


function renderProducts(data){
    const prod_container =document.getElementById("products-container")
    console.log(data[i]['product_name'])
	var newelement = document.createElement("div");
	newelement.classList.add('product_card')
	newelement.classList.add(data[i][product_name])
	var image = document.createElement("img");
	image.src = "images/image8.jpg";
	var desc = document.createElement("p");
	var tempstring = "Product name: "+data[i][product_name] + "\nPrice " + data[i][price].toString();
	desc.innerHTML= tempString;
	newelement.appendChild(image);
	newelement.appendChild(desc);
	prod_container.appendChild(newelement);
}