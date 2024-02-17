import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

export default function ProductoEnListaPersonal(props) {
  let imageRef = require("../../static/images/producto.png");

  const [productItem, setProductItem] = useState(props.item);

  const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    font-family: Arial, Helvetica, sans-serif;
    border-bottom: 0.01em solid lightblue;
    padding-bottom: 2em;
    div {
      flex: 1;
    }
    .information,
    .buttons {
      display: flex;
      justify-content: space-between;
    }
    img {
      max-width: 10em;
      object-fit: cover;
      margin-left: 2em;
    }
  `;

  return (
    <Wrapper className="cart-item-product">
      <div>
        <h3>{producto.nombre}</h3>
        <FormControlLabel
          control={<Checkbox color="success" />}
          label="Producto comprado"
        />
        <h4> Marca: {productItem.producto.marca}</h4>
        <div className="information">
          <p>Precio: {productItem.producto.precioActual} € </p>
          <p>
            Total:{" "}
            {(productItem.unidades * productItem.producto.precioActual).toFixed(
              2
            )}{" "}
            €{" "}
          </p>
        </div>
      </div>
      <img src={imageRef} alt={productItem.producto.nombre} />
    </Wrapper>
  );
}
