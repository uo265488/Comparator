import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Alert, Button, Container, Dialog, Paper } from "@mui/material";
import { useState } from "react";
import Box from "@mui/material/Box";
import { registrarSubidaDePrecio } from "../../api/ApiService";
import { Title } from "react-native-paper";
import ProductImageLoader from "../../helper/ProductImageLoader";

export default function SubidaDePrecioForm(props) {
  const [formValues, setFormValues] = useState({
    precio: "",
    supermercado: "",
  });

  const [errors, setErrors] = useState({
    precio: "",
    supermercado: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [updatePerformed, setUpdatePerformed] = useState(false);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormValues({
      ...formValues,
      [id]: value,
    });
  };

  const registrarSubida = async () => {
    var precios = props.producto.precios;
    precios[precios.length] = parseFloat(formValues.precio.replace(',', '.'));

    var producto = {
      barcode: props.producto.barcode,
      nombre: props.producto.nombre,
      precios: precios,
      supermercado: props.producto.supermercado,
      marca: props.producto.marca,
      proveedor: props.producto.proveedor,
      fechas_de_registro: props.producto.fechas_de_registro,
      precioActual: precios[precios.length - 1],
    };

    registrarSubidaDePrecio(producto);

    setIsOpen(false);
    setUpdatePerformed(true);

    setFormValues({
      ...formValues,
      precio: "",
    });
    setFormValues({
      ...errors,
      precio: "",
    });
    props.setMejoraPerformed(true);
  };

  const submitForm = () => {
    var actualErrors = {
      precio:
        formValues.precio.trim() === "" ? "El Precio es obligatorio." : "",
    };
    setErrors(actualErrors);

    if (actualErrors.precio === "") {
      setIsOpen(true);
    }
  };

  const hideConfirmationDialog = () => {
    setIsOpen(false);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      {updatePerformed && (
        <Alert severity="success">
          El cambio de precio se ha registrado en nuestra base de datos
          correctamente, ¡Muchas gracias!{" "}
        </Alert>
      )}
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography variant="h6" gutterBottom>
          Añade un cambio de precio a nuestra base de datos:
        </Typography>

        <Grid item xs={12}>
          <Title>{props.producto.barcode}</Title>
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
            value={props.producto.nombre}
          />
        </Grid>
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
          <TextField
            id="supermercado"
            name="state"
            label="Supermercado"
            fullWidth
            variant="standard"
            value={props.producto.supermercado}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="proveedor"
            name="proveedor"
            label="Proveedor del producto"
            fullWidth
            autoComplete="proveedor"
            variant="standard"
            value={props.producto.proveedor}
          />
        </Grid>
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
            value={props.producto.marca}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ProductImageLoader
            imageName={`${props.producto.barcode}${props.producto.supermercado}`}
            alt={`${props.producto.id}_${props.producto.supermercado}`}
            style={{ width: '95%', height: '95%', marginTop: '1em' }}
          />
        </Grid>

        <Grid item xs={12} marginTop="2em">
          <Button type="submit" variant="contained" onClick={submitForm}>
            {" "}
            Registrar subida de precio
          </Button>
        </Grid>

        {isOpen && (
          <Dialog open={isOpen}>
            <Grid margin={3} columnSpacing={2} rowSpacing={2}>
              <Typography variant="h6" gutterBottom>
                Confirmación de registro
              </Typography>
              <p>
                ¿Estás seguro de que quieres registrar esta subida de precio en
                nuestra base de datos?
              </p>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={registrarSubida}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Si
                </Button>
                <Button
                  variant="contained"
                  onClick={hideConfirmationDialog}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Cancelar
                </Button>
              </Box>
            </Grid>
          </Dialog>
        )}
      </Paper>
    </Container>
  );
}
