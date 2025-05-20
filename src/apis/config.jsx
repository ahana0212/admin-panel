
export const DEV_URL = 'http://localhost:8000/api';

export const CURRENT_URL = DEV_URL;


export const headerConfig = () => {
    const jwt = localStorage.getItem("jwt");
    return  {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${jwt}`, 
    'Accept': 'application/json',  
  }
} 


