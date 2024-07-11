// Project Structure
//https://www.tldraw.com/r/2mlM5ATe4hjuidw0x4nj0?viewport=-1761,198,1772,988&page=page:page

// ALL Designations
  // ASE-5910-3404
  // Zzdemo

// Missing "Undercar Specialist", Has "Automobile Technician" & "Maintenance and Light Repair Technician"
  // ASE-5795-1447
  // Sesti

// Blocked 
  // ASE-2335-0570
  // Thompson

import { ASE_API_KEY } from './config.mjs';

const ASE_API_URL = "https://api.ase.com/StoreValidationAPI/";
//Bypass CORS errors
const corsProxyServer = "https://ase-cors-proxy-c433e9ebcd4d.herokuapp.com/";

let aseId;
let lastName;
let validationRequirements = "Master Automobile Technician";
//let validationRequirements = "{{ product.note }}";
const requirements = validationRequirements.split(',').map(req => req.trim());

const aseLookupForm = document.querySelector("form.ase_lookup");
const addToCartButton = document.querySelector("input[name='add_to_cart']");
const productForm = document.querySelector("form.simple_form.edit_website_product");
const loadingContainer = document.querySelector(".loading-container");

if (validationRequirements) {
  addToCartButton.removeAttribute("type", "submit");

  addToCartButton.addEventListener("click", async (event) => {
    event.preventDefault();
    aseId = document.getElementById("ase-id").value;
    lastName = document.getElementById("ase-tech-last-name").value;
    loadingContainer.style.display = "flex";
    await fetchData(aseId, lastName);
  });
} else {
  aseLookupForm.style.display = "none";
}

async function getASEData(aseId, lastName) {
  try {
    const response = await fetch(`${corsProxyServer}${ASE_API_URL}?aseId=${aseId}&LastName=${lastName}&key=${ASE_API_KEY}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    alert("Error fetching data from ASE.");
    throw error;
  }
}

async function fetchData(aseId, lastName) {
  try {
    const result = await getASEData(aseId, lastName);
    const designations = JSON.parse(result.Designations);
    const certifications = JSON.parse(result.Certifications);
    const lastNameScore = result.LastNameScore;

    if (result.Result === "Success") {
      handleSuccess(result, designations, certifications, lastNameScore);
    } else {
      handleFailure(result.Result);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loadingContainer.style.display = "none";
  }
}

function handleSuccess(result, designations, certifications, lastNameScore) {
  if (lastNameScore > 2) {
    if (validationRequirements === "Any Designation") {
      validateAnyDesignation(designations);
    } else {
      validateSpecificRequirements(designations, certifications);
    }
  } else {
    alert(`The name "${lastName}" is not an exact match to the technician’s myASE profile. Check the spelling and try again. If the spelling is correct, contact ASE Customer Care at contactus@ase.com.`);
  }
}

function validateAnyDesignation(designations) {
  if (designations.length === 0) {
    alert(`This technician does not meet the required designation or certification to purchase this product. If you believe the requirements are currently being met, contact ASE Customer Care at contactus@ase.com.`);
  } else {
    alert("Technician has required designation to purchase this product.");
    productForm.submit();
  }
}

function validateSpecificRequirements(designations, certifications) {
  let matchingDesignationOrCertification = false;

  requirements.forEach(requirement => {
    if (designations.some(designation => designation.custom_FriendlyName.trim() === requirement) ||
      certifications.some(certification => certification.custom_FriendlyName.trim() === requirement)) {
      matchingDesignationOrCertification = true;
    }
  });

  if (matchingDesignationOrCertification) {
    alert("The technician has the required designation or certification to purchase this product.");
    productForm.submit();
  } else {
    checkMismatchConditions(designations, certifications);
  }
}

function checkMismatchConditions(designations, certifications) {
  let nonMasterTryingForMaster = checkNonMasterTryingForMaster(designations, certifications);
  let masterTryingForNonMaster = checkMasterTryingForNonMaster(designations, certifications);

  if (nonMasterTryingForMaster) {
    alert(`This is a Master level item. You have a non-master, certified-level designation. Please purchase the product that matches your designation level. If you believe you are receiving this message in error, contact ASE Customer Care at contactus@ase.com.`);
  } else if (masterTryingForNonMaster) {
    alert(`This is a Certified level item. You have a Master level designation. Please purchase the product that matches your designation level. If you believe you are receiving this message in error, contact ASE Customer Care at contactus@ase.com.`);
  } else {
    alert(`This technician does not meet the required designation or certification to purchase this product. If you believe the requirements are currently being met, contact ASE Customer Care at contactus@ase.com.`);
  }
}

function checkNonMasterTryingForMaster(designations, certifications) {
  let requirementsWithoutMaster = requirements.map(req => req.replace("Master", "").trim());

  return requirementsWithoutMaster.some(req =>
    designations.some(designation => designation.custom_FriendlyName.trim() === req) ||
    certifications.some(certification => certification.custom_FriendlyName.trim() === req)
  );
}

function checkMasterTryingForNonMaster(designations, certifications) {
  let requirementsWithMaster = requirements.map(req => `Master ${req}`);

  return requirementsWithMaster.some(req =>
    designations.some(designation => designation.custom_FriendlyName.trim() === req) ||
    certifications.some(certification => certification.custom_FriendlyName.trim() === req)
  );
}

function handleFailure(result) {
  switch (result) {
    case "Required information is missing":
      alert("The required information is missing. Enter the valid ASE ID and name as it appears on the technician’s myASE profile.");
      break;
    case "No match on ASE ID":
      alert("A record matching the ASE ID and/or last name cannot be found. This information must be entered as it appears on the technician’s myASE profile. If the ASE ID and last name are being entered correctly, contact ASE Customer Care at contactus@ase.com.");
      break;
    case "Technician is blocked":
      alert("The record matching this ASE ID and name is blocked by ASE. If you believe this is an error, contact ASE Customer Care at contactus@ase.com.");
      break;
    default:
      alert("An unknown error occurred.");
      break;
  }
}
