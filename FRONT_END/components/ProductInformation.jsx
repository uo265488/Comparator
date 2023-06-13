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
import SubidaDePrecioForm from "./scanner/SubidaDePrecioForm";
import { productToChartData } from "../helper/parser";
import Chart from "./estadisticas/Chart";
import ProductInformationCard from "./ProductInformationCard";
import { findAlternative } from "../api/ApiService";
import { compareProducts } from "../helper/comparator";

export default function ProductInformation(props) {
  const [buttonPressed, setButtonPressed] = useState(0);
  const [alternativa, setAlternativa] = useState(undefined);
  const [alternativaDefined, setAlternativaDefined] = useState(false);

  const mdTheme = createTheme();

  const encontrarAlternativa = () => {
    findAlternative({
      producto: props.producto,
    }).then((data) => {
      var productoMejorado = data.hits[0];

      if (productoMejorado != undefined) {
        setAlternativa(productoMejorado);
        console.log(alternativa);
        setAlternativaDefined(true);
      }
    });
  };

  useEffect(() => {
    if (!alternativaDefined) encontrarAlternativa();
  }, []);



  return buttonPressed == 0 ? (
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
              Ver más: {props.producto.nombre}
            </Typography>

            <Grid container spacing={3}>
              <Grid item>
                <ProductInformationCard
                  producto={props.producto}
                  supermercado={props.supermercado}
                  setButtonPressed={setButtonPressed}
                ></ProductInformationCard>
              </Grid>

              <Grid item>
                <Chart
                  data={productToChartData(props.producto)}
                  title={"Evolución del precio de este producto"}
                  chartType="date"
                ></Chart>
              </Grid>
              <Grid item>
                {!alternativaDefined ? (
                  <Alert severity="error">
                    No hemos encontrado una alternativa más económica para este
                    producto.{alternativa}
                  </Alert>
                ) : alternativa.barcode === props.producto.barcode &&
                  alternativa.supermercado === props.producto.supermercado ? (
                  <Alert severity="error">
                    No hemos encontrado una alternativa más económica para este
                    producto.
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
                      Esta alternativa supone un ahorro del{" "}
                      {(
                        (1 - alternativa.precioActual /
                          props.producto.precioActual) *
                        100
                      ).toFixed(2)}
                      % =
                      {(
                        props.producto.precioActual - alternativa.precioActual
                      ).toFixed(2)}{" "}
                      euros por cada unidad de este producto.
                    </Alert>
                    <ProductInformationCard
                      producto={alternativa}
                      supermercado={alternativa.supermercado}
                      setButtonPressed={setButtonPressed}
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
    <SubidaDePrecioForm product={props.product}></SubidaDePrecioForm>
  );
}
