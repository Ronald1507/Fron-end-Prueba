import axios from "axios"
import React, {useState, useEffect} from "react"


export default function Mantenedor(){    
    const [region, setRegion] = useState([]);
    const [provincia, setProvincia] = useState([]);
    const [comuna, setComuna] = useState([]);
    const [calle, setCalle] = useState([]);
    const [recibirComuna, setRecibirComuna] = useState([]);
    
    const peticionRegiones = async () =>{
        axios
        .get("http://127.0.0.1:8000/api/regiones")
        .then((response)=>{
            console.log(response.data)        
            setRegion(response.data)            
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    useEffect(()=>{
        peticionRegiones()        
    },[])

    const buscaProvincia = async (idRegion) =>{
        console.log(idRegion.target.value)                 
        axios
        .get("http://127.0.0.1:8000/api/provinciasRegion/"+idRegion.target.value)
        .then((response)=>{
            console.log(response.data)        
            setProvincia(response.data)            
        })
        .catch((error)=>{
            console.log(error)
        })        
    }
    const buscaComuna = async (idProvincia) => {
        console.log(idProvincia.target.value)
        axios
        .get("http://127.0.0.1:8000/api/comunasProvincia/"+idProvincia.target.value)
        .then((response)=>{
            console.log(response.data)
            setComuna(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    

    const insertarCalle = () =>{
                                                     
        console.log(recibirComuna)
        console.log(calle)

        axios
        .post("http://127.0.0.1:8000/api/calles" ,{
            nombre_calle:calle,
            id:recibirComuna
        })
        .then((response)=>{
            console.log("correcto")
            console.log(response.data)
        })
        .catch(error=>{
            console.log(error)
        })
        
        
    }


    return (
    <div className="container">
        <h1>Mantenedor de Calles</h1>        
            <div>
                <label>Region</label>
                <select name="region" id="region" 
                onChange={buscaProvincia}
                >
                    <option value={-1} disabled selected>Seleccione una región</option>
                    {                        
                        region.map((elemento,i)=>(
                            <option key={"region"+i} value={elemento.id} >{elemento.nombre_region}</option>
                        ))             
                    }
                </select>
            </div>

            <div>
                <label>Provincia</label>
                <select name="provincia" id="provincia"
                onChange={buscaComuna}>
                    <option value={-1} disabled selected>Seleccione una provincia</option>
                    {
                        provincia.map((elemento,j)=>(
                            <option key={"provincia"+j} value={elemento.id}>{elemento.nombre_provincia}</option>
                        ))
                    }
                </select>
            </div>

            <div>
                <label>Comuna</label>
                <select name="comuna"
                onChange={e => {                    
                    setRecibirComuna(e.target.value)                                
                }}                
                >
                    <option value={-1} disabled selected>Seleccione una comuna</option>
                    {
                        comuna.map((elemento,i)=>(
                            <option key={"comuna"+i} value={elemento.id}
                            >{elemento.nombre_comuna}</option>
                        ))
                    }
                </select>
            </div>

            <div>
                <label>
                    Nombre de Calle:
                </label>
                <input 
                    type="text"
                    id="calle"
                    name="calle"
                    value={calle}
                    onChange={ (e) => {setCalle(e.target.value)}}
                >
                </input>

                <button
                onClick={insertarCalle}
                    
                >Guardar</button>

            </div>

    </div>
    )
}