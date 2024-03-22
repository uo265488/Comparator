import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { findProductById } from "../../api/ApiService";
import { Wrapper } from "../../helper/styles";
import { Link } from "react-router-dom";
import { Card } from "react-native-paper";

export default function ProductoEnListaPersonal(props) {

  let productImg = require("../../static/images/producto.png");
  var supermercadoImg = require("../../static/images/" + props.product.supermercado + ".png");;

  const [productItem, setProductItem] = useState();

  const getProductCharacteristics = () => {
    findProductById(
      props.product.barcode + "" + props.product.supermercado
    ).then((res) => {
      setProductItem(res);
    });
  };

  useEffect(() => {
    getProductCharacteristics();
  }, []);

  return (
    <Grid item xs={12} md={6}>
      {productItem != undefined && (
        <Card
          sx={{
            width: { md: 345, xs: 250 },
            height: { md: 500, xs: 350 },
            bgcolor: "background.card",
            borderRadius: 8,
            boxShadow: "10",
          }}
        >
          <CardMedia
            component="img"
            sx={{ height: { md: 300, xs: 150 } }}
            image={productImg}
            alt={productItem.nombre}
          />
          <CardContent sx={{ height: { xs: 100, md: 120 } }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ typography: { md: "h5", xs: "h6" } }}
            >
              {productItem.nombre}
            </Typography>

            <Wrapper>
              <img
                src={supermercadoImg}
                alt={"Product image"}
              />
            </Wrapper>
          </CardContent>
          <FormControlLabel
          control={<Checkbox color="success" />}
          label="Producto comprado"
        />
        </Card>
      )}
    </Grid>
  );
}
