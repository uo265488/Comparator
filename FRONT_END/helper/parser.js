import { createBrowserRouter } from "react-router-dom";

export const productoAElemento = (selectedProduct) => ({ producto: selectedProduct, unidades: 1 });

export const productToChartData = (producto) => {
    var counter = 0;
    var data = [];
    for (counter; counter < producto.precios.length; counter++) {
        data[counter] = createData(producto.fechas_de_registro[counter], producto.precios[counter]);
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = year + '-' + month + '-' + day;
    data[data.length] = createData(formattedDate, producto.precioActual)
    return data;
} 

const createData = (date, price) => {
    return { date: date, precio: price }
}

export const createDataFromProduct = (product) => {
    const data = [];
    for (let i = 0; i < product.fechas_de_registro.length; i++) {
        data.push({
            date: new Date(product.fechas_de_registro[i]),
            precio: product.precios[i]
        });
    }
    return data;
}

export const productListToListaProductList = (productList) => {
    return productList.map((p) => ({
        barcode: p.producto.barcode,
        supermercado: p.producto.supermercado,
        listaId: ""
    }));
}
