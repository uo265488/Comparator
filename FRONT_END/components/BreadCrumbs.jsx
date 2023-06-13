import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function BreadcrumbsDashBoard() {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" to="/">
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Home
        </Typography>
      </Link>
      <Typography variant="h6" sx={{ color: "text.secondary" }}>
        Estadisticas
      </Typography>
    </Breadcrumbs>
  );
}

export function BreadcrumbsProduct(props) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" href="/">
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Home
        </Typography>
      </Link>
      <Link underline="hover" href="/shop">
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Catalogue
        </Typography>
      </Link>
      <Typography variant="h6" sx={{ color: "text.secondary" }}>
        {props.producto.barcode}
      </Typography>
    </Breadcrumbs>
  );
}

export function BreadcrumbsLaLista() {
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" to="/">
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Home
          </Typography>
        </Link>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          LaLista
        </Typography>
      </Breadcrumbs>
    );
  }
