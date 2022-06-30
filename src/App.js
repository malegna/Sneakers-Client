import React, { useState, useEffect }from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader }  from 'reactstrap';
import axios from 'axios';
import { TableWithBrowserPagination } from 'react-rainbow-components';
import Paginado from "./Paginado";


function App() {
  const baseUrl="http://localhost:80/apiSneakers/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [productoSeleccionado, setproductoSeleccionado]=useState({
    Id: '',
    Title: '',
    Price: '',
    Description: '',
    Image: ''
  });

  //paginacion 
  const [currentPage, setCurrentPage] = useState (1);
  const [productsPage, setProductsPage] = useState(5);
  const indexOfLastProduc = currentPage * productsPage
  const indexOfFirstProduct = indexOfLastProduc - productsPage //
  const currentProduct = data.slice(indexOfFirstProduct, indexOfLastProduc)

  const paginado =(pageNumber) =>{
    setCurrentPage(pageNumber)
}


  const handleChange=e=>{
    const {name, value}=e.target;
    setproductoSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(productoSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("Title", productoSeleccionado.Title);
    f.append("Price", productoSeleccionado.Price);
    f.append("Description", productoSeleccionado.Description);
    f.append("Image", productoSeleccionado.Image);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("Title", productoSeleccionado.Title);
    f.append("Price", productoSeleccionado.Price);
    f.append("Description", productoSeleccionado.Description);
    f.append("Image", productoSeleccionado.Image);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {Id: productoSeleccionado.Id}})
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(product=>{
        if(product.Id===productoSeleccionado.Id){
          product.Title=productoSeleccionado.Title;
          product.Price=productoSeleccionado.Price;
          product.Description=productoSeleccionado.Description;
          product.Image=productoSeleccionado.Image;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {Id: productoSeleccionado.Id}})
    .then(response=>{
      setData(data.filter(product=>product.Id!==productoSeleccionado.Id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarProducto=(product, caso)=>{
    setproductoSeleccionado(product);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div style={{textAlign: 'center'}}>
<br />
      <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
      <br /><br />
{/* 
  <TableWithBrowserPagination keyField="Id" pageSize={5}> */}
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Price</th>
          <th>Image</th>
          <th>Description</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {currentProduct.map(product=>(
          <tr key={product.Id}>
            <td>{product.Id}</td>
            <td><b>{product.Title}</b></td>
            <td>{product.Price}</td>
            <td><img className= "img-dog" src= {product.Image} alt='imagen no diponible' width= "200px" height="250px"></img></td>
            <td>{product.Description}</td>
          <td>
          <button className="btn btn-primary" onClick={()=>seleccionarProducto(product, "Editar")}>Editar</button> {"  "}
          <button className="btn btn-danger" onClick={()=>seleccionarProducto(product, "Eliminar")}>Eliminar</button>
          </td>
          </tr>
        ))}


      </tbody> 

    </table>
 


    <Modal isOpen={modalInsertar}>
      <ModalHeader>Insert Product</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Title: </label>
          <br />
          <input type="text" className="form-control" name="Title" onChange={handleChange}/>
          <br />
          <label>Price: </label>
          <br />
          <input type="text" className="form-control" name="Price" onChange={handleChange}/>
          <br />
          <label>Description: </label>
          <br />
          <input type="text" className="form-control" name="Description" onChange={handleChange}/>
          <br />
          <label>Image: </label>
          <br />
          <input type="text" className="form-control" name="Image" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insert</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>


    
    <Modal isOpen={modalEditar}>
      <ModalHeader>Edit Product</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Title: </label>
          <br />
          <input type="text" className="form-control" name="Title" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Title}/>
          <br />
          <label>Price: </label>
          <br />
          <input type="text" className="form-control" name="Price" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Price}/>
          <br />
          <label>Description: </label>
          <br />
          <input type="text" className="form-control" name="Description" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Description}/>
          <br />
          <label>Image: </label>
          <br />
          <input type="text" className="form-control" name="Image" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Image}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el Producto {productoSeleccionado && productoSeleccionado.Title}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>
          <Paginado
          productsPage ={productsPage}
          baseUrl ={data.length}
          paginado ={paginado}
          actual ={currentPage}
          />
    </div>
  );
}

export default App;
