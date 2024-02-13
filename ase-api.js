// Project Structure
//https://www.tldraw.com/r/2mlM5ATe4hjuidw0x4nj0?viewport=-1761,198,1772,988&page=page:page

// Liquid Reference to Internal ID
// {{ product.internal_id }}

// ALL Designations
  // ASE-5910-3404
  // Zzdemo

// Missing "Undercar Specialist", Has "Automobile Technician" & "Maintenance and Light Repair Technician"
  // ASE-5795-1447
  // Sesti

// Blocked 
  // ASE-2335-0570
  // Thompson


// Bypass cors errors
let corse_proxy_server = "https://secret-sands-26088-7c17acddb75f.herokuapp.com/"

// Required Designation
let internal_id = "Automobile Technician"
//let internal_id

let ase_lookup_form = document.querySelector("form.ase_lookup")

let add_to_cart = document.querySelector("input[name='add_to_cart']")

if (internal_id) {
  add_to_cart.setAttribute("disabled", "")
} else {
  ase_lookup_form.style.display = "none"
}

let ASE_API_URL = "https://api.ase.com/StoreValidationAPI/"

let ASE_ID 
//let ASE_ID = "ASE-5910-3404";
let LastName
//let LastName = "Zzdemo";
//let LastName = "zzdemo";
//let LastName = "Zdemo";
let Key = process.env.ASE_API_KEY;

let ase_api_request_button = document.querySelector(".ase_api_request")

ase_api_request_button.addEventListener("click", (event) => {
  event.preventDefault(),
  ASE_ID = document.getElementById("ase-id").value
  LastName = document.getElementById("ase-tech-last-name").value
  fetchData(ASE_ID, LastName)
  }
)


var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: {
    "Content-Type": "application/json",
  },
};

async function getASEData(ASE_ID, LastName) {
  try {
    let response = await fetch(`${corse_proxy_server}${ASE_API_URL}?aseId=${ASE_ID}&LastName=${LastName}&key=${Key}`, requestOptions);
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Wrap the asynchronous call in an async function and use await
async function fetchData(ASE_ID, LastName) {
  try {
    const result = await getASEData(ASE_ID, LastName);
    if (result.Result === "Success") {
      let LastNameScore = result.LastNameScore
      if (LastNameScore > 2){
        if (internal_id === "Any Designation") {
          // unlock btn
          console.log("Any Designation");
        }
        // Validate Designation
        if (internal_id !== "Any Designation") {
          let matching_designation = false
          // require matching designation 
          let designations = JSON.parse(result.Designations)
          designations.forEach(designation => {
            if (designation.custom_FriendlyName.trim() === internal_id) {
              matching_designation = true
            }
          });
          if (matching_designation === false) {
              alert("Technician does not have the required designation in order to purchase this product.")
              add_to_cart.setAttribute("disabled", "")
          }
          if (matching_designation === true) {
              add_to_cart.removeAttribute("disabled", "")
              alert("Technician has required designation in order to purchase this product.")
          }
        }
      } if (LastNameScore < 2 | LastNameScore === 2){
        alert(`Technician name "${LastName}" is not an exact match with the ID on file. Check spelling and try again.`)
      }
    }
    if (result.Result !== "Success") {
      if (result.Result === "Required information is missing") {
        alert("Required information is missing. Enter a valid ASE ID and matching technician last name.")
      } if (result.Result === "No match on ASE ID") {
        alert("We could not find a technician with that ASE ID. Please check to make sure you input it correctly and try again.")
      } if (result.Result === "Technician is blocked") {
        alert("The Technician with this ID is blocked by ASE.")
      }
    }
  }
  catch (error) {
    alert(error)
    console.error(error);
  }
}

// All Designations
  // Master Medium/Heavy Truck Technician 
  // Alternate Fuels Technician 
  // Master Military TWV Technician 
  // Parts Specialist 
  // Master School Bus Technician 
  // Military Mechanic 
  // Maintenance and Light Repair Technician 
  // Undercar Specialist 
  // Master Automobile Technician 
  // Master Truck Equipment Technician 
  // Service Consultant 
  // Advanced Level Specialist 
  // Master Collision Repair Technician 
  // Master Transit Bus Technician 
  // Collision Repair Estimator 