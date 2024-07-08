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
import { createData } from "../helper/parser";
import { LineChart } from '@mui/x-charts/LineChart';
import {
  getAvgPriceBySupermercado,
  getAvgPricePerMonthBySupermercado,
  getLastPriceChange,
} from "../api/ApiService";
import { BreadcrumbsDashBoard } from "../components/BreadCrumbs";
import { Title } from "react-native-paper";

const atunData = [
  createData("2023-01-01", 0),
  createData("2023-02-01", 300),
  createData("2023-03-01", 600),
  createData("2023-06-01", 800),
  createData("2023-08-01", 1500),
  createData("2023-08-02", 2000),
  createData("2023-08-20", 2400),
  createData("2023-08-30", 2400),
  createData("2023-12-01", undefined),
];

const mdTheme = createTheme();

export default function DashboardContent() {
  const [lastPriceChangeProduct, setLastPriceChangeProduct] = React.useState(undefined);
  const [boardData, setBoardData] = React.useState(undefined);
  const [chartData, setChartData] = React.useState(undefined);

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

      var porcentajesDeSubida = [];
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
          fila["Porcentaje de subida total"] = porcentaje.toFixed(2) + " %";
        });

        setBoardData(data);
        setChartData(convertBoardDataToChart(result));
      });
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
              }}
            >
              Estadísticas: ¿Qué supermercado se aprovecha más de la inflación?
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
                  <Title>Comparativa de supermercado (Gráfico):</Title>
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
                    height: 240,
                  }}
                >
                  <Chart data={atunData} title="Evolución del precio del atun claro en aceite de girasol (Mercadona)"
                    chartType="time" />
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
