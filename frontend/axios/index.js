// ✨ implement axiosWithAuth
import axios from "axios";

const axiosWithAuth = ()=>{
    return axios.create({
        headers:{
            Authorization:localStorage.getItem('token')
        },
        baseURL:'http://localhost:9000/api'
    })
}

export default axiosWithAuth