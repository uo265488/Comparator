import ProductoEnLista from "./ProductoEnLista";
import { Grid, Paper } from "@mui/material";
import { Wrapper } from "../../helper/styles";



export default function SupermercadoEnLista(props) {
  if (props.productos.length == 0) {
    return <></>;
  }

  let imageRef = require("../../static/images/" +
    props.productos[0].producto.supermercado +
    ".png");

  return (
    <div key={props.productos[0].producto.supermercado} sx={{ padding: "5%" }}>
      <Grid>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Wrapper>
            <img sx={{}} src={imageRef} alt={props.supermercado} />
          </Wrapper>

          {props.productos.map((item) => (
            <ProductoEnLista
              key={item.producto.barcode + item.producto.supermercado}
              item={item}
              supermercado={props.supermercado}
              mejorarAlternativa={props.mejorarAlternativa}
              listaDeProductos={props.listaDeProductos}
              añadirProductoALaLista={props.añadirProductoALaLista}
              borrarProductoDeLaLista={props.borrarProductoDeLaLista}
            />
          ))}
        </Paper>
      </Grid>
    </div>
  );
}
