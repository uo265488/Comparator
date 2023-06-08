import React from "react";
import { useEffect } from "react";
import { useDispatch} from "react-redux";
import { getAllProducts, getProductsFiltered } from "../api/ApiService";
import { useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { Searchbar } from "react-native-paper";
import ProductInformation from "../components/ProductInformation";

export default function Catalogo() {
    
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  
  /*const [verMasProducto, setVerMasProducto] = useState({
    "barcode": "8430807000538",
    "nombre": "Atún claro en aceite de girasol",
    "marca": "Alimerka",
    "proveedor": "ALIMERKA, S.L.",
    "supermercado": "Mercadona",
    "fechas_de_registro": [
      "2023-05-03",
      "2023-03-03",
      "2023-01-03",
      "2022-11-03",
    ],
    "precios": [
      0.5,
      2.0,
      3.0,
      6.0
    ],
    "precioActual": 4.0
  });*/

  const [verMasProducto, setVerMasProducto] = useState();
  
  useEffect(() => {
    refreshProductList();
  },
   // eslint-disable-next-line
  []);

  const refreshProductList = async () => {
    const productsResult = await getAllProducts();
    setProducts(productsResult.hits); 
    //dispatch(loadProducts(productsResult));
  }

  /**
   * Actualiza la lista de productos
   * @param input 
   */
  const updateProductList = async () => {
    const filteredProducts = await getProductsFiltered(searchText);
    //dispatch(loadProducts(filteredProducts));
    setProducts(filteredProducts.hits);
    //input.value = '';
  }

  /**
   * Filters the products by name
   * @param event 
   */
  const searchForProducts = () => {
    //event.preventDefault();
    //const form = event.target;
    //const input = form.querySelector(searchText);
    //if (input.value.trim() !== "")
    if (searchText.trim() !== "")
      updateProductList();
  };

  const handleChange = async (event) => {
    var type = event.target.value;
    var filteredProducts;
    if (!type) {
      filteredProducts = await getAllProducts();
    }
    else {
      filteredProducts = await filterProducts(type);
    }
    dispatch(loadProducts(filteredProducts));
    setValue(type);
  };

  const [value, setValue] = useState('');

  const onChangeSearch = query => {
    setSearchText(query);
  }

  //let products = useSelector((state) => state.products);

  return (
    <Grid container
      className="App"
      sx={{
        bgcolor: 'background.default',
        width: '100%', height: '100%', display: 'grid',
        pb: { xs: 20, xl: 50 }, pl: { xs: 4, sm: 8, md: 15 }, pr: { xs: 4, sm: 10, md: 15 }
      }}
    >

      { verMasProducto == undefined ?
      (<><Grid item sx={{ pt: 4, pl: { xs: 0, sm: 15 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ color: "text.primary" }}
        >
          Bienvenido a Comparator
        </Typography>
      </Grid>



      <Grid container
        className="search-container"
        alignItems="stretch"
        sx={{ pt: 0 }}
         >
        <Grid item xs={8} sm={4}>

        </Grid>
        <Grid  item xs={5} sm={8}>
          <form className="searchForm" onSubmit={event => searchForProducts(event)}>
            <Grid container justifyContent="right">
              <Grid key={1324235}  item xs={10} sm={10} sx={{ pt: { xs: 2, sm: 0 } }}>
                {//<input id="searchText" data-testid="search" type="text" />
                }
                <Searchbar value={searchText} onChangeText={onChangeSearch} onIconPress={updateProductList}
                  placeholder="Refina la búsqueda de tus productos..." autoFocus></Searchbar>
              </Grid>
              <Grid  item xs={12} sm={2} sx={{ pt: { xs: 2, sm: 0 } }}>
                <FormControl variant="filled" sx={{ marginLeft: 2, minHeight: 40, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-filled-label">Supermercado</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    data-testid="Type"
                    id="demo-simple-select-filled"
                    value={value}
                    label="Type"
                    onChange={event => { setValue(event.target.value); handleChange(event); }}
                  >
                    <MenuItem  sx={{ color: 'text.dark' }} value="">
                      <em>None</em>
                    </MenuItem>

                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent='center'
        sx={{ pt: 4, display: 'flex', flexWrap: 'wrap', flexDirection: 'row', width: '100%' }}>

        {products.map((product, i) => {
          return (
            <Grid key={-i} item xs={11} sm={6} md={6} lg={4} xl={3} sx={{ pl: { xs: 0 }, pr: 0 }}>
              <ProductCard key={i} product={product} setVerMasProducto={setVerMasProducto}></ProductCard>
            </Grid>
          );
        })}

      </Grid></>)
      :
      <ProductInformation producto={verMasProducto}></ProductInformation>
    }

    </Grid>
  )
}