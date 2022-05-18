import axios from "axios";


const baseURL = "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json";
let responseData = [];

export const getCountryList = async () => {
    try {
        let country = [];
        
        let response = await axios.get(baseURL);
       responseData = [...response.data];

       country= [...new Set(responseData.map(item => item.country))];
       country.sort();

       return country;
    } catch (error) {
        console.log(error);
    }
}

export const getStateList = (country) => {
    let states = [];
    responseData.forEach(item => {
        if (item.country === country) {
            states.push(item.subcountry);
        }
    });
    states= [...new Set(states.map(item => item))];
    states.sort();
    return states;
;}

