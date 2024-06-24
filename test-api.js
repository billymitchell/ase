let corse_proxy_server = "https://ase-cors-proxy-c433e9ebcd4d.herokuapp.com/"

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
      const response = await fetch(
        `${corse_proxy_server}https://api.ase.com/StoreValidationAPI/?aseId=${ASE_ID}&LastName=${LastName}&key=${Key}`,
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