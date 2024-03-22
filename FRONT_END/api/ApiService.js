import { productListToListaProductList } from "../helper/parser";

const apiEndPoint = process.env.API_URI || 'http://localhost:8080';
const searchAllURL = apiEndPoint + "/search/all";
const findProductByIdURL = apiEndPoint + "/search/";
const findProductByBarcodeURL = apiEndPoint + "/search/filter?barcode=";
const addNonExistingProductURL = apiEndPoint + "/index/product";
const getProductsByNombreURL = apiEndPoint + '/search/filter?nombre=';
const registrarSubidaDePrecioURL = apiEndPoint + '/update/product';
const generarListaMejoradaURL = apiEndPoint + '/search/laLista/mejorar';
const findAlternativeURL = apiEndPoint + '/search/producto/alternativa';
const getAllMarcasURL = apiEndPoint + '/search/marcas';
const saveImageURL = apiEndPoint + '/utils/saveImage';
const lastPriceChangeURL = apiEndPoint + '/search/lastPriceChange';
const getAvgPriceBySupermercadoURL = apiEndPoint + '/statistics/avgPriceBySupermercado';
const getAvgPricePerMonthBySupermercadoURL = apiEndPoint + '/statistics/avgPricePerMonthBySupermercado';
const getListByEmailURL = apiEndPoint + '/search/listas/findByEmail';
const savePersonalListURL = apiEndPoint + '/index/listas/add';

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

export async function findProductById(id) {
	let response = await fetch(findProductByIdURL + id);
	let data = await response.json(); 
	return data;
  }

export async function findProductByBarcode(barcode) {
	let response = await fetch(findProductByBarcodeURL + barcode);
	return response.json();
}

export async function getProductsFiltered(name) {
	let response = await fetch(getProductsByNombreURL + name);
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
	var url = (productoAMejorar.supermercado != undefined && productoAMejorar.supermercado != '')
		? findAlternativeURL + '?supermercado=' + productoAMejorar.supermercado + ((productoAMejorar.marca) != undefined ? '&marca=' + productoAMejorar.marca : '')
		: findAlternativeURL + ((productoAMejorar.marca) != undefined ? '' : '?marca=' + productoAMejorar.marca);

	return await fetch(url,
		{
			method: "POST",
			body: JSON.stringify(productoAMejorar.producto),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(response => response.json())

		.catch(error => {
			console.error(error);
		});
}

export async function getAllMarcas() {
	let response = await fetch(getAllMarcasURL);
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

export async function getPersonalListByEmail(email) {
	try {
		const response = await fetch(getListByEmailURL + "?email=" + email);
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
		const response = await fetch(savePersonalListURL, {
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