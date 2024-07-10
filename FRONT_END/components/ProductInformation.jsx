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
import Chart from "./statistics/Chart";
import ProductInformationCard from "./ProductInformationCard";
import { compareProduct, findAlternative } from "../api/ApiService";
import { BreadcrumbsProduct } from "./BreadCrumbs";

export default function ProductInformation(props) {
  const [buttonPressed, setButtonPressed] = useState(false);
  const [alternativa, setAlternativa] = useState(undefined);
  const [alternativaDefined, setAlternativaDefined] = useState(false);
  const [productsCompared, setProductsCompared] = useState([]);

  const mdTheme = createTheme();

  const encontrarAlternativa = () => {
    findAlternative({
      producto: props.producto,
    }).then((result) => {
      console.log(result)
      if (result !== "No product found") {
        var productoMejorado = result.hits[0];
        if (productoMejorado != undefined) {
          setAlternativa(productoMejorado);
          setAlternativaDefined(true);
        }
      }
    });
  };

  const executeCompareProducts = () => {
    compareProduct({
      producto: props.producto,
    }).then((result) => {

      var hits = result.hits;
      var filteredHits = hits.filter(hit => hit.barcode != props.producto.barcode);
      setProductsCompared(filteredHits);
    });
    console.log(productsCompared);
  };

  useEffect(() => {
    encontrarAlternativa();
    executeCompareProducts();
  }, [props.producto]);

  useEffect(() => {
    console.log("Products compared state updated: ", productsCompared);
  }, [productsCompared]);

  return buttonPressed == false ? (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CssBaseline />
        <BreadcrumbsProduct producto={props.producto}></BreadcrumbsProduct>

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
          <Container maxWidth="sm">
            <Typography
              variant="h3"
              sx={{
                color: mdTheme.palette.text.primary,
                pt: 4,
                pb: 2,
                typography: { sm: 'h3', xs: 'h4' },
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                textAlign: "center",
              }}
            >
              Ver más: {props.producto.nombre}
            </Typography>

            <Grid container spacing={3}>
              <Grid alignItems="center" item>
                <ProductInformationCard
                  producto={props.producto}
                  supermercado={props.supermercado}
                  setButtonPressed={setButtonPressed}
                  priceUpdateButton={true}
                ></ProductInformationCard>
              </Grid>

              <Grid item xs={12}>
                <Chart
                  data={productToChartData(props.producto)}
                  title={"Evolución del precio de este producto"}
                  chartType="date"
                ></Chart>
              </Grid>

              <Grid item xs={12}>
                <div className="product-alternative">
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
                          typography: { sm: "h4", xs: "h4" },
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
                        % ={" "}
                        {(
                          props.producto.precioActual - alternativa.precioActual
                        ).toFixed(2)}{" "}
                        euros por cada unidad de este producto.
                      </Alert>
                      <ProductInformationCard
                        producto={alternativa}
                        supermercado={alternativa.supermercado}
                        setButtonPressed={setButtonPressed}
                        priceUpdateButton={false}
                      ></ProductInformationCard>
                    </>
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                {productsCompared.length > 0 ? (
                  <Grid container spacing={2} className="products-compared">
                    <Grid item xs={12}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "text.default",
                          pt: 4,
                          pb: 2,
                          typography: { sm: "h4", xs: "h4" },
                        }}
                      >
                        Otros productos similares:
                      </Typography>
                    </Grid>
                    {
                      productsCompared.map((product) => (
                        <Grid item xs={12} key={product.barcode}>
                          <Alert severity={product.precioActual < props.producto.precioActual ? "success" : "error"}>
                            {product.precioActual < props.producto.precioActual ? (
                              <span>
                                Ahorro de{" "}
                                {(
                                  Math.abs(
                                    (1 - product.precioActual / props.producto.precioActual) * 100
                                  ).toFixed(2)
                                )}
                                % ={" "}
                                {(
                                  Math.abs(props.producto.precioActual - product.precioActual).toFixed(2)
                                )}{" "}
                                euros por cada unidad de este producto.
                              </span>
                            ) : (
                              <span>
                                Pérdida de{" "}
                                {(
                                  Math.abs(
                                    (1 - product.precioActual / props.producto.precioActual) * 100
                                  ).toFixed(2)
                                )}
                                % ={" "}
                                {(
                                  Math.abs(props.producto.precioActual - product.precioActual).toFixed(2)
                                )}{" "}
                                euros por cada unidad de este producto.
                              </span>
                            )}
                          </Alert>

                          <ProductInformationCard
                            producto={product}
                            supermercado={product.supermercado}
                            priceUpdateButton={false}
                          />
                        </Grid>
                      ))}
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <Alert severity="error">No se han encontrado productos similares</Alert>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  ) : (
    <SubidaDePrecioForm
      producto={props.producto}
      setMejoraPerformed={setButtonPressed}
    ></SubidaDePrecioForm>
  );
}
