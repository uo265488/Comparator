import { Box, Grid, Typography, styled, Button, Breadcrumbs} from "@mui/material";
import ProductoEnLista from "../components/laLista/ProductoEnLista";
import { Link } from "react-router-dom";
import { loadState } from "../redux/localStorage";
import { useEffect, useState } from "react";
import  MyComboBox  from "../components/MyComboBox.jsx";

export const StyledButton = styled(Button)`
background: #9681f2;
color: black;
:hover {
    background: #81c9f2;
}
`;

function BreadcrumbsLaLista() {
    return(
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" to="/" >
          <Typography
          variant='h6'
          sx={{color: 'text.secondary'}}>
              Home
          </Typography>
        </Link>
        <Typography variant='h6'
          sx={{color: 'text.secondary'}}>
              LaLista
          </Typography>
      </Breadcrumbs>
    );
}
  
export default function LaLista() {
  
  let state = loadState();

  const [supermercado, setSupermercado] = useState('');
  const [precioTotal, setPrecioTotal] = useState(state.laListaReducer.lista.length === 0 ? 0.00 : state.laListaReducer.lista.map((item) =>
  (item.producto.precioActual * item.unidades)).reduce((a, b) => a + b).toFixed(2));

  useEffect(() => {
    setPrecioTotal(state.laListaReducer.lista.length === 0 ? 0.00 : state.laListaReducer.lista.map((item) =>
    (item.producto.precioActual * item.unidades)).reduce((a, b) => a + b).toFixed(2));

  }, [state.laListaReducer.lista]);

  const computeTotalPrice = (change) => {
    setPrecioTotal(parseFloat(parseFloat(precioTotal) + parseFloat(change)).toFixed(2));
  }
          
  return (
        <Box sx={{
            bgcolor: 'background.default', padding: 2, height: '100%', pb: 70, display: 'flex',
            flexDirection: 'column'}}>
        
        <BreadcrumbsLaLista/>

        <Typography
          variant='h3'
          sx={{color: 'text.default', pt: 4, pb:2, typography: { sm: 'h3', xs: 'h4' }}}
        >
          Tu lista de la compra:
      </Typography>
      <div>
        <MyComboBox supermercado={supermercado} setSupermercado={setSupermercado}
          supermercados={["Alimerka", "Mercadona", "Carrefour"]} />
      </div>
      

        {state.laListaReducer.lista.length === 0 &&      
        <Typography
          sx={{color: 'text.default', typography: { sm: 'h4', xs: 'h5' }}}
        >
          No hay productos en la Lista.
        </Typography>}
        {state.laListaReducer.lista.map((item) => (
          <ProductoEnLista
            key={item.producto.barcode + item.producto.supermercado}
            item={item}
            supermercado={supermercado}
            computeTotalPrice={computeTotalPrice}
          />
        ))}
        <Grid>
        <h2 className="total-text">Total:  {precioTotal} €</h2>
        </Grid>
        
      </Box>

      
      
      
    );
};
  