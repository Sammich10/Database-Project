
function init(){
    loadAccountInfo();
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
    
function changeAccountInfo(){
    
}
}