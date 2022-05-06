
const site_url = "http://localhost:3000"

function init(){
    loadAccountInfo();
    loadOrderHistory();
}



function loadAccountInfo(){
    let info = document.getElementById("accountInfo");

    fetch('http://localhost:3000/getaccountinfo')
	.then(response=>{
		if(!response.ok){
			throw new Error(`HTTP Error: ${response.status}`)
		}
		return response.json()
	}).then(
		json=>renderAccountInfo(json))
		.catch(err => console.error(`Fetch Problem: ${err.message}`));

    function renderAccountInfo(data){
        console.log(data);
        info.innerHTML="Customer ID: " + data[0]['customer_id']+
            "<br> Username: " + data[0]['username']+
            "<br> E-mail address: " + data[0]['email']+
            "<br> Address: " + data[0]['address'] + 
            "<br> City: " +data[0]['city'] + 
            "<br> State: " +data[0]['state'] + 
            "<br> Zip Code: " + data[0]['zip']
    }
}

function loadOrderHistory(){
    let productsContainer = document.getElementById('products-container')
    fetch('http://localhost:3000/getorderhistory')
	.then(response=>{
		if(!response.ok){
			throw new Error(`HTTP Error: ${response.status}`)
		}
		return response.json()
	}).then(
		json=>renderOrderHistory(json))
		.catch(err => console.error(`Fetch Problem: ${err.message}`));

}

function renderOrderHistory(data){
    console.log(data)
    for(var i=0; i < data.length; i++){
		const prod_container =document.getElementById("products-container")
		var newelement = document.createElement("div");
		newelement.classList.add('product_card')
		newelement.classList.add("id:"+data[i].product_id)
		var image = document.createElement("img");
		image.src = "./images/image8.jpg";
		var desc = document.createElement("p");
        desc.classList.add('desc')
		var tempstring = "Product name: "+data[i].product_name + "<br>Price " + data[i].price.toString() + "<br>Manufacturer: "+data[i].manufacturer;
		desc.innerHTML= tempstring;
        var orderInfo = document.createElement('p');
        tempstring = "Date ordered: " + data[i].order_date + "<br>Order ID: " + data[i].order_id
        orderInfo.innerHTML = tempstring
        orderInfo.classList.add('orderInfo')
		newelement.appendChild(image);
		newelement.appendChild(desc);
        newelement.appendChild(orderInfo);
		prod_container.appendChild(newelement);
    }
}


function changeAccountInfo(type){
    let address = document.getElementById('adr').value
    let city = document.getElementById('city').value
    let state = document.getElementById('state').value
    let zip = document.getElementById('zip').value
    let newusername = document.getElementById('newusername').value
    let newpassword1 = document.getElementById('newpassword').value
    let newpassword2 = document.getElementById('newpassword2').value
    let requrl = site_url + "/changeaccountinfo"
    
    if(type == 'address' && address && city && state && zip){
        fetch(requrl,{
            method:"POST",
            
            body: JSON.stringify({
                address:address,
                city:city,
                state:state,
                zip:zip
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(console.log("address info sent!"))
    }
    
    if(type=='username' && newusername){
        fetch(requrl,{
            method:"POST",
        
            body: JSON.stringify({
                 newusername:newusername
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(console.log("username info sent!"))
    }

    if(type=='password' && newpassword1 && newpassword2){
        if(newpassword1 == newpassword2){
            fetch(requrl,{
                method:"POST",
        
                body: JSON.stringify({
                    newpassword:newpassword1
                }),
                headers:{
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(console.log("password info sent!"))
        }
    }
    
}