import { ASE_API_KEY } from './config.mjs';

let corse_proxy_server = "https://ase-cors-proxy-c433e9ebcd4d.herokuapp.com/"

var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  let ASE_ID = "ASE-5910-3404";
  let LastName = "zzdemo";
  //let LastName = "Zdemo";
  //let LastName = "Zzdemo";

  
//${corse_proxy_server}

  async function getASEData() {
    try {
      const response = await fetch(
        `https://api.ase.com/StoreValidationAPI/?aseId=${ASE_ID}&LastName=${LastName}&key=${ASE_API_KEY}`,
        requestOptions
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching ASE data:', error);
    }
  }

  
  // test
  getASEData();