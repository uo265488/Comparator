import { Box, Breadcrumbs, Typography } from "@mui/material";
import { findProductByBarcode } from "../api/ApiService";
import { useEffect } from "react";
import { useState } from "react";
import { NumberPicker } from "react-widgets";
import { añadirProductoALaLista } from "../redux/reduxConfig";
import styled from "@emotion/styled";
import { Button, Card } from "react-native-paper";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import SubidaDePrecioForm from "./scanner/SubidaDePrecioForm";



export const StyledButton = styled(Button)`
background: #9681f2;
color: black;
:hover {
    background: #81c9f2;
}
`;

export const StyledImg = styled('img')({
    margin: 20,
    marginLeft: 90,
    display: 'inline-block',
    height: '500px',
    borderRadius: 25
});



export default function ProductInformation(props) {

    const [buttonPressed, setButtonPressed] = useState(0);

    const dispatch = useDispatch();

    const [value, setValue] = useState(1);

    function abrirSubidaDePrecioForm() {
        setButtonPressed(1);
    }

    const addProductToLaLista = () => {
        dispatch(añadirProductoALaLista({ producto: props.product, unidades: value, mejora: -1 }));
        setValue(1);
    }

    let imageRef = require("../static/images/producto.png");

    function BreadcrumbsProduct() {
        return(
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" href="/" >
              <Typography
              variant='h6'
              sx={{color: 'text.secondary'}}>
                  Home
              </Typography>
            </Link>
            <Link underline="hover" href="/shop" >
            <Typography variant='h6'
              sx={{color: 'text.secondary'}}>
                  Catalogue
              </Typography>
              </Link>
              <Typography variant='h6'
              sx={{color: 'text.secondary'}}>
                  {props.product.barcode}
              </Typography>
            </Breadcrumbs>
        );
    }

    return (
        (buttonPressed == 0)
            ?
            (<Box sx={{
            bgcolor: 'background.default', display: 'flex', flexWrap: 'wrap', 
                    height: '100%', justifyContent: 'center', pb: 5}}>
                
            <Box sx={{flexDirection: 'column', pt:2, pl: 5}}>
            <BreadcrumbsProduct product={props.product.nombre}/>           

            <Box sx={{borderRadius: 25, justifyContent: "center", padding: {xs: 0, sm: 2, md:10},
                        display: 'flex',  flexDirection: {xs: 'column', lg: 'row'} }}>
     
                <Box >
                    <div className="product-pic">
                        <StyledImg
                                sx={{ height: {xs: 300, sm: 400, md: 600}, ml: {xs:1, sm: 10, xl: 30} }}
                                src={imageRef}
                                alt={props.product.nombre}
                            />
                        </div>
                    </Box>

                    <Box sx={{ height: '500px', width: '100%'}} >
                        <div className="product-info">
                            <Typography
                                variant='h3'
                                sx={{color: 'text.default', pt: 4, pb: 4, typography: { sm: 'h3', xs: 'h5' }}}
                            >
                                {props.product.nombre}
                            </Typography>
                            <Card sx={{maxWidth: 550, p: 2, bgcolor: 'background.light', mr: {xs: 4, sm: 0}}}>
                                <Typography sx={{ color: 'text.dark', typography: { sm: 'body1', xs: 'body2' } }}>
                                    {props.product.supermercado}
                                </Typography>
                            </Card>
                            <Typography
                                variant='h5'
                                sx={{pt: 4, pb:4, color: 'text.default', typography: { sm: 'h5', xs: 'h6' }}}
                            >
                                Precio: {props.product.precios[props.product.precios.length - 1]}€
                            </Typography>
                            <Box
                                sx={{ display: 'flex', flexDirection: {xs: 'column', sm:  'row'}, p: 2, alignItems: 'center', justifyContent: 'space-between'}}
                            >
                                <NumberPicker min={1} value={value} onChange={value => { if (value !== null ) setValue(value)}} 
                                style={{ }}
                                ></NumberPicker>
                        
                                <StyledButton mode='contained' sx={{bgcolor: 'background.button', ":hover": {bgcolor: 'background.buttonhover'}, color: 'text.dark', mr: {xs: 0, sm: 2, md: 10, lg: 0, xl: 30}}} 
                                onClick={addProductToLaLista}>Añadir a LaLista</StyledButton>
                            </Box>
                            <StyledButton mode='contained' sx={{bgcolor: 'background.button', ":hover": {bgcolor: 'background.buttonhover'}, color: 'text.dark', mr: {xs: 0, sm: 2, md: 10, lg: 0, xl: 30}}} 
                                onClick={abrirSubidaDePrecioForm}>Registrar una subida de precio</StyledButton>
                        </div>
                    </Box>
                    </Box>                    
                </Box>
            </Box>)
            :
            <SubidaDePrecioForm product={props.product}></SubidaDePrecioForm>
        );
}