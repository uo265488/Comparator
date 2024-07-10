import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Chart from "../components/statistics/Chart";
import AdviceBox from "../components/statistics/AdviceBox";
import Board from "../components/statistics/Board";
import { createDataFromProduct } from "../helper/parser";
import { LineChart } from '@mui/x-charts/LineChart';
import {
  getAvgPriceBySupermercado,
  getAvgPricePerMonthBySupermercado,
  getLastPriceChange,
  getMostFrequentlyUpdated,
} from "../api/ApiService";
import { BreadcrumbsDashBoard } from "../components/BreadCrumbs";
import Title from "../components/statistics/Title";
import { Wrapper } from "../helper/styles";

const mdTheme = createTheme();

export default function DashboardContent() {
  const [lastPriceChangeProduct, setLastPriceChangeProduct] = React.useState(undefined);
  const [boardData, setBoardData] = React.useState(undefined);
  const [chartData, setChartData] = React.useState(undefined);
  const [productsChartData, setProductsChartData] = React.useState(undefined);

  React.useEffect(() => {
    getLastPriceChange().then((result) => {
      console.log("Last price change:");
      console.log(result.hits[0]);
      setLastPriceChangeProduct(result.hits[0]);
    });

    var data = [];
    var counter = 0;
    getAvgPriceBySupermercado().then((result) => {
      result.terms_supermercado._value.buckets._value.forEach((v) => {
        data[counter] = {
          Supermercado: v.key._value,
          "Precio medio por producto":
            v.aggregations.avg_price._value.value.toFixed(2),
        };
        counter = counter + 1;
      });

      getAvgPricePerMonthBySupermercado().then((result) => {
        var initialPrice = 0;
        data.forEach((fila) => {
          var porcentaje = 0;
          Object.entries(result[fila["Supermercado"]]).forEach(
            ([month, average]) => {
              initialPrice = result[fila["Supermercado"]][Object.keys(result[fila["Supermercado"]])[0]];
              porcentaje = ((average - initialPrice) / initialPrice) * 100;
              fila[month] =
                porcentaje >= 0
                  ? average.toFixed(2) + " (+" + porcentaje.toFixed(2) + " %)"
                  : average.toFixed(2) + " (" + porcentaje.toFixed(2) + " %)";
            }
          );
          fila["Porcentaje de subida total"] = "+" + porcentaje.toFixed(2) + " %";
        });

        setBoardData(data);
        setChartData(convertBoardDataToChart(result));
      });
    });

    getMostFrequentlyUpdated().then((result) => {
      console.log(result.hits);
      setProductsChartData(result.hits);
    });

  }, []);

  const convertBoardDataToChart = (data) => {
    var result = { series: [], xLabels: [] };
    var xLabels = Object.keys(data[Object.keys(data)[0]]);

    var lines = Object.keys(data);

    var i = 0;
    lines.forEach(supermercado => {
      result.series.push({ data: Object.values(data[supermercado]), label: lines[i] });
      i = i + 1;
    });

    result.xLabels = xLabels;

    return result;
  }

  const getProductChartData = (product) => {

    return createDataFromProduct(product);
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CssBaseline />
        <BreadcrumbsDashBoard></BreadcrumbsDashBoard>

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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                color: "text.default",
                pt: 4,
                pb: 2,
                typography: { sm: "h3", xs: "h4" },
                textAlign: "center",
              }}
            >
              Estadísticas: precios injustificados y fraude ecónomico
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {boardData != undefined && (
                    <Board
                      title="Comparativa de supermercados"
                      data={boardData}
                    ></Board>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Title>Comparativa de supermercados (Gráfico):</Title>
                  {boardData != undefined && chartData != undefined && (
                    <LineChart
                      height={300}
                      series={chartData.series}
                      xAxis={[{ scaleType: 'point', data: chartData.xLabels }]}
                    />
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 240,
                    height: "auto",
                    overflow: "auto",
                  }}
                >
                  <Title> Productos que reciben más subidas de precio:</Title>
                  {productsChartData !== undefined && (
                    productsChartData.map((product, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: 16,
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          borderRadius: 8,
                        }}
                      >   
                        <Chart
                          data={getProductChartData(product)}
                          title={'Evolución del precio de ' + product.nombre}
                          chartType="date"
                          supermercado={product.supermercado}
                        />
                      </div>
                    ))
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  {lastPriceChangeProduct != undefined ? (
                    <AdviceBox
                      title="Cambios de precio recientes"
                      producto={lastPriceChangeProduct}
                    ></AdviceBox>
                  ) : (
                    <></>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
