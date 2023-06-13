import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Grid,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import SubidaDePrecioForm from "./SubidaDePrecioForm";
import { findAlternative } from "../../api/ApiService";
import ProductInformationCard from "../ProductInformationCard";
import Chart from "../estadisticas/Chart";
import { productToChartData } from "../../helper/parser";

export default function BarcodeInformation(props) {
  const [productToUpdate, setProductToUpdate] = useState(undefined);
  const [mejoraPerformed, setMejoraPerformed] = useState();
  const [alternativa, setAlternativa] = useState(undefined);
  const [alternativaDefined, setAlternativaDefined] = useState(false);

  const mdTheme = createTheme();

  const encontrarAlternativa = () => {
    findAlternative({
      producto: props.productos[0],
    }).then((data) => {
      var productoMejorado = data.hits[0];

      if (productoMejorado != undefined) {
        setAlternativa(productoMejorado);
        setAlternativaDefined(true);
      }
    });
  };

  const displaySubidaDePrecio = (producto) => {
    setProductToUpdate(producto);
  };

  useEffect(() => {
    if (!alternativaDefined) encontrarAlternativa();
  }, []);

  return productToUpdate == undefined ? (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CssBaseline />

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {mejoraPerformed && (
            <Alert severity="success">
              El cambio de precio se ha registrado en nuestra base de datos
              correctamente, !Muchas gracias!{" "}
            </Alert>
          )}
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              sx={{
                color: "text.default",
                pt: 4,
                pb: 2,
                typography: { sm: "h3", xs: "h4" },
              }}
            >
              Ver más: {props.productos[0].nombre}
            </Typography>

            <Grid key="grid0" container spacing={3}>
              {props.productos.map((p) => {
                return (
                  <Grid key={"grid_overall" + p.barcode + p.supermercado}>
                    <Grid key={"grid1" + p.barcode + p.supermercado} item>
                      <ProductInformationCard
                        producto={p}
                        supermercado={p.supermercado}
                        displaySubidaDePrecio={displaySubidaDePrecio}
                        key={p.barcode + p.supermercado}
                      ></ProductInformationCard>
                    </Grid>

                    <Grid key={"grid2" + p.barcode + p.supermercado} item>
                      <Chart
                        data={productToChartData(p)}
                        title={"Evolución del precio de este producto"}
                        chartType="date"
                        key={"chart" + (p.barcode + p.supermercado)}
                      ></Chart>
                    </Grid>
                  </Grid>
                );
              })}
              <Grid key={"grid3"} item>
                {!alternativaDefined ? (
                  <Alert severity="error">
                    No hemos encontrado una alternativa más económica para este
                    producto.{alternativa}
                  </Alert>
                ) : (
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
                      Alternativa más económica:
                    </Typography>
                    <Alert severity="success">
                      Esta alternativa es la más económica contando con las
                      mismas características que la alternativa scaneada.
                    </Alert>
                    <ProductInformationCard
                      producto={alternativa}
                      supermercado={alternativa.supermercado}
                    ></ProductInformationCard>
                  </>
                )}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  ) : (
    <SubidaDePrecioForm
      producto={productToUpdate}
      setMejoraPerformed={setMejoraPerformed}
      setProductToUpdate={setProductToUpdate}
    ></SubidaDePrecioForm>
  );
}
