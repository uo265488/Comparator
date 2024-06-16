import { CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Button, Card } from "react-native-paper";
import { useDispatch } from "react-redux";
import { añadirProductoALaLista } from "../redux/reduxConfig";
import { productoAElemento } from "../helper/parser";
import { StyledButton, Wrapper } from "../helper/styles";

export default function ProductCard(props) {
  const dispatch = useDispatch();

  const onAddToLaLista = (clickedItem) => {
    dispatch(
      añadirProductoALaLista(clickedItem, {
        payload: clickedItem.producto.barcode,
      })
    );
  };

  let imageRef = require("../static/images/producto.png");
  let imgSupermercado = require("../static/images/" +
    props.product.supermercado +
    ".png");

  const verMas = () => props.setVerMasProducto(props.product);

  return (
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
        image={imageRef}
        alt={props.product.id + '_' + props.product.supermercado}
      />
      <CardContent sx={{ height: { xs: 100, md: 120 } }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ typography: { md: "h5", xs: "h6" } }}
        >
          {props.product.nombre}
        </Typography>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ typography: { md: "h5", xs: "h6" } }}
        >
          {parseFloat(
            props.product.precios[props.product.precios.length - 1]
          ).toFixed(2)}{" "}
          €
        </Typography>
        <Wrapper>
          <img  src={imgSupermercado} alt={props.product.supermercado} />
        </Wrapper>
      </CardContent>
      <CardActions>
        <StyledButton
          sx={{
            bgcolor: "background.button",
            ":hover": { bgcolor: "background.buttonhover" },
            color: "text.dark",
            ml: { xs: 0, md: 6 },
          }}
          onPress={(_event) => onAddToLaLista(productoAElemento(props.product))}
          mode="contained"
        >
          Añadir a la lista de la compra
        </StyledButton>
        <Button
          sx={{
            bgcolor: "background.button",
            ":hover": { bgcolor: "background.buttonhover" },
            color: "text.dark",
          }}
          onPress={(_event) => verMas()}
        >
          Ver más
        </Button>
      </CardActions>
    </Card>
  );
}
