// Project Structure
//https://www.tldraw.com/r/2mlM5ATe4hjuidw0x4nj0?viewport=-1761,198,1772,988&page=page:page


// Liquid Reference to Internal ID
// {{ product.internal_id }}

//let internal_id = "any-designation"
let internal_id

let add_to_cart = document.querySelector("input[name='add_to_cart']")
console.log(add_to_cart);

console.log(typeof internal_id, internal_id);

if (internal_id) {
  
}

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: {
    "Content-Type": "application/json",
  },
};

let ASE_ID = "ASE-5910-3404";
//let LastName = "Zzdemo";
let LastName = "zzdemo";
//let LastName = "Zdemo";
let Key = process.env.ASE_API_KEY;

async function getASEData() {
  try {
    let response = await fetch(`https://api.ase.com/StoreValidationAPI/?aseId=${ASE_ID}&LastName=${LastName}&key=${Key}`, requestOptions);
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Wrap the asynchronous call in an async function and use await
async function fetchData() {
  try {
    const result = await getASEData();
    //console.log(result);
    let LastNameScore = result.LastNameScore
    let name_match
    if (LastNameScore > 2){
      name_match = true
    } if (LastNameScore < 2 | LastNameScore === 2){
      name_match = false
    }
    let designations = JSON.parse(result.Designations)
    designations.forEach(designation => {
      console.log(designation.custom_FriendlyName);
    });
    console.log(name_match);
  } catch (error) {
    console.error(error);
  }
}

// Call the fetchData function
fetchData();