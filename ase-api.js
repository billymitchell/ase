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

let ASE_API_URL = "https://api.ase.com/StoreValidationAPI/"

let ASE_ID 
//let ASE_ID = "ASE-5910-3404";
let LastName
//let LastName = "Zzdemo";
//let LastName = "zzdemo";
//let LastName = "Zdemo";

// Bypass cors errors
//let corse_proxy_server = "https://secret-sands-26088-7c17acddb75f.herokuapp.com/"

// Validation Requirements
let validation_requirements = "Any Designation"
//let validation_requirements = "{{ product.note }}"

// Convert Validation Requirements to JSON
// Convert and iterate in one step
let requirements = validation_requirements.split(',').map(requirement => requirement.trim())



let ase_lookup_form = document.querySelector("form.ase_lookup")
let add_to_cart = document.querySelector("input[name='add_to_cart']")
let product_form = document.querySelector("form.simple_form.edit_website_product")
let loading = document.querySelector(".loading-container")


if ( validation_requirements ) {
  //add_to_cart.setAttribute("disabled", "")
  add_to_cart.removeAttribute("Type", "Submit")

  add_to_cart.addEventListener("click", (event) => {
      ASE_ID = document.getElementById("ase-id").value
      LastName = document.getElementById("ase-tech-last-name").value
      loading.style.display = "flex"
      fetchData(ASE_ID, LastName)
  })
  //product_form.addEventListener("submit", (e) => {
    //e.preventDefault();
  //});
} else {
  ase_lookup_form.style.display = "none"
}

let Key = process.env.ASE_API_KEY;


//let ase_api_request_button = document.querySelector(".ase_api_request")

//ase_api_request_button.addEventListener("click", (event) => {
    //event.preventDefault(),
    //ASE_ID = document.getElementById("ase-id").value
    //LastName = document.getElementById("ase-tech-last-name").value
    //fetchData(ASE_ID, LastName)
  //}
//)

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: {
    "Content-Type": "application/json",
  },
};

//${corse_proxy_server}  
  
async function getASEData(ASE_ID, LastName) {
  try {
    let response = await fetch(`${ASE_API_URL}?aseId=${ASE_ID}&LastName=${LastName}&key=${Key}`, requestOptions);
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Wrap the asynchronous call in an async function and use await
// Wrap the asynchronous call in an async function and use await
async function fetchData(ASE_ID, LastName) {
  try {
    const result = await getASEData(ASE_ID, LastName);

    // get techs designations
    let designations = JSON.parse(result.Designations)
    // get techs designations
    let certifications = JSON.parse(result.Certifications)
    // get name score (how close is name to one on file)
    let LastNameScore = result.LastNameScore

    if (result.Result === "Success") {
      
      // Pass Last Name Score
      if (LastNameScore > 2){
        // If product requires Any Designation 
        if (validation_requirements === "Any Designation") {

          // Tech has no active designations
          if (designations.length === 0) {
            alert(`This technician does not meet the required designation or certification to purchase this product. If you believe the requirements are currently being met, contact ASE Customer Care at contactus@ase.com.`)
          }

          // tech has at least one designation 
          if (designations.length !== 0) {
            alert("Technician has required designation in order to purchase this product.")
            product_form.submit()
          }

        }
        // Validate Designation / Certifications
         if (validation_requirements !== "Any Designation") {

          // set default state
          let matching_designation_or_certification = false
          


          // For each requirement
          requirements.forEach(requirement => {
            
            // check techs designations for match
            designations.forEach(designation => {

              // if a Master designation item
              // if (validation_requirements.includes("Master ")) {
              //   if (designation.custom_FriendlyName.trim() === validation_requirements) {
              //     matching_designation_or_certification = true
              //   }
              // }
              // // if Not a master designation item, remove "Master ", from designations so that Master can buy regular items
              // else {
              //   if (designation.custom_FriendlyName.trim().replace("Master ", "") === validation_requirements) {
              //     matching_designation_or_certification = true
              //   }
              // }

              // Use multiple validation requirements vs removing master in requirement 
              if (designation.custom_FriendlyName.trim() === requirement) {
                  matching_designation_or_certification = true
              }
            });

            // check techs certifications for match
            certifications.forEach(certification => {
            
              if (certification.custom_FriendlyName.trim() === requirement) {
                matching_designation_or_certification = true
              }
            });
          });

          if (matching_designation_or_certification === false) {
              alert(`This technician does not meet the required designation or certification to purchase this product. If you believe the requirements are currently being met, contact ASE Customer Care at contactus@ase.com.`)
          }
          if (matching_designation_or_certification === true) {
              alert("The technician has the required designation and certification to purchase this product.")
			        product_form.submit()
          }
        }
      }
      // Fail Last Name Score
      if (LastNameScore < 2 | LastNameScore === 2){
        alert(`The name "${LastName}" is not an exact match to the technician’s myASE profile. Check the spelling and try again. If the spelling is correct, contact ASE Customer Care at contactus@ase.com.`)
      }
    }
    // If you ger a bad result 
    if (result.Result !== "Success") {
      if (result.Result === "Required information is missing") {
        alert("The required information is missing. Enter the valid ASE ID and name as it appears on the technician’s myASE profile.")
      } if (result.Result === "No match on ASE ID") {
        alert("A record matching the ASE ID and/or last name cannot be found. This information must be entered as it appears on the technician’s myASE profile. If the ASE ID and last name are being entered correctly, contact ASE Customer Care at contactus@ase.com.")
      } if (result.Result === "Technician is blocked") {
        alert("The record matching this ASE ID and name is blocked by ASE. If you believe this is an error, contact ASE Customer Care at contactus@ase.com.")
      }
    }
  }
  // if you get an error in retrieving the data 
  catch (error) {
    alert(error)
    console.error(error);
  }
  loading.style.display = "none"
}

// All DESIGNATIONS
  // Master Medium/Heavy Truck Technician
  // Medium/Heavy Truck Technician 
  // Alternate Fuels Technician 
  // Master Military TWV Technician
  // Military TWV Technician
  // Parts Specialist 
  // Master School Bus Technician
  // School Bus Technician
  // Military Mechanic 
  // Maintenance and Light Repair Technician 
  // Undercar Specialist 
  // Master Automobile Technician
  // Automobile Technician
  // Master Truck Equipment Technician
  // Truck Equipment Technician
  // Service Consultant 
  // Advanced Level Specialist 
  // Master Collision Repair Technician
  // Collision Repair Technician
  // Master Transit Bus Technician
  // Transit Bus Technician
  // Collision Repair Estimator


// ALL CERTIFICATIONS
  // T2
  // A5
  // A6
  // A8
  // A7
  // A9
  // A4
  // C1
  // B6
  // B5
  // B3
  // B4
  // G1
  // E3
  // H4
  // H1
  // F1
  // H2
  // H3
  // E2
  // H6
  // H7
  // E1
  // H8
  // H5
  // P2
  // MIL4
  // MIL2
  // MIL3
  // MIL6
  // MIL1
  // P4
  // MIL7
  // P1
  // MIL8
  // MIL5
  // S7
  // S1
  // S4
  // S2
  // S3
  // S6
  // S5
  // T4
  // T3
  // T6
  // T1
  // T7
  // T8
  // T5
  // L4
  // L1
  // L2
  // X1
  // L3
  // A2
  // A1
  // A3
  // B2