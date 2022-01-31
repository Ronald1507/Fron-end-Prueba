import axios from "axios";
import { url, config } from "../api/backend";


async function RequestRegion(){
    const answer = await axios
    .get(url+"api/regiones", config)
    .then((res)=>{
        console.log(res.data)
        return res.data
    })
    .catch((err)=>{
        if(err && err.response);
    });
    let options = [];
    options = answer.map((element)=>{
        let o ={
            id: element.id,
            nombre_region: element.nombre_region
        }
        return o;
    });
    return options
}

async function RequestCalles(data){
    const answer = await axios
    .get(url+ "api/calles", config)
    .then((res)=>{
        console.log(res.data);
        return res.data;
    })
    .catch((err)=>{
        if(err && err.response);
    });
    let options = [];
    options = answer.map((element)=>{
        let o ={
            id: element.id,
            nombre_calle: element.nombre_calle
        }
        return o;
    });
    return options;
}


export { RequestCalles, RequestRegion };