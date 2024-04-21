package com.api.rest_api.controllers.product;

import co.elastic.clients.elasticsearch._types.InlineGet;
import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch.core.UpdateResponse;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.services.product.ProductUpdateService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@WebFluxTest(ProductUpdateController.class)
public class ProductUpdateControllerTest {

    private static final String UPDATE_PRODUCT_URI = "/api/v1/products/update";

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private ProductUpdateService productUpdateService;

    @Test
    public void updateProductTest() {
        Product product = new Product();
        Product updatedProduct = new Product();
        UpdateResponse<Product> productUpdateResponse = mock(UpdateResponse.class);
        InlineGet<Product> productInlineGet = mock(InlineGet.class);

        when(productUpdateService.updateDocument(product)).thenReturn(productUpdateResponse);
        when(productUpdateResponse.result()).thenReturn(Result.Updated);
        when(productUpdateResponse.get()).thenReturn(productInlineGet);
        when(productInlineGet.source()).thenReturn(updatedProduct);


        this.webTestClient.put()
                .uri(UPDATE_PRODUCT_URI)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(product)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Product.class)
                .isEqualTo(updatedProduct);
    }

    @Test
    public void updateProductBadRequestTest() {
        Product product = new Product();
        UpdateResponse<Product> productUpdateResponse = mock(UpdateResponse.class);

        when(productUpdateService.updateDocument(product)).thenReturn(productUpdateResponse);
        when(productUpdateResponse.result()).thenReturn(Result.NoOp);

        this.webTestClient.put()
                .uri(UPDATE_PRODUCT_URI)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(product)
                .exchange()
                .expectStatus()
                .isBadRequest();
    }

}
