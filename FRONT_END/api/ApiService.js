
const apiEndPoint = process.env.API_URI || 'http://localhost:8080';
const searchAllURL = apiEndPoint + "/search/all";
const findProductByBarcodeURL = apiEndPoint + "/search/filter?barcode=";
const addNonExistingProductURL = apiEndPoint + "/index/product";
const getProductsByNombreURL = apiEndPoint + '/search/filter?nombre=';
const registrarSubidaDePrecioURL = apiEndPoint + '/update/product';
const generarListaMejoradaURL = apiEndPoint + '/search/laLista/mejorar';
const findAlternativeURL = apiEndPoint + '/search/producto/alternativa';

/**
 * This function returns the productst that are currently stored in the databse.
 * First we get the api endpoint that we are going to be listening on.
 * Then we call the api function with the address that we want to request at. (localhost:5000/products/list)
 * Then we send back the response.
 */
export async function getAllProducts() {
	let response = await fetch(searchAllURL);
	return response.json();
}

export async function getProductsFiltered(name)  {
	let response = await fetch(getProductsByNombreURL + name);
	return response.json();
}

export async function findProductByBarcode(barcode)  {
	let response = await fetch(findProductByBarcodeURL + barcode);
	return response.json();
}

/**
 *
 * @param user Function to add orders to the db
 * @returns
 */
export async function addNonExistingProduct(product) {
    
	let response = await fetch(addNonExistingProductURL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
            barcode: product.barcode,
            nombre: product.nombre,
            supermercado: product.supermercado,
            proveedor: product.proveedor,
            precios: product.precios,
            marca: product.marca,
			fechas_de_registro: [getActualDate()],
			precioActual: product.precioActual
		}),
	});
	if (response.status === 200) return true;
	else return false;
}



export async function findProductByBarcodeAndSupermercado(producto) {
	try {
	  const response = await fetch("http://localhost:8080/search/filter?barcode=" + producto.barcode + "&supermercado=" + producto.supermercado);
	  if (!response.ok) {
		throw new Error('Network response was not ok');
	  }
	  const data = await response.json();
	  return data;
	} catch (error) {
	  console.error(error);
	}
  }

export function actualizarProducto(producto) {
	producto.fechas_de_registro[producto.fechas_de_registro.length] = getActualDate();
	// Make PUT request
	fetch(registrarSubidaDePrecioURL, {
		method: 'PUT',
		headers: {
	  		'Content-Type': 'application/json',
	  		// Add any other headers required by your API
		},
		body: JSON.stringify(producto),
 	})
    .then(response => {
		if (!response.ok) {
	  		throw new Error('Error updating data');
		}
		return response.json();
  	})
  	.then(updatedData => {
		console.log('Data updated successfully:', updatedData);
  	})
  	.catch(error => {
		console.error('Error updating data:', error);
  	});
}

function getActualDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1; // Note that months are zero-indexed, so we add 1 to get the actual month number
    let day = today.getDate();

    // Format the date as YYYY-MM-DD
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export function generarListaMejorada(lista) {
	fetch(generarListaMejoradaURL, {
 		method: 'POST',
  		body: JSON.stringify(lista),
 		headers: {
    		'Content-Type': 'application/json'
  		}
	})
  	.then(response => response.json())
  	.then(data => {
    	console.log(data);
  	})
  	.catch(error => {
    	console.error(error);
  	});
}

export function registrarSubidaDePrecio(producto) {
	findProductByBarcodeAndSupermercado(producto).then(
        response => {
          if (response.hits.length > 0) {
            console.log("actualiza")
            return actualizarProducto(producto);
          } else {
            console.log("registra")
            producto.precios = [producto.precios[producto.precios.length - 1]];
            return addNonExistingProduct(producto);
          }
        });
}

export async function findAlternative(productoAMejorar) {
	return await fetch((productoAMejorar.supermercado != undefined && productoAMejorar.supermercado != '') 
		? findAlternativeURL +  '?supermercado=' + productoAMejorar.supermercado
		: findAlternativeURL,
		{
			method: "POST",
			body: JSON.stringify(productoAMejorar.producto),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())
		
		.catch(error => {
	  		console.error("No pasa naa");
		});
}


