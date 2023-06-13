import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { StyledButton } from "../../routes/LaLista";
import {
  añadirProductoALaLista,
  borrarProductoDeLaLista,
  mejorarAlternativa,
} from "../../redux/reduxConfig";

import { productoAElemento } from "../../helper/parser";
import { findAlternative } from "../../api/ApiService";
import { Alert, Checkbox, FormControlLabel } from "@mui/material";

export default function ProductoEnLista(props) {
  let imageRef = require("../../static/images/producto.png");

  const dispatch = useDispatch();

  const [productItem, setProductItem] = useState(props.item);
  const [existsAlternativeAlert, setExistsAlternativeAlert] = useState(false);
  const [isMejoraPerformed, setMejoraPerformed] = useState(false);

  /**
   * Añade un producto a la lista de la compra
   *
   * @param clickedItem
   */
  const addToLaLista = (clickedItem) => {
    clickedItem.mejora = -1;
    dispatch(
      añadirProductoALaLista(clickedItem, {
        payload: clickedItem.producto.barcode,
      })
    );
    if (productItem.unidades <= 100) {
      setProductItem({
        producto: productItem.producto,
        unidades: productItem.unidades + 1,
        mejora: productItem.mejora,
      });
    }
    props.añadirProductoALaLista(clickedItem);
  };

  /**
   * Borra un producto de la lista de la compra
   * @param clickedItem
   */
  const removeFromLaLista = (clickedItem) => {
    dispatch(
      borrarProductoDeLaLista(clickedItem, {
        payload: clickedItem.producto.barcode,
      })
    );
    if (productItem.unidades > 0)
      setProductItem({
        producto: productItem.producto,
        unidades: productItem.unidades - 1,
        mejora: productItem.mejora,
      });

    props.borrarProductoDeLaLista(clickedItem);
  };

  /**
   * Mejora la alternativa
   */
  const improveAlternative = () => {
    findAlternative({
      producto: productItem.producto,
      supermercado: props.supermercado,
      marca: props.marca
    }).then((data) => {
      var productoMejorado = data.hits[0];

      if (productoMejorado != undefined) {
        dispatch(
          mejorarAlternativa({
            productoAMejorar: productItem.producto,
            alternativa: productoMejorado,
            mejora: -1,
          })
        );
        setMejoraPerformed(true);

        props.mejorarAlternativa(productItem.producto, productoMejorado);

        setProductItem({
          producto: productoMejorado,
          unidades: productItem.unidades,
          mejora:
            (productItem.producto.precioActual -
              productoMejorado.precioActual) /
            productItem.producto.precioActual,
        });

        setExistsAlternativeAlert(false);
      } else {
        setExistsAlternativeAlert(true);
      }
    });
    //props.computeTotalPrice();
  };

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
      <div >
        {productItem.mejora > 0 && (
          <Alert severity="success">
            La mejora de esta alternativa ha supuesto un ahorro del{" "}
            {(productItem.mejora * 100).toFixed(2)}% =
            {(
              (productItem.producto.precioActual / (1 - productItem.mejora) -
                productItem.producto.precioActual) *
              productItem.unidades
            ).toFixed(2)}{" "}
            euros en este producto.
          </Alert>
        )}
        {productItem.mejora < 0 && (
          <Alert severity="error">
            La mejora de esta alternativa ha supuesto una pérdida del{" "}
            {(-productItem.mejora * 100).toFixed(2)}% =
            {(
              (productItem.producto.precioActual / (1 - productItem.mejora) -
                productItem.producto.precioActual) *
              productItem.unidades
            ).toFixed(2)}{" "}
            euros en este producto.
          </Alert>
        )}
        {productItem.mejora == 0 && (
          <Alert severity="warning">
            No hay una alternativa mejor para este producto.{" "}
          </Alert>
        )}

        <h3>{productItem.producto.nombre}</h3>
        <FormControlLabel control={<Checkbox color="success" />} label="Producto comprado" />
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
        <div className="buttons">
          <StyledButton
            size="small"
            disableElevation
            variant="contained"
            onClick={() =>
              removeFromLaLista(productoAElemento(productItem.producto))
            }
            sx={{
              bgcolor: "background.button",
              ":hover": { bgcolor: "background.buttonhover" },
              color: "text.dark",
            }}
          >
            -
          </StyledButton>
          <p>{productItem.unidades}</p>
          <StyledButton
            size="small"
            disableElevation
            variant="contained"
            onClick={() =>
              addToLaLista(productoAElemento(productItem.producto))
            }
            sx={{
              bgcolor: "background.button",
              ":hover": { bgcolor: "background.buttonhover" },
              color: "text.dark",
            }}
          >
            +
          </StyledButton>
        </div>
        <p> </p>
        <StyledButton
          size="small"
          disableElevation
          variant="contained"
          onClick={() => improveAlternative()}
          sx={{
            bgcolor: "background.button",
            ":hover": { bgcolor: "background.buttonhover" },
            color: "text.dark",
            width: "100%",
          }}
        >
          Buscar mejor alternativa
        </StyledButton>
      </div>

      <img src={imageRef} alt={productItem.producto.nombre} />
    </Wrapper>
  );
}
