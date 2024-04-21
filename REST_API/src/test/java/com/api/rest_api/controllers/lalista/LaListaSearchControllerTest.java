package com.api.rest_api.controllers.lalista;

import com.api.rest_api.controllers.lista.LaListaIndexController;
import com.api.rest_api.controllers.lista.LaListaSearchController;
import com.api.rest_api.documents.domain.LaLista;
import com.api.rest_api.documents.responseModels.LaListaResponseModel;
import com.api.rest_api.services.laListaProduct.LaListaProductIndexService;
import com.api.rest_api.services.lista.LaListaIndexService;
import com.api.rest_api.services.lista.LaListaSearchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(LaListaIndexController.class)
@ContextConfiguration(classes = {
        LaListaSearchController.class,
        LaListaSearchService.class
})
public class LaListaSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LaListaSearchService laListaSearchService;

    @Autowired
    private WebTestClient webTestClient;

    private static final String SEARCH_LISTA_URI = "/api/v1/listas/search";

    @Test
    public void testFindByEmail() {
        String email = "oscar@uniovi.es";

        LaListaResponseModel laListaResponseModel = mock(LaListaResponseModel.class);
        when(laListaSearchService.getListasByEmail(email)).thenReturn(laListaResponseModel);


        this.webTestClient.get()
                .uri(SEARCH_LISTA_URI + "?email=" + email)
                .header("cookieSession")
                .exchange()
                .expectStatus()
                .isOk()
                .expectBody()
                .returnResult();
    }

    @Test
    public void testFindByEmailBadRequest() {

        this.webTestClient.get()
                .uri(SEARCH_LISTA_URI + "?email=")
                .header("cookieSession")
                .exchange()
                .expectStatus()
                .isBadRequest();
    }


}

