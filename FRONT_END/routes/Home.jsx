import { Grid, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import backgroundImage from '../static/images/home.jpeg'; 

export default function Home() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "white",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: 1,
        }}
      />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        sx={{
          zIndex: 2,
          color: "black",
          textAlign: "center",
          padding: 2,
        }}
      >
        <Typography variant="h3" gutterBottom>
          ¡Bienvenido a Comparator!
        </Typography>
        <Link to="/scanner" style={{ textDecoration: 'none', margin: 8 }}>
          <Button variant="contained" sx={{ bgcolor: "rgb(97, 75, 154)" }} size="large">
            Scanner de productos
          </Button>
        </Link>
        <Link to="/productos" style={{ textDecoration: 'none', margin: 8 }}>
          <Button variant="contained" sx={{ bgcolor: "rgb(97, 75, 154)" }} size="large">
            Catálogo de productos
          </Button>
        </Link>
        <Link to="/lista" style={{ textDecoration: 'none', margin: 8 }}>
          <Button variant="contained" sx={{ bgcolor: "rgb(97, 75, 154)" }} size="large">
            Mejora tu Lista de Productos
          </Button>
        </Link>
        <Link to="/listasPersonales" style={{ textDecoration: 'none', margin: 8 }}>
          <Button variant="contained" sx={{ bgcolor: "rgb(97, 75, 154)" }} size="large">
            Tus listas
          </Button>
        </Link>
        <Link to="/estadisticas" style={{ textDecoration: 'none', margin: 8 }}>
          <Button variant="contained" sx={{ bgcolor: "rgb(97, 75, 154)" }} size="large">
            Ver estadísticas
          </Button>
        </Link>
      </Grid>
    </Box>
  );
}
