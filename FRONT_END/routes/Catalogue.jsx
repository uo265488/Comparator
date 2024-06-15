import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts, getProductsFiltered } from "../api/ApiService.js";
import { useState } from "react";
import { Grid, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard.jsx";
import { Searchbar } from "react-native-paper";
import ProductInformation from "../components/ProductInformation.jsx";
import MyComboBox from "../components/MyComboBox.jsx";
import { SUPERMERCADOS } from "../helper/settings.js";

export default function Catalogo() {

  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [verMasProducto, setVerMasProducto] = useState();
  const [supermercado, setSupermercado] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  useEffect(
    () => {
      refreshProductList();
    }, []);

  useEffect(
    () => {
      refreshProductList();
    }, [supermercado]);
  
    const refreshProductList = async () => {
      const result = await getAllProducts();
      setAllProducts(result.hits);
      
      if (supermercado !== "") {
        setProducts(allProducts.filter(a => a.supermercado == supermercado))
      } else {
        setProducts(result.hits);
      }
  };

  /**
   * Actualiza la lista de productos
   * @param input
   */
  const updateProductList = async () => {
    const filteredProducts = await getProductsFiltered(searchText);
    setProducts(filteredProducts.hits);
  };

  /**
   * Filters the products by name
   * @param event
   */
  const searchForProducts = () => {
    if (searchText.trim() !== "") updateProductList();
  };

  const onChangeSearch = (query) => {
    setSearchText(query);
  };

  return (
    <Grid
      container
      className="App"
      sx={{
        bgcolor: "background.default",
        width: "100%",
        height: "100%",
        display: "grid",
        pb: { xs: 20, xl: 50 },
        pl: { xs: 4, sm: 8, md: 15 },
        pr: { xs: 4, sm: 10, md: 15 },
      }}
    >
      {verMasProducto == undefined ? (
        <>
          <Grid item sx={{ pt: 2, pl: { xs: 0, sm: 15 } }}>
            <Typography
              variant="h2"
              align="center"
              sx={{ color: "text.primary" }}
            >
              Catálogo de Comparator!!
            </Typography>
          </Grid>

          <Grid
            container
            className="search-container"
            alignItems="stretch"
            sx={{ pt: 0 }}
          >
            <Grid item xs={5} sm={8}>
              <form
                className="searchForm"
                onSubmit={(event) => searchForProducts(event)}
              >
                <Grid container justifyContent="right">
                  <Grid
                    key={1324235}
                    item
                    xs={10}
                    sm={10}
                    sx={{ pt: { xs: 2, sm: 0 } }}
                  >
                    <Searchbar
                      value={searchText}
                      onChangeText={onChangeSearch}
                      onIconPress={updateProductList}
                      placeholder="Refina la búsqueda de tus productos..."
                      onKeyPress={(e) => {
                        if (e.nativeEvent.key === 'Enter') {
                          updateProductList();
                        }
                      }}
                      autoFocus
                    ></Searchbar>
                  </Grid>
                  <Grid item xs={10} sm={2} sx={{ pt: { xs: 2, sm: 0 } }}>
                    <MyComboBox
                      supermercado={supermercado}
                      setSupermercado={setSupermercado}
                      supermercados={SUPERMERCADOS}
                      helperText={""}
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{
              pt: 4,
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              width: "100%",
            }}
          >
            {products.map((product, i) => {
              return (
                <Grid
                  className="ProductCard"
                  key={'productGrid_' + i}
                  item
                  xs={11}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={3}
                  sx={{ pl: { xs: 0 }, pr: 0 }}
                >
                  <ProductCard
                    id={product.id}
                    key={'product_' + i}
                    product={product}
                    setVerMasProducto={setVerMasProducto}
                  ></ProductCard>
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <ProductInformation producto={verMasProducto}></ProductInformation>
      )}
    </Grid>
  );
}
