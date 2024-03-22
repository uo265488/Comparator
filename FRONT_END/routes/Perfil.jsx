import { Box, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { SUPERMERCADOS } from "../helper/settings";
import SupermercadoEnLista from "../components/laLista/SupermercadoEnLista";
import { BreadcrumbsLaLista } from "../components/BreadCrumbs";
import { useAuth0 } from "@auth0/auth0-react";
import { getListaPersonal, getPersonalListByEmail } from "../api/ApiService";
import { Wrapper } from "../helper/styles";
import image from "../static/images/Mercadona.png";

export default function Perfil() {
  const { isAuthenticated, user, isLoading } = useAuth0();

  const [listaDeProductos, setListaDeProductos] = useState([]);

  useEffect(
    () => {
      dispatchListaPersonal();
    },
    // eslint-disable-next-line
    []
  );

  const dispatchListaPersonal = async () => {
    if (isAuthenticated) {
      const productsResult = await getPersonalListByEmail(user.email);
      setListaDeProductos(productsResult.hits);
    }
  };

  const getLogoSupermercado = (supermercado) => {
    const imageItself = require("../static/images/Mercadona.png");
    return imageItself;
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

      {isAuthenticated && (
        <>
          <Typography
            variant="h3"
            sx={{
              color: "text.default",
              pt: 4,
              pb: 2,
              typography: { sm: "h3", xs: "h4" },
            }}
          >
            {user.name}
          </Typography>
          <Typography variant="subtitle1" paragraph>
            {user.email}
          </Typography>
        </>
      )}

      {isAuthenticated &&
        listaDeProductos.length > 0 &&
        SUPERMERCADOS.map((s) => (
          <>
            <div
              key={listaDeProductos[0].producto.supermercado}
              sx={{ padding: "5%" }}
            >
              <Grid>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Wrapper>
                    <img sx={{}} src={image} alt={s} />
                  </Wrapper>

                  {listaDeProductos.map((item) => (
                    <ProductoEnListaPersonal
                      key={item.producto.barcode + item.producto.supermercado}
                      item={item}
                    />
                  ))}
                </Paper>
              </Grid>
            </div>
          </>
        ))}

      {isAuthenticated && listaDeProductos.length > 0 && (
        <Grid>
          <h2 className="total-text">Total: {precioTotal} €</h2>
        </Grid>
      )}
    </Box>
  );
}
