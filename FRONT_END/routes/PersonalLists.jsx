import {
  Box,
  Grid,
  Typography,
  styled,
  Button,
  TextField,
  FormControl,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { loadState } from "../redux/localStorage";
import { useEffect, useState } from "react";
import MyComboBox from "../components/MyComboBox.jsx";
import { SUPERMERCADOS } from "../helper/settings";
import SupermercadoEnLista from "../components/laLista/SupermercadoEnLista";
import { BreadcrumbsLaLista } from "../components/BreadCrumbs";
import { useAuth0 } from "@auth0/auth0-react";
import { getPersonalListByEmail } from "../api/ApiService.js";
import ProductoEnListaPersonal from "../components/laLista/ProductoEnListaPersonal.jsx";
import { DefaultTheme } from "react-native-paper";

export const StyledButton = styled(Button)`
  background: #9681f2;
  color: black;
  :hover {
    background: #81c9f2;
  }
`;

export default function PersonalLists() {
  const { user, isAuthenticated } = useAuth0();

  const [productList, setProductList] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [nombreLista, setNombreLista] = useState("");

  var keyCount = 0;

  useEffect(
    () => {
      if (user != undefined)
        getPersonalListByEmail(user.email).then((res) => {
          setNombreLista(res.name)
          setPrecioTotal(res.precioTotal);
          setProductList(res.products);
        });
    },
    [user]
  );

  useEffect(() => {
    setProductList(productList);
  }, [productList]);

  const computeTotalPrice = () => {
    setActivateUseEffect(!productList);
  };

  const defaultTheme = createTheme();

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
      <ThemeProvider theme={defaultTheme}>
        <Typography
          variant="h3"
          sx={{
            color: "text.default",
            pt: 4,
            pb: 2,
            typography: { sm: "h3", xs: "h4" },
            width: "100%",
          }}
        >
          Tu lista de la compra:
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: "text.default",
            pt: 4,
            pb: 2,
            typography: { sm: "h4", xs: "h4" },
            width: "100%",
          }}
        >
          Nombre: {nombreLista}
        </Typography>

        <Grid container spacing={4} direction="column" wrap='nowrap'>
          {productList.length > 0 &&
            productList.map((p) => (
              <ProductoEnListaPersonal
                item xs={12}
                sm={6}
                key={keyCount++}
                product={p}
              ></ProductoEnListaPersonal>
            ))}
        </Grid>

        <Grid>
          <h2 className="total-text">Total: {precioTotal} €</h2>
        </Grid>
      </ThemeProvider>
    </Box>
  );
}
