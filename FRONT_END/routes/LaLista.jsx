import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import { loadState } from "../redux/localStorage";
import { useEffect, useState } from "react";
import MyComboBox from "../components/MyComboBox.jsx";
import { SUPERMERCADOS } from "../helper/settings";
import { compareProducts } from "../helper/comparator";
import SupermercadoEnLista from "../components/laLista/SupermercadoEnLista";
import { BreadcrumbsLaLista } from "../components/BreadCrumbs";
import { useAuth0 } from "@auth0/auth0-react";
import { savePersonalList } from "../api/ApiService.js";
import { StyledFilledButton } from "../helper/styles.jsx";
import { Label } from "recharts";

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

  const [isShowPersonalListNameDialog, setShowPersonalListNameDialog] =
    useState(false);
  const [isListSaved, setListSaved] = useState(false);
  const [isErrorWhenSave, setErrorWhenSave] = useState(false);
  const [listName, setListName] = useState("");

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

  const savePersonalListWithName = (listName) => {
    if (isAuthenticated) {
      savePersonalList(listName, user.email, listaDeProductos)
        .then(() => setListSaved(true))
        .catch(() => setErrorWhenSave(true))
        .finally(() => setShowPersonalListNameDialog(false));
    }
  };

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
        <Typography variant="subtitle1" paragraph>
          Utiliza estos parámetros para filtrar las mejoras de alternativa:
        </Typography>
        <MyComboBox
          supermercado={supermercado}
          setSupermercado={setSupermercado}
          supermercados={SUPERMERCADOS}
          helperText={"Selecciona un supermercado si quieres filtrar LaLista"}
        />
        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
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

        <StyledFilledButton onClick={() => setShowPersonalListNameDialog(true)}>
          {" "}
          Guardar Lista personal
        </StyledFilledButton>

        <Dialog open={isShowPersonalListNameDialog}>
          <DialogTitle>Guardar LaLista</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Introduce un nombre para tu lista:
            </DialogContentText>
            <TextField
              type="text"
              id="listName"
              placeholder="Nombre de la lista"
              value={listName}
              onChange={(event) => setListName(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <StyledFilledButton
              onClick={() => savePersonalListWithName(listName)}
            >
              Guardar LaLista Personal
            </StyledFilledButton>
            <StyledFilledButton
              onClick={() => setShowPersonalListNameDialog(false)}
            >
              Cancel
            </StyledFilledButton>
          </DialogActions>
        </Dialog>
        <div>
          {isListSaved && (
            <Alert severity="success">
              La Lista ha sido guardada con éxito!{" "}
            </Alert>
          )}
          {isErrorWhenSave && (
            <Alert severity="error">
              Ha ocurrido un error, no se ha podido guardar la Lista...
            </Alert>
          )}
        </div>
      </Grid>
    </Box>
  );
}
