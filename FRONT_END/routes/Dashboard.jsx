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
import Chart from "../components/estadisticas/Chart";
import AdviceBox from "../components/estadisticas/AdviceBox";
import Board from "../components/estadisticas/Board";
import { createData } from "../helper/parser";
import {
  getAvgPriceBySupermercado,
  getAvgPricePerMonthBySupermercado,
  getLastPriceChange,
} from "../api/ApiService";
import { BreadcrumbsDashBoard } from "../components/BreadCrumbs";

const data = [
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
  const [lastPriceChangeProduct, setLastPriceChangeProduct] =
    React.useState(undefined);
  const [boardData, setBoardData] = React.useState(undefined);

  React.useEffect(() => {
    getLastPriceChange().then((result) => {
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
        data.forEach((d) => {
          Object.entries(result[d["Supermercado"]]).forEach(
            ([month, average]) => {
              var porcentaje =
                ((average - d[Object.keys(d)[1]]) / d[Object.keys(d)[1]]) * 100;
              d[month] =
                porcentaje >= 0
                  ? average.toFixed(2) + " (+" + porcentaje.toFixed(2) + " %)"
                  : average.toFixed(2) + " (" + porcentaje.toFixed(2) + " %)";
            }
          );
        });

        data.forEach((d) => {
          var subida = d[Object.keys(d)[Object.keys(d).length - 1]];
          d["Porcentaje de subida total"] = subida.substring(subida.length - 9, subida.length - 1);
        });
        setBoardData(data);

        console.log(data);
      });
    });
  }, []);

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
          {/*<Toolbar />*/}
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
                  {/*<Orders />*/}
                  {boardData != undefined && (
                    <Board
                      title="Comparativa de supermercados"
                      data={boardData}
                    ></Board>
                  )}
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Chart data={data} title="Evolución del precio del atun claro en aceite de girasol (Mercadona)"
                    chartType="time" />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
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
              {/* Recent Orders */}
              
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
