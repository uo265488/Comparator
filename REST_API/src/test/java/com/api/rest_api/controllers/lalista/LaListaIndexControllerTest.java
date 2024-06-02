package com.api.rest_api.controllers.lalista;

import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.controllers.laLista.LaListaIndexController;
import com.api.rest_api.documents.domain.LaListaProduct;
import com.api.rest_api.documents.requestModels.AddListaRequest;
import com.api.rest_api.services.laListaProduct.LaListaProductIndexService;
import com.api.rest_api.services.laLista.LaListaIndexService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(LaListaIndexController.class)
@ContextConfiguration(classes = {
        LaListaIndexController.class,
        LaListaIndexService.class,
        LaListaProductIndexService.class
})
public class LaListaIndexControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LaListaIndexService laListaIndexService;

    @MockBean
    private LaListaProductIndexService laListaProductIndexService;

    @Autowired
    private WebTestClient webTestClient;


    private static final String CREATE_INDEX_URI = "/api/v1/listas/index/create-index";
    private static final String CREATE_LISTA_URI = "/api/v1/listas/index";


    @Test
    public void testCreateIndices() {
        when(laListaIndexService.createIndex()).thenReturn(true);
        when(laListaProductIndexService.createIndex()).thenReturn(true);


        this.webTestClient.get().uri(CREATE_INDEX_URI)
                .exchange()
                .expectStatus()
                .isCreated();
    }

    @Test
    public void testCreateIndicesInternalServerErrorLaListaIndexServiceException() {
        when(laListaIndexService.createIndex()).thenReturn(false);
        when(laListaProductIndexService.createIndex()).thenReturn(true);


        this.webTestClient.get().uri(CREATE_INDEX_URI)
                .exchange()
                .expectStatus()
                .isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @Test
    public void testCreateIndicesInternalServerErrorLaListaProductIndexServiceException() {
        when(laListaIndexService.createIndex()).thenReturn(true);
        when(laListaProductIndexService.createIndex()).thenReturn(false);


        this.webTestClient.get()
                .uri(CREATE_INDEX_URI)
                .exchange()
                .expectStatus()
                .isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    public void testCreateListaStatusCreated() {
        String requestEmail = "oscar@uniovi.es";
        String requestListName = "ShoppingList";
        List<LaListaProduct> laListaProductList = List.of(mock(LaListaProduct.class), mock(LaListaProduct.class));


        IndexResponse indexResponse = mock(IndexResponse.class);
        when(indexResponse.result()).thenReturn(Result.Created);
        when(indexResponse.id()).thenReturn("1");
        when(laListaIndexService.indexLista(requestEmail, requestListName )).thenReturn(indexResponse);

        when(laListaProductIndexService.indexLaListaProducts(any(), any())).thenReturn(true);


        this.webTestClient.post()
                .uri(CREATE_LISTA_URI)
                .header("cookieSession")
                .bodyValue(new AddListaRequest(requestEmail, requestListName, laListaProductList))
                .exchange()
                .expectStatus()
                .isCreated()
                .expectBody();
    }

    @Test
    public void testCreateListaStatusConflict() {
        String requestEmail = "oscar@uniovi.es";
        String requestListName = "ShoppingList";
        List<LaListaProduct> laListaProductList = List.of(mock(LaListaProduct.class), mock(LaListaProduct.class));


        IndexResponse indexResponse = mock(IndexResponse.class);
        when(indexResponse.result()).thenReturn(Result.Created);
        when(indexResponse.id()).thenReturn("1");
        when(laListaIndexService.indexLista(requestEmail, requestListName )).thenReturn(indexResponse);

        when(laListaProductIndexService.indexLaListaProducts(indexResponse.id(), laListaProductList))
                .thenReturn(false);


        this.webTestClient.post()
                .uri(CREATE_LISTA_URI)
                .header("cookieSession")
                .bodyValue(new AddListaRequest(requestEmail, requestListName, laListaProductList))
                .exchange()
                .expectStatus()
                .isEqualTo(HttpStatus.CONFLICT)
                .expectBody();
    }

    @Test
    public void testCreateListaStatusBadRequest() {
        String requestEmail = "oscar@uniovi.es";
        String requestListName = "ShoppingList";
        List<LaListaProduct> laListaProductList = List.of(mock(LaListaProduct.class), mock(LaListaProduct.class));


        IndexResponse indexResponse = mock(IndexResponse.class);
        when(laListaIndexService.indexLista(requestEmail, requestListName)).thenReturn(indexResponse);
        when(indexResponse.result()).thenReturn(Result.NoOp);

        this.webTestClient.post()
                .uri(CREATE_LISTA_URI)
                .header("cookieSession")
                .bodyValue(new AddListaRequest(requestEmail, requestListName, laListaProductList))
                .exchange()
                .expectStatus()
                .isEqualTo(HttpStatus.BAD_REQUEST)
                .expectBody();
    }
}
