import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { Wrapper } from "../../helper/styles";

function preventDefault(event) {
  event.preventDefault();
}

export default function AdviceBox(props) {
  let imgSupermercado = require("../../static/images/" + props.producto.supermercado + ".png");

  const computeChangePercentage = () => {
    if (props.producto.precios.length > 1) {
      return (
        ((props.producto.precioActual -
          props.producto.precios[props.producto.precios.length - 2]) /
          props.producto.precios[props.producto.precios.length - 2]) *
        100
      ).toFixed(2);
    }
    return 0;
  };

  var changePercentage = computeChangePercentage();

  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <Typography color="text.primary" sx={{ flex: 1 }}>
        {props.producto.nombre}
      </Typography>
      <Typography component="p" variant="h4">
        {changePercentage >= 0
          ? props.producto.precioActual + " (+" + changePercentage+ "%)"
          : props.producto.precioActual + " (-" + changePercentage + "%)"}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        el{" "}
        {
          props.producto.fechas_de_registro[
          props.producto.fechas_de_registro.length - 1
          ]
        }
      </Typography>
      <Wrapper>
        <img src={imgSupermercado} alt={props.producto.supermercado} />
      </Wrapper>
    </React.Fragment>
  );
}
