import { Box, Paper, Typography, createTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { añadirProductoALaLista } from "../redux/reduxConfig";
import { NumberPicker } from "react-widgets/cjs";
import { StyledButton, Wrapper } from "../helper/styles";
import { Button } from "react-native-paper";

export default function ProductInformationCard(props) {

  let imageRef = require("../static/images/producto.png");
  let imgSupermercado = require("../static/images/" +
    props.producto.supermercado +
    ".png");

  const dispatch = useDispatch();

  const [value, setValue] = useState(1);

  function abrirSubidaDePrecioForm() {
    props.setButtonPressed(true);
  }

  const addProductToLaLista = () => {
    dispatch(
      añadirProductoALaLista({
        producto: props.producto,
        unidades: value,
      })
    );
    setValue(1);
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box>
          <div className="product-info">
            <Wrapper>
              <img sx={{}} src={imgSupermercado} alt={props.supermercado} />
            </Wrapper>
            <Typography
              variant="h5"
              sx={{
                pt: 4,
                pb: 4,
                color: "text.default",
                typography: { sm: "h5", xs: "h6" },
              }}
              className="product-price"
            >
              Precio: {props.producto.precioActual}€
            </Typography>
            <Box className="product-img" >
              <img src={imageRef} alt={props.producto.nombre} />
            </Box>
            <div>
              <Typography variant="subtitle1" paragraph>
                Marca: {props.producto.marca}<br></br>
                Proveedor: {props.producto.proveedor}
              </Typography>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                p: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <NumberPicker
                min={1}
                value={value}
                onChange={(value) => {
                  if (value !== null) setValue(value);
                }}
                style={{}}
              ></NumberPicker>

              <StyledButton
                mode="contained"
                sx={{
                  bgcolor: "background.button",
                  ":hover": { bgcolor: "background.buttonhover" },
                  color: "text.dark",
                  mr: { xs: 0, sm: 2, md: 10, lg: 0, xl: 30 },
                }}
                onClick={addProductToLaLista}
              >
                Añadir a LaLista
              </StyledButton>
            </Box>

            <Button id="rsButton" mode="contained" onClick={abrirSubidaDePrecioForm}>
              Registrar un cambio de precio
            </Button>
          </div>
        </Box>
      </Paper>
    </>
  );
}
