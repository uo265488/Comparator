import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { getAllProducts, getProductsFiltered } from "../api/ApiService.js";
import ProductCard from "../components/ProductCard.jsx";
import MySearchBar from "../components/catalogue/MySearchBar.jsx";
import MyComboBox from "../components/MyComboBox.jsx";
import ProductInformation from "../components/ProductInformation.jsx";
import { SUPERMERCADOS } from "../helper/settings.js";

export default function Catalogo() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [verMasProducto, setVerMasProducto] = useState();
  const [supermercado, setSupermercado] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    refreshProductList();
  }, []);

  useEffect(() => {
    if (supermercado) {
      const filteredProducts = allProducts.filter(a => a.supermercado === supermercado);
      setProducts(filteredProducts);
    } else {
      setProducts(allProducts);
    }
  }, [supermercado, allProducts]);

  const refreshProductList = async () => {
    const result = await getAllProducts();
    setAllProducts(result.hits);
    setProducts(result.hits);
  };

  const updateProductList = async () => {
    if (searchText.trim() !== "") {
      const filteredProducts = await getProductsFiltered(searchText);
      setProducts(filteredProducts.hits);
    } else {
      refreshProductList();
    }
  };

  const searchForProducts = () => {
    if (searchText.trim() !== "") {
      updateProductList();
    } else {
      refreshProductList();
    }
  };

  const onChangeSearch = (query) => {
    setSearchText(query);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      updateProductList();
    }
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
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{
              margin: '30px 0',
              padding: '10px 20px',
              background: 'linear-gradient(to right, #7b2cbf, #9d4edd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              align="center"
              sx={{
                color: "text.primary",
                fontWeight: 'bold',
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                '@media (max-width: 600px)': {
                  fontSize: '2.5rem',
                  margin: '20px 0',
                  padding: '5px 10px',
                },
                '@media (min-width: 600px) and (max-width: 960px)': {
                  fontSize: '2.5rem',
                },
                '@media (min-width: 960px)': {
                  fontSize: '2.5rem',
                },
              }}
            >
              ¡Catálogo de Comparator!
            </Typography>
          </Grid>

          <Grid
            container
            className="search-container"
            alignItems="center"
            justifyContent="center"
            sx={{ pt: 0 }}
          >
            <Grid item xs={10} sm={8}>
              <form
                className="searchForm"
                onSubmit={(event) => {
                  event.preventDefault();
                  searchForProducts();
                }}
              >
                <Grid container justifyContent="right" alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <MySearchBar
                      id="search-id"
                      value={searchText}
                      onChangeText={onChangeSearch}
                      onIconPress={searchForProducts}
                      placeholder="Refina la búsqueda de tus productos..."
                      onKeyPress={handleKeyPress}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
            {products.map((product, i) => (
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
                />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <ProductInformation producto={verMasProducto} />
      )}
    </Grid>
  );
}
