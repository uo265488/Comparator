import {
  Box,
  Grid,
  Typography,
  styled,
  Button,
  Breadcrumbs,
} from "@mui/material";
import ProductoEnLista from "../components/laLista/ProductoEnLista";
import { Link } from "react-router-dom";
import { loadState } from "../redux/localStorage";
import { useEffect, useState } from "react";
import MyComboBox from "../components/MyComboBox.jsx";
import { SUPERMERCADOS } from "../helper/settings";
import { Title } from "react-native-paper";
import SupermercadoEnLista from "../components/laLista/SupermercadoEnLista";
import { compareProducts } from "../helper/comparator";

export const StyledButton = styled(Button)`
  background: #9681f2;
  color: black;
  :hover {
    background: #81c9f2;
  }
`;

function BreadcrumbsLaLista() {
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

export default function LaLista() {
  let state = loadState();

  const [supermercado, setSupermercado] = useState("");
  const [listaDeProductos, setListaDeProductos] = useState(
    state.laListaReducer.lista
  );
  const [precioTotal, setPrecioTotal] = useState(
    state.laListaReducer.lista.length === 0
      ? 0.0
      : state.laListaReducer.lista
          .map((item) => item.producto.precioActual * item.unidades)
          .reduce((a, b) => a + b)
          .toFixed(2)
  );

  const [activateUseEffect, setActivateUseEffect] = useState(true);

  useEffect(() => {
    //setPrecioTotal(state.laListaReducer.lista.length === 0 ? 0.00 : state.laListaReducer.lista.map((item) =>
    //  (item.producto.precioActual * item.unidades)).reduce((a, b) => a + b).toFixed(2));
    //setListaDeProductos(state.laListaReducer.lista);
    console.log("useEffect hook disparado");

    setPrecioTotal(
      state.laListaReducer.lista.length === 0
        ? 0.0
        : state.laListaReducer.lista
            .map((item) => item.producto.precioActual * item.unidades)
            .reduce((a, b) => a + b)
            .toFixed(2)
    );
    setListaDeProductos(listaDeProductos);
  }, [activateUseEffect]);

  const computeTotalPrice = () => {
    setActivateUseEffect(!activateUseEffect);
  };

  const añadirProductoALaLista = (productoAñadido) => {
    var isProductInLaLista = -1;
    var counter = 0;
    listaDeProductos.forEach((item) => {
      if (compareProducts(productoAñadido.producto, item.producto))
        isProductInLaLista = counter;
      counter++;
    });
    if (isProductInLaLista >= 0) {
      if (listaDeProductos[isProductInLaLista].unidades < 100) {
        listaDeProductos[isProductInLaLista].unidades++;
      }
    } else {
      listaDeProductos.push(action.payload);
    }
    computeTotalPrice();
  };

  const borrarProductoDeLaLista = (productoBorrado) => {
    const isProductInLaLista = listaDeProductos
      .map((item) => {
        return item.producto.barcode;
      })
      .indexOf(productoBorrado.producto.barcode);
    if (isProductInLaLista >= 0) {
      listaDeProductos[isProductInLaLista].unidades--;
      if (listaDeProductos[isProductInLaLista].unidades === 0) {
        listaDeProductos.splice(isProductInLaLista, 1);
      }
    }
    computeTotalPrice();
  };

  const mejorarAlternativa = (productoAMejorar, alternativa) => {
    var isProductInLaLista = -1;
    var isAlternativaInLaLista = -1;
    var counter = 0;
    var porcentajeDeMejora =
      (productoAMejorar.precioActual - alternativa.precioActual) /
      productoAMejorar.precioActual;
    var nuevaLista = listaDeProductos.slice();
    var nuevoProducto;

    nuevaLista.forEach((item) => {
      if (compareProducts(alternativa, item.producto))
        isAlternativaInLaLista = counter;
      if (compareProducts(productoAMejorar, item.producto))
        isProductInLaLista = counter;
      counter++;
    });

    if (isProductInLaLista >= 0 && isAlternativaInLaLista == -1) {
      nuevoProducto = {
        producto: alternativa,
        unidades: nuevaLista[isProductInLaLista].unidades,
        mejora: porcentajeDeMejora,
      };
      nuevaLista[isProductInLaLista] = nuevoProducto;
    } else if (isProductInLaLista >= 0 && isAlternativaInLaLista > -1) {
      if (isProductInLaLista != isAlternativaInLaLista) {
        nuevoProducto = {
          producto: alternativa,
          unidades:
            //nuevaLista[isProductInLaLista].unidades +
            nuevaLista[isAlternativaInLaLista].unidades,
          mejora: porcentajeDeMejora,
        };
        nuevaLista[isAlternativaInLaLista] = nuevoProducto;
        nuevaLista.splice(isProductInLaLista, 1);
      }
    }
    debugger;
    setListaDeProductos(nuevaLista);
    computeTotalPrice();
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

      <Typography
        variant="h3"
        sx={{
          color: "text.default",
          pt: 4,
          pb: 2,
          typography: { sm: "h3", xs: "h4" },
        }}
      >
        Tu lista de la compra:
      </Typography>
      <div>
        <MyComboBox
          supermercado={supermercado}
          setSupermercado={setSupermercado}
          supermercados={SUPERMERCADOS}
        />
      </div>

      {state.laListaReducer.lista.length === 0 && (
        <Typography
          sx={{ color: "text.default", typography: { sm: "h4", xs: "h5" } }}
        >
          No hay productos en la Lista.
        </Typography>
      )}

      {SUPERMERCADOS.map((s) => (
        <SupermercadoEnLista
          productos={listaDeProductos.filter(
            (i) => i.producto.supermercado == s
          )}
          supermercado={supermercado}
          mejorarAlternativa={mejorarAlternativa}
          listaDeProductos={listaDeProductos}
          añadirProductoALaLista={añadirProductoALaLista}
          borrarProductoDeLaLista={borrarProductoDeLaLista}
          key={s + "EnLista"}
        ></SupermercadoEnLista>
      ))}

      <Grid>
        <h2 className="total-text">Total: {precioTotal} €</h2>
      </Grid>
    </Box>
  );
}
