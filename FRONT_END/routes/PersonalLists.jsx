import {
  Box,
  Grid,
  Typography,
  styled,
  Button,
  TextField,
  FormControl,
} from "@mui/material";
import { loadState } from "../redux/localStorage";
import { useEffect, useState } from "react";
import MyComboBox from "../components/MyComboBox.jsx";
import { SUPERMERCADOS } from "../helper/settings";
import SupermercadoEnLista from "../components/laLista/SupermercadoEnLista";
import { BreadcrumbsLaLista } from "../components/BreadCrumbs";
import { useAuth0 } from "@auth0/auth0-react";

export const StyledButton = styled(Button)`
  background: #9681f2;
  color: black;
  :hover {
    background: #81c9f2;
  }
`;

export default function PersonalLists() {
  const { user, isAuthenticated } = useAuth0();

  const [productList, setProductsList] = useState([]);

  useEffect(
    () => {
      getPersonalListByEmail();
    },
    // eslint-disable-next-line
    []
  );
  const getPersonalListByEmail = async () => {
    if (isAuthenticated) {
      const productsResult = await getPersonalListByEmail(user);
      setProductsList(productsResult.hits);
    }
  };

  useEffect(() => {
    setPrecioTotal(
      state.laListaReducer.lista.length === 0
        ? 0.0
        : state.laListaReducer.lista
            .map((item) => item.producto.precioActual * item.unidades)
            .reduce((a, b) => a + b)
            .toFixed(2)
    );
    setListaDeProductos(listaDeProductos);
  }, [activateUseEffect]);

  const computeTotalPrice = () => {
    setActivateUseEffect(!activateUseEffect);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        padding: 2,
        height: "100%",
        pb: 70,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BreadcrumbsLaLista />

      <Typography
        variant="h3"
        sx={{
          color: "text.default",
          pt: 4,
          pb: 2,
          typography: { sm: "h3", xs: "h4" },
        }}
      >
        Tu lista de la compra:
      </Typography>
      <div>
        <Typography variant="subtitle1" paragraph>
          Utiliza estos parámetros para filtrar las mejoras de alternativa:
        </Typography>
      </div>

      {SUPERMERCADOS.map((s) => (
        <SupermercadoEnLista
          productos={listaDeProductos.filter(
            (i) => i.producto.supermercado == s
          )}
          supermercado={supermercado}
          marca={marca}
          mejorarAlternativa={mejorarAlternativa}
          listaDeProductos={listaDeProductos}
          añadirProductoALaLista={añadirProductoALaLista}
          borrarProductoDeLaLista={borrarProductoDeLaLista}
          key={s + "EnLista"}
        ></SupermercadoEnLista>
      ))}

      <Grid>
        <h2 className="total-text">Total: {precioTotal} €</h2>
      </Grid>
    </Box>
  );
}
