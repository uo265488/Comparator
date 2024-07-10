import React, { useState } from "react";
import { Grid } from "@mui/material";
import RegisterProductForm from "../components/scanner/RegisterProductForm";
import BarcodeInformation from "../components/scanner/BarcodeInformation";
import MyCamera from "../components/scanner/MyCamera";
import isArrayNullOrUndefined from "../helper/utils";
import { findProductByBarcode } from "../api/ApiService";
import ProductInformation from "../components/ProductInformation";

export default function ProductRegistry() {

    const [code, setCode] = useState("");
    const [productos, setProductos] = useState([]);
    const [isCameraVisible, setIsCameraVisible] = useState(true);
    const [isRegistryFormVisible, setIsRegistryFormVisible] = useState(false);
    const [isBarcodeInformationVisible, setIsBarcodeInformationVisible] = useState(false);

    const sendCode = (sentCode) => {
        setIsCameraVisible(false);
        setCode(sentCode);
        console.log(sentCode);
        
        findProductByBarcode(sentCode).then((result) => {
            console.log(result.hits);
            setProductos(result.hits);
            
            // Use the updated state within the callback of setProductos
            setProductos((updatedProductos) => {
                console.log(updatedProductos);
                if (!isArrayNullOrUndefined(updatedProductos)) {
                    updatedProductos.length === 0
                        ? setIsRegistryFormVisible(true)
                        : setIsBarcodeInformationVisible(true);
                } else {
                    console.log("else")
                }
                return updatedProductos;  // Return the updated state
            });
        }).catch(error => {
            console.error('Error fetching product:', error);
        });
    };

    return (
        <Grid container
            className="App"
            sx={{
                bgcolor: 'background.default', width: '100%', height: '100%', display: 'grid',
                pb: { xs: 20, xl: 50 }, pl: { xs: 4, sm: 8, md: 15 }, pr: { xs: 4, sm: 10, md: 15 }
            }}>
            
            {
                isCameraVisible && <MyCamera sendCode={sendCode} key="camera"></MyCamera>
            }
            {
                isBarcodeInformationVisible && <ProductInformation producto={productos[0]} />
            }
            {
                isRegistryFormVisible && <RegisterProductForm code={code} key="form"></RegisterProductForm>
            }
        </Grid>
    );
};

