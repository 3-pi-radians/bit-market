import axios from "axios";

export default axios.create({
    baseURL: "https://bit-market-api.herokuapp.com"
});

// export default axios.create({
//     baseURL: "http://localhost:3001"
// });