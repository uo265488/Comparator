import { CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import { Button, Card } from "react-native-paper";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { añadirProductoALaLista } from "../redux/reduxConfig";
import { productoAElemento } from "../helper/parser";
import { StyledButton } from "../helper/styles";



export default function ProductCard(props) {
  
  const dispatch = useDispatch();

  const onAddToLaLista = (clickedItem) => {
    dispatch(añadirProductoALaLista(clickedItem, { payload : clickedItem.producto.barcode }));
  }

  const verMas = () => props.setVerMasProducto(props.product);

  let imageRef = require("../static/images/producto.png");
  const navigate = useNavigate();
    return (
      <Card sx={{ width: { md: 345, xs: 250 }, height: { md: 500, xs: 350 }, bgcolor: "background.card", borderRadius: 8, boxShadow: '10' }}>
        <CardMedia
          component="img"
          sx={{ height: { md: 300, xs: 150 } }}
          image={imageRef}
          alt={props.product.nombre}
        />
        <CardContent sx={{ height: { xs: 100, md: 120 } }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ typography: { md: 'h5', xs: 'h6' } }}>
            {props.product.nombre}
          </Typography>
          <Typography gutterBottom variant="h5" component="div" sx={{ typography: { md: 'h5', xs: 'h6' } }}>
            {parseFloat(props.product.precios[props.product.precios.length - 1]).toFixed(2)} €
          </Typography>
          <Typography variant="body2" color="text.secondary" >
            Supermercado: {props.product.supermercado}
                </Typography>
          <Typography variant="body2" color="text.secondary">
            Marca: {props.product.marca}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Proveedor: {props.product.proveedor}
          </Typography>
        </CardContent>
        <CardActions >
          {//<Button size="small">Share</Button>
          }
          <StyledButton sx={{ bgcolor: 'background.button', ":hover": { bgcolor: 'background.buttonhover' }, color: 'text.dark', ml: { xs: 0, md: 6 } }}
            onPress={_event => onAddToLaLista(productoAElemento(props.product))} mode="contained"
          >
            Añadir a la lista de la compra
          </StyledButton>
          <Button sx={{ bgcolor: 'background.button', ":hover": { bgcolor: 'background.buttonhover' }, color: 'text.dark' }}
            onPress={_event => verMas()}>
            Ver más
          </Button>
        </CardActions>
      </Card>
    )
}