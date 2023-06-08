import { Box, Paper, Typography, createTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { añadirProductoALaLista } from "../redux/reduxConfig";
import { NumberPicker } from "react-widgets/cjs";
import { StyledButton, Wrapper } from "../helper/styles";

export default function ProductInformationCard(props) {

  console.log("props");
  console.log(props.producto);

  let imageRef = require("../static/images/producto.png");
  let imgSupermercado = require("../static/images/" +
    props.producto.supermercado +
    ".png");

  const dispatch = useDispatch();

  const [value, setValue] = useState(1);

  function abrirSubidaDePrecioForm() {
    props.setButtonPressed(1);
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
            >
              Precio:{" "}
              {props.precioActual}€
            </Typography>
            <Box>
              <img src={imageRef} alt={props.producto.nombre} />
            </Box>
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
            <StyledButton
              mode="contained"
              sx={{
                bgcolor: "background.button",
                ":hover": { bgcolor: "background.buttonhover" },
                color: "text.dark",
                mr: { xs: 0, sm: 2, md: 10, lg: 0, xl: 30 },
              }}
              onClick={abrirSubidaDePrecioForm}
            >
              Registrar una subida de precio
            </StyledButton>
          </div>
        </Box>
      </Paper>
    </>
  );
}
