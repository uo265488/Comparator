import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Alert, Button, Container, Dialog, Paper } from '@mui/material';
import {useState } from 'react';
import Box from '@mui/material/Box';
import { addNonExistingProduct } from '../../api/ApiService';
  
export default function RegisterProductForm(props) {

  const [formValues, setFormValues] = useState({
    nombre: "",
    precio: "",
    supermercado: "",
    marca: "",
    proveedor: ""
  });

  const [errors, setErrors] = useState({
    nombre: "",
    precio: "",
    supermercado: "",
    marca: "",
    proveedor: ""
  });

  const [isOpen, setIsOpen] = useState(false);
  const [successfulAdd, setSuccessfulAdd] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
    
    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormValues({
          ...formValues,
          [id]: value,
        });
      };

  const indexProduct = async () => {

    let result = await addNonExistingProduct({
      barcode: props.code, nombre: formValues.nombre, precios: [parseFloat(formValues.precio)],
      supermercado: formValues.supermercado, marca: formValues.marca, proveedor: formValues.proveedor,
      precioActual: parseFloat(formValues.precio)
    });

      if (result) {
  
      setFormValues({
        ...formValues,
        nombre: "",
        precio: "",
        supermercado: "",
        marca: "",
        proveedor: ""
      });
      setFormValues({
        ...errors,
        nombre: "",
        precio: "",
        supermercado: "",
        marca: "",
        proveedor: ""
      });
      setSuccessfulAdd(true);
    } else {
      setNotLoggedIn(true)
    }
    setIsOpen(false);

  }

  const submitForm = () => {
    var actualErrors = {
      marca: formValues.marca.trim() === "" ? "La Marca del producto es obligatoria." : "",
      precio: formValues.precio.trim() === "" ? "El Precio es obligatorio." : "",
      supermercado: formValues.supermercado.trim() === "" ? "El Supermercado es obligatorio." : "",
      proveedor: formValues.proveedor.trim() === "" ? "El Proveedor es obligatorio." : "",
      nombre: formValues.nombre.trim() === "" ? "El Nombre del producto es obligatorio." : ""
    }
    setErrors(actualErrors);

    if ((actualErrors.nombre === "") && (actualErrors.marca === "") && (actualErrors.precio === "") && (actualErrors.proveedor === "") && (actualErrors.supermercado === "")) {
      setIsOpen(true);
    }
  }

  const hideConfirmationDialog = () => {
    setIsOpen(false);
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      { successfulAdd && <Alert severity="success">El Producto se ha registrado en nuestra base de datos correctamente, !Muchas gracias! </Alert>}
      {notLoggedIn && <Alert severity="error">You are not logged in. Go and log into your POD if you want to check out.</Alert>}
      
      <Typography variant="h6" gutterBottom>
        Añade un producto no registrado a nuestra base de datos:
      </Typography>

      <Grid item xs={12}>
              <p>{props.code}</p>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="nombre"
          name="nombre"
          label="Nombre del producto"
          fullWidth
          autoComplete="Nombre del producto"
          variant="standard"
          onChange={handleInputChange}
          value={formValues.nombre}
        />
      </Grid>
      {errors.nombre && <Alert severity="error">{errors.nombre}</Alert>}
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="precio"
          name="precio"
          label="Precio"
          fullWidth
          autoComplete="Precio"
          variant="standard"
          onChange={handleInputChange}
          value={formValues.precio}
        />
      </Grid>
      {errors.precio && <Alert severity="error">{errors.precios}</Alert>}
      <Grid item xs={12} sm={6}>
      <MyComboBox
          supermercado={formValues.supermercado}
          setSupermercado={(supermercado) => formValues.supermercado = supermercado }
          supermercados={SUPERMERCADOS}
        />
      </Grid>
      {errors.supermercado && <Alert severity="error">{errors.supermercado}</Alert>}
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="proveedor"
          name="proveedor"
          label="Proveedor del producto"
          fullWidth
          autoComplete="proveedor"
          variant="standard"
          onChange={handleInputChange}
          value={formValues.proveedor}
        />
      </Grid>
      {errors.proveedor && <Alert severity="error">{errors.proveedor}</Alert>}
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="marca"
          name="marca"
          label="Marca del producto"
          fullWidth
          autoComplete="marca"
          variant="standard"
          onChange={handleInputChange}
          value={formValues.marca}
        />
      </Grid>
      {errors.marca && <Alert severity="error">{errors.marca}</Alert>}
      <Grid item xs={12} marginTop="2em">
        <Button type="submit" variant="contained" onClick={submitForm} >Registrar producto</Button>
      </Grid>

      {isOpen && (<Dialog open={isOpen}>
        <Grid margin={3} columnSpacing={2} rowSpacing={2} >
          <Typography variant="h6" gutterBottom>
            Confirmación de registro
          </Typography>
          <p>¿Estás seguro de que quieres registrar este producto en nuestra base de datos?</p>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={indexProduct} sx={{ mt: 3, ml: 1 }}>Si</Button>
            <Button variant="contained" onClick={hideConfirmationDialog} sx={{ mt: 3, ml: 1 }}>Cancelar</Button>
          </Box>

        </Grid>

      </Dialog>)}


      </Paper>
    </Container>
  );
}

