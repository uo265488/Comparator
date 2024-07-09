import { productListToListaProductList } from "../helper/parser";
import isNullOrEmpty from "../helper/utils";

const apiEndPoint = process.env.API_URI || 'http://localhost:8080/api/v1';

const productsEnpoint = apiEndPoint + '/products';

//PRODUCTS ENDPOINTS
const searchProductsEndpoint = productsEnpoint + '/search';
const filterProductsURL = searchProductsEndpoint + '/filter';
const findProductByIdURL = searchProductsEndpoint + '/';
const improveProductURL = searchProductsEndpoint + '/improve';
const improveProductsListURL = searchProductsEndpoint + '/improveLaLista';
const findAllMarcasURL = searchProductsEndpoint + '/marcas';

const indexProductsEndpoint = productsEnpoint + '/index';

const registrarSubidaDePrecioURL = apiEndPoint + '/products/update'; //Spanish naming (mas significativo)

//STATISTICS ENDPOINTS
const statisticsEndpoint = apiEndPoint + '/statistics';
const lastPriceChangeURL = statisticsEndpoint + '/lastPriceChange';
const getAvgPriceBySupermercadoURL = statisticsEndpoint + '/avgPriceBySupermercado';
const getAvgPricePerMonthBySupermercadoURL = statisticsEndpoint + '/avgPricePerMonthBySupermercado';
const getMostFrequentlyUpdatedURL = statisticsEndpoint + '/mostFrequentlyUpdated';

//LALISTA ENDPOINTS
const searchListasURL = apiEndPoint + '/listas/search';
const indexListasURL = apiEndPoint + '/listas/index';

//IMAGES ENDPOINTS
const saveImageURL = apiEndPoint + '/images';


export async function getAllProducts() {
	let response = await fetch(searchProductsEndpoint);
	return response.json();
}

export async function findProductById(id) {
	let response = await fetch(findProductByIdURL + id);
	let data = await response.json();
	return data;
}

export async function findProductByBarcode(barcode) {
    console.log(barcode);
    try {
        let response = await fetch(filterProductsURL + '?barcode=' + barcode);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export async function getProductsFiltered(name) {
	let response = await fetch(filterProductsURL + '?nombre=' + name);
	return response.json();
}

export async function addNonExistingProduct(product) {

	let response = await fetch(indexProductsEndpoint, {
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
	if (response.status === 201) return true;
	else return false;
}

export async function findProductByBarcodeAndSupermercado(producto) {
	try {
		const response = await fetch(filterProductsURL + "?barcode=" + producto.barcode + "&supermercado=" + producto.supermercado);
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
	fetch(improveProductsListURL, {
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
	var url = improveProductURL;

	if (!isNullOrEmpty(productoAMejorar.supermercado)) {
		url += '?supermercado=' + productoAMejorar.supermercado;
		if (!isNullOrEmpty(productoAMejorar.marca)) {
			url += '&marca=' + productoAMejorar.marca;
		}
	} else if (!isNullOrEmpty(productoAMejorar.marca)) {
		url += '?marca=' + productoAMejorar.marca;
	}

	return await fetch(url,
		{
			method: "POST",
			body: JSON.stringify(productoAMejorar.producto),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(
			data => data.json()
		);
}

export async function getAllMarcas() {
	let response = await fetch(findAllMarcasURL);
	return response.json().aggregations.marcas;
}

export function saveImage(barcode, base64Image) {
	const data = { barcode, base64Image };

	fetch(saveImageURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (response.ok) {
				console.log('Image saved successfully.');
			} else {
				console.error('Error occurred while saving the image:', response.status, response.statusText);
			}
		})
		.catch((error) => {
			console.error('Error occurred while saving the image:', error);
		});
}

export async function getLastPriceChange() {
	let response = await fetch(lastPriceChangeURL);
	return response.json();
}

export async function getAvgPriceBySupermercado() {
	let response = await fetch(getAvgPriceBySupermercadoURL);
	return response.json();
}

export async function getAvgPricePerMonthBySupermercado() {
	let response = await fetch(getAvgPricePerMonthBySupermercadoURL);
	return response.json();
}

export async function getMostFrequentlyUpdated() {
	let response = await fetch(getMostFrequentlyUpdatedURL);
	return response.json();
}

export async function getPersonalListByEmail(email) {
	try {
		const response = await fetch(searchListasURL + "?email=" + email);
		if (!response.ok) {
			throw new Error('Could not retrieve LaLista from database...');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

export async function savePersonalList(listName, email, productList) {

	try {
		const requestBody = JSON.stringify({
			productList: productListToListaProductList(productList),
			email: email,
			listName: listName
		});

		console.log(requestBody);
		const response = await fetch(indexListasURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: requestBody
		})

		return await response.json();

	} catch (error) {
		console.error(error);
		return Promise.reject(error);
	}
}