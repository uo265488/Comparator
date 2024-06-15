package com.api.rest_api.controllers.product;

import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.services.product.ProductIndexService;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.reactive.function.BodyInserters;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(ProductIndexController.class)
@ContextConfiguration(classes = {
        ProductIndexService.class,
        ProductIndexController.class
})
public class ProductIndexControllerTest {

    private static final String INDEX_PRODUCT_URI = "/api/v1/products/index";
    private static final String CREATE_INDEX_URI = "/api/v1/products/index/create-index";
    private static final String BULK_INDEX_URI = "/api/v1/products/index/bulk";

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private ProductIndexService productIndexService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testIndexProductCreated() {
        Product product = new Product("123456", "Product Name", "Brand", "Supplier",
                "Supermarket", new String[]{"2023-01-01"}, new double[]{10.0}, 10.0);
        String expectedId = "1";


        IndexResponse indexResponseMock = mock(IndexResponse.class);
        when(productIndexService.indexDocument(product)).thenReturn(indexResponseMock);
        when(indexResponseMock.result()).thenReturn(Result.Created);
        when(indexResponseMock.id()).thenReturn(expectedId);


        this.webTestClient.post()
                .uri(INDEX_PRODUCT_URI)
                .header("cookieSession")
                .bodyValue(product)
                .exchange()
                .expectStatus()
                .isCreated()
                .expectBody(String.class)
                .isEqualTo(expectedId);
    }

    @Test
    public void testIndexProductConflict() {
        Product product = new Product("123456", "Product Name", "Brand", "Supplier",
                "Supermarket", new String[]{"2023-01-01"}, new double[]{10.0}, 10.0);
        IndexResponse indexResponseMock = mock(IndexResponse.class);


        when(productIndexService.indexDocument(product)).thenReturn(indexResponseMock);
        when(indexResponseMock.result()).thenReturn(Result.NoOp); //any result != CREATED


        this.webTestClient.post()
                .uri(INDEX_PRODUCT_URI)
                .header("cookieSession")
                .bodyValue(product)
                .exchange()
                .expectStatus()
                .isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    public void testCreateIndexCreated() {
        when(productIndexService.createIndex()).thenReturn(true);

        webTestClient.post().uri(CREATE_INDEX_URI)
                .exchange()
                .expectStatus()
                .isCreated()
                .expectBody(Void.class);
    }

    @Test
    public void testCreateIndexInternalServerError() {
        when(productIndexService.createIndex()).thenReturn(false);

        webTestClient.post().uri(CREATE_INDEX_URI)
                .exchange()
                .expectStatus()
                .isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @Disabled("Funcionalidad obsoleta. ")
    public void testBulkIndexing() throws Exception {
        byte[] fileContent = "file content".getBytes();
        MockMultipartFile mockFile = new MockMultipartFile("file", "products.json",
                MediaType.APPLICATION_JSON_VALUE, fileContent);
        mockFile = new MockMultipartFile("json", "", "application/json", "{\"json\": \"someValue\"}".getBytes());


        webTestClient.post()
                .uri(BULK_INDEX_URI)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", mockFile))
                .exchange()
                .expectStatus()
                .isCreated()
                .expectBody(Void.class);
    }
}

