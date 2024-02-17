import {
  Box,
  Grid,
  Typography,
  styled,
  Button,
  TextField,
  FormControl,
} from "@mui/material";
import { loadState } from "../redux/localStorage";
import { useEffect, useState } from "react";
import MyComboBox from "../components/MyComboBox.jsx";
import { SUPERMERCADOS } from "../helper/settings";
import { compareProducts } from "../helper/comparator";
import SupermercadoEnLista from "../components/laLista/SupermercadoEnLista";
import { BreadcrumbsLaLista } from "../components/BreadCrumbs";
import { useAuth0 } from "@auth0/auth0-react";

export const StyledButton = styled(Button)`
  background: #9681f2;
  color: black;
  :hover {
    background: #81c9f2;
  }
`;

export default function LaLista() {
  let state = loadState();

  const { user, isAuthenticated, isLoading } = useAuth0();

  const [supermercado, setSupermercado] = useState("");
  const [marca, setMarca] = useState("");
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

  const [isListSaved, setListSaved] = (false);
  const [isErrorWhenSave, setErrorWhenSave] = (false);

  useEffect(() => {
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
    console.log("Q PASA")
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
    setListaDeProductos(nuevaLista);
    computeTotalPrice();
  };

  const savePersonalList = () => {
    if (isAuthenticated) {
      //ABRIR DIALOGO PARA ESCRIBIR EL NOMBRE DE LA LISTA
      if (savePersonalList(listName, user.email, listaDeProductos)) {
        setListSaved(true);
      } else {
        setErrorWhenSave(true);
      }
    }
  }

  const handleInputChange = (event) => setMarca(event.target.value);

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
      <BreadcrumbsLaLista/>

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
        <Typography variant="subtitle1" paragraph>
          Utiliza estos parámetros para filtrar las mejoras de alternativa:
        </Typography>
      <MyComboBox
          supermercado={supermercado}
          setSupermercado={setSupermercado}
          supermercados={SUPERMERCADOS}
          helperText={"Selecciona un supermercado si quieres filtrar LaLista"}
        />
      <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
        
        <TextField
          id="marca"
          name="marca"
          label="Marca del producto"
          fullWidth
          autoComplete="marca"
          variant="standard"
          onChange={handleInputChange}
          value={marca}
          />
        </FormControl>
      </div>
      <div>
        {
          isListSaved
            ? <Alert severity="success">La Lista ha sido guardada con éxito. </Alert>
            : isErrorWhenSave 
              ? <Alert severity="error">Ha ocurrido un error, no se ha podido guardar la Lista...</Alert>
              : <StyledButton onClick={savePersonalList}> Guardar Lista personal</StyledButton>
        }
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
          marca={marca}
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
