import React, { useState, useEffect } from "react";
import ProductInformation from "../components/ProductInformation";
import { Box, Grid } from "@mui/material";
import RegisterProductForm from "../components/scanner/RegisterProductForm";
import MyCamera from "../components/Scanner/MyCamera";

export default function ProductRegistry() {

    const [code, setCode] = useState("");
    const [product, setProduct] = useState();

    return (
        <Grid container
            className="App"
            sx={{
                bgcolor: 'background.default', width: '100%', height: '100%', display: 'grid',
                pb: { xs: 20, xl: 50 }, pl: { xs: 4, sm: 8, md: 15 }, pr: { xs: 4, sm: 10, md: 15 }
            }}>
            
            {
                code === ""
                    ? <MyCamera code={code} setProduct={setProduct} setCode={setCode} key="camera"></MyCamera>
                    : product != undefined
                        ? <ProductInformation product={product}></ProductInformation>
                        : <RegisterProductForm code={code} key="form"></RegisterProductForm>
            }
            
        </Grid>
    );
};