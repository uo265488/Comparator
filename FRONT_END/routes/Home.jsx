
import { Grid } from "@mui/material";
import { Button, Text } from "react-native-paper";
import { Link } from "react-router-dom";

export default function Home() {

  
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      direction="column"
      sx={{
        bgcolor: "background.default",
        height: "93vh",
      }}
    >
      <Text> Bienvenido a mi aplicación!!</Text>
      <Link to="/scanner" underline="none">
        <Button mode="contained">Scannear producto</Button>
      </Link>
      <Link to="/productos" underline="none">
        <Button mode="contained">Hacer una lista de la compra</Button>
      </Link>
      <Link to="/laLista" underline="none">
        <Button mode="contained">Crea LaLista</Button>
      </Link>
      <Link to="/estadisticas" underline="none">
        <Button mode="contained">Ver estadísticas</Button>
      </Link>
      <Link to="/tusListas" underline="none">
        <Button mode="contained">Tus listas</Button>
      </Link>
    </Grid>
  );
}
