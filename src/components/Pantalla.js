import axios from "axios"
import React, {useState, useEffect} from "react"
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, MenuItem, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

const theme = createTheme();

export default function Mantenedor() {   

    const [accion, setAccion] = useState("Registrar");
    const [id_calle, setid_calle] = useState([]);

    const [regiones, setRegiones] = useState([]);
    const [regionLbl, setRegionLbl] = useState("Region");
    const [provinciaLbl, setProvinciaLbl] = useState("Provincia");
    const [comunaLbl, setComunaLbl] = useState("Comuna");

    const [region, setRegion] = useState([]);
    const [provincia, setProvincia] = useState([]);
    const [comuna, setComuna] = useState([]);

    const [calle, setCalle] = useState("");
    const [recibirComuna, setRecibirComuna] = useState([]);
    const [datos, setDatos] = useState([]);
    
    const peticionRegiones = async () =>{
       const ans = await axios
        .get("http://127.0.0.1:8000/api/regiones")
        .then((response)=>{
            console.log(response.data) 
            return response.data                             
        })
        .catch((error)=>{
            console.log(error)
        })
        let options = [];
        options = ans.map((elemento)=>{
          let o ={
            id: elemento.id,
            nombre_region: elemento.nombre_region
          }
          return o;
        })
        return options
        console.log(options)
    }
    useEffect(()=>{
        peticionRegiones().then((datosR)=>{
          setRegiones(datosR)                
        })              
    },[])


    useEffect(()=>{
      ListarCalles()  
    },[])

    const buscaProvincia = async (idRegion , value) =>{        
        console.log(value.id)                                      
        const ans = await axios
        .get("http://127.0.0.1:8000/api/provinciasRegion/"+value.id)
        .then((response)=>{
            console.log(response.data) 
            setProvincia(response.data)    
            return provincia            
        })
        .catch((error)=>{
            console.log(error)
        })        
        let options = [];
        options = ans.map((elemento)=>{
          let o = {
            id: elemento.id,
            nombre_provincia: elemento.nombre_provincia,
            id_region: elemento.id_region           
          }
          return o;
        })
        return options        
    }
    const buscaComuna = async (idProvincia, value) => {      
        console.log(value.id)
        const ans = await axios
        .get("http://127.0.0.1:8000/api/comunasProvincia/"+value.id)
        .then((response)=>{
            console.log(response.data)
            setComuna(response.data)
            return comuna
        })
        .catch((error)=>{
            console.log(error)
        })
        let options = [];
        options = ans.map((elemento)=>{
          let o = {
            id: elemento.id,
            nombre_comuna: elemento.nombre_comuna,
            id_provincia: elemento.id_provincia           
          }
          return o;
        })
        return options
        console.log(options)
    }
  
    const insertarCalle = () =>{                                                   
        if(accion == "Registrar"){
          if(calle ==""|| calle==="") {
            alert("Complete el campo nombre")            
          }                          
        //   console.log("guardando")
        //   console.log(recibirComuna)
        // console.log(calle)  
        else{     
        axios
        .post("http://127.0.0.1:8000/api/calle" ,{
            nombre_calle:calle,
            id_comuna:recibirComuna
        })
        .then((response)=>{
            // console.log("correcto")
            // console.log(response.data)
            if (response.status == 200){
              alert("Calle Registrada")
              ListarCalles()
              
              window.location.reload()       
            }
        })
        .catch(error=>{
            console.log(error)
        })  
      }
        }

        if(accion =="Modificar"){
          // console.log("aparte-----")
          // console.log(calle)
          // console.log(id_calle)
        // console.log(recibirComuna)
          axios
          .put("http://127.0.0.1:8000/api/calle/"+id_calle,{
            nombre_calle: calle,
            id_comuna: recibirComuna
          })
          .then((response)=>{
            if(response.status==200){
              alert("Modificado")
              ListarCalles();              
              // setCalle("")              
              setAccion("Registrar")
              window.location.reload()
            }
          },
          (error)=>{
            console.log("error de modificacion")
            console.log(error)
          }
  
  )
        }
    }

    const ListarCalles = () => {
      axios
      .get("http://127.0.0.1:8000/api/calles")
      .then(
        (response) => {                
          setDatos(response.data);   
          // console.log(response.data)                 
        },  
        (error) => {          
          console.log(error)
        }
      );
    };
const Eliminar = (item) =>{      
  let confirmacion = window.confirm("¿Desea eliminar la calle " +item.nombre_calle+ " de " + item.nombre_comuna+ "?")  
  if (confirmacion==true){    
    axios
      .delete("http://127.0.0.1:8000/api/calle/"+item.id_calle)
      .then(
        (response) => {
          if (response.status == 200) {
            alert("Calle Eliminada")
            ListarCalles();            
          }
        },
        (error) => {
          console.log("error al eliminar")
        }
      );
  }else{
    alert("Eliminacion cancelada")
  }  
}

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" fullWidth>
        <CssBaseline />
        <Box id="form-crear"
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'            
          }}
        >        
          <Typography component="h1" variant="h5">
            <b>Mantenedor de Calles</b>
          </Typography>
          <Box component="form"  noValidate  sx={{marginTop: 1}}>
            <Container>
            <TextField
            sx={{ width: 600, ml:2 }}
              margin="normal"
              required              
              id="calle"
              label="Nombre Calle"
              name="calle"
              autoComplete="calle"
              autoFocus
              value={calle}
              onChange={ (e) => {setCalle(e.target.value)}}
            />            

          <FormControl id="formControl1"fullWidth sx={{marginTop:3, ml:2  }}>
              <Autocomplete              
              fullWidth              
                onChange={buscaProvincia}                                               
                id="combo-box-demo"
                options={regiones}
                getOptionLabel={(region)=> region.nombre_region}
                sx={{ width: 600 }}
                renderInput={(params1) => 
                  <TextField {...params1} label={regionLbl} 
                  onClick={()=> { setRegionLbl("Region");
                                  setProvinciaLbl("Provincia"); 
                                  setComunaLbl("Comuna")}}
                  required/>
                }
              />
          </FormControl>

            <FormControl id="formControl2"fullWidth sx={{marginTop:3, ml:2  }}>
            <Autocomplete
              onChange={buscaComuna}              
              id="combo-box-demo"
              options={provincia}
              getOptionLabel={(provincia)=> provincia.nombre_provincia}
              sx={{ width: 600 }}
              renderInput={(params2) => <TextField {...params2} label={provinciaLbl} />}
            />
            </FormControl>
            <FormControl id="formControl3"fullWidth sx={{marginTop:3, ml:2  }}>
            <Autocomplete
              onChange={(e, value) => {                    
                console.log(value.id)
                setRecibirComuna(value.id)                                                
            }}              
              id="combo-box-demo"
              options={comuna}
              getOptionLabel={(comuna)=> comuna.nombre_comuna}
              sx={{ width: 600 }}
              renderInput={(params3) => <TextField {...params3} label={comunaLbl} />}
            />
            </FormControl>
            </Container>

            <Button                         
              variant="contained"
              sx={{mt:4, ml:34}}              
              // onClick={insertarCalle}              
              onClick={()=>{insertarCalle()
                setRegionLbl("Region");
                setProvinciaLbl("Provincia"); 
                setComunaLbl("Comuna")}}              
            >
              {accion}
            </Button>           
          </Box>
        </Box>        

       <Box>
       <TableContainer component={Paper} sx={{ mt:3 ,mb:4}}>
          <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell><b>Calle</b></TableCell>
              <TableCell><b>Comuna</b></TableCell>
              <TableCell><b>Provincia</b></TableCell>
              <TableCell><b>Region</b></TableCell>
              <TableCell><b>Opciones</b></TableCell>
            </TableRow>
          </TableHead>
      
          <TableBody>
          { datos.map((dato)=>(
             <TableRow key={dato.id_calle}>
              <TableCell >{dato.nombre_calle}</TableCell>
              <TableCell >{dato.nombre_comuna}</TableCell>
              <TableCell >{dato.nombre_provincia}</TableCell>
              <TableCell >{dato.nombre_region}</TableCell>
              <TableCell>
                
                <Button
                  variant="contained"
                  onClick={()=>{
                  // ocultarSelect()
                  // mostrar()
                  setid_calle(dato.id_calle)
                  console.log(dato.id_calle)

                  setCalle(dato.nombre_calle)
                  console.log(dato.nombre_calle)

                  setComunaLbl(dato.nombre_comuna)
                  console.log(dato.nombre_comuna)
                  
                  setProvinciaLbl(dato.nombre_provincia)
                  console.log(dato.nombre_provincia)

                  setRegionLbl(dato.nombre_region)
                  console.log(dato.nombre_region)

                  setAccion("Modificar")
                }}>
                  Modificar
                </Button>


                <span> </span>
                <Button variant="contained" color="error" onClick={()=>Eliminar(dato)}>Eliminar</Button>
              </TableCell>
             </TableRow>
          )) }           
          </TableBody>
          </Table>
        </TableContainer>
       </Box>
      </Container>
    </ThemeProvider>
  );
}














