package com.api.rest_api.controllers.product;

import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.documents.responseModels.ProductResponseModel;
import com.api.rest_api.services.product.ProductSearchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@WebFluxTest(ProductSearchController.class)
public class ProductSearchControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private ProductSearchService productSearchService;

    public static final String PRODUCT_SEARCH_URI = "/api/v1/products/search";
    public static final String PRODUCT_FILTER_URL = "/api/v1/products/search/filter";
    public static final String PRODUCT_IMPROVE_URI = "/api/v1/products/search/improve";
    public static final String SEARCH_MARCAS_URL = "/api/v1/products/search/marcas";

    @Test
    public void testFindAll() {
        ProductResponseModel responseModel = new ProductResponseModel(List.of(mock(Product.class)));


        when(productSearchService.findAll()).thenReturn(responseModel);


        webTestClient.get().uri(PRODUCT_SEARCH_URI)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductResponseModel.class);
    }

    @Test
    public void testFilterBy() {
        String nombre = "nombre";
        String supermercado = "supermercado";
        Optional<String> opNombre = Optional.of(nombre);
        Optional<String> opSupermercado = Optional.of(supermercado);

        Product product = new Product(null, nombre, null, null, supermercado, null, null, 0);

        ProductResponseModel responseModel = new ProductResponseModel(List.of(product));


        when(productSearchService.filter(
                opNombre,  Optional.empty(), opSupermercado, Optional.empty(), Optional.empty()))
                    .thenReturn(responseModel);

        webTestClient.get().uri(PRODUCT_FILTER_URL + "?nombre=nombre&supermercado=supermercado")
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductResponseModel.class)
                .isEqualTo(responseModel);
    }

    @Test
    public void testFindById() {
        Product product = new Product();

        when(productSearchService.findById("123")).thenReturn(product);

        webTestClient.get().uri(PRODUCT_SEARCH_URI + "/123")
                .exchange()
                .expectStatus().isOk()
                .expectBody(Product.class)
                .isEqualTo(product);
    }

    @Test
    public void testFindBestAlternative() {
        String barcode = "barcode";
        Product requestProduct =  mock(Product.class);


        ProductResponseModel responseModel = mock(ProductResponseModel.class);
        when(requestProduct.getBarcode()).thenReturn(barcode);
        when(productSearchService.findBestAlternative(any(), any(), any()))
                    .thenReturn(responseModel);


        webTestClient.post().uri(PRODUCT_IMPROVE_URI + "?supermercado=supermercado&marca=marca")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestProduct)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Product.class)
                .isEqualTo(new Product());
    }

    @Test
    public void testFindBestAlternativeBadRequest() {
        Product requestProduct =  mock(Product.class); //BARCODE IS NULL


        webTestClient.post().uri(PRODUCT_IMPROVE_URI + "?supermercado=supermercado&marca=marca")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestProduct)
                .exchange()
                .expectStatus()
                .isBadRequest();
    }

    @Test
    public void testOptimizeList() {
        Product product1 = mock(Product.class);
        Product product2 = mock(Product.class);

        ProductResponseModel responseModel = mock(ProductResponseModel.class);
        when(responseModel.getHits()).thenReturn(List.of(product1, product2));
        when(productSearchService.optimizeList(any())).thenReturn(responseModel);

        webTestClient.post().uri(PRODUCT_IMPROVE_URI + "LaLista")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Arrays.asList(product1, product2))
                .exchange()
                .expectStatus().isOk()
                .expectBody(Product.class)
                .isEqualTo(new Product());
    }

    @Test
    public void testGetAllMarcas() {
        ProductResponseModel responseModel = mock(ProductResponseModel.class);


        when(productSearchService.getAllMarcas()).thenReturn(responseModel);


        webTestClient.get()
                .uri(SEARCH_MARCAS_URL)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .json("{\"hits\":[],\"aggregations\":{}}");
    }
}
