package com.api.rest_api.service.lista;


import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.core.search.HitsMetadata;
import com.api.rest_api.documents.domain.LaLista;
import com.api.rest_api.documents.domain.LaListaProduct;
import com.api.rest_api.documents.responseModels.LaListaResponseModel;
import com.api.rest_api.repositories.search.LaListaProductSearchRepository;
import com.api.rest_api.repositories.search.LaListaSearchRepository;
import com.api.rest_api.services.laLista.LaListaSearchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(LaListaSearchService.class)
@ContextConfiguration(classes = {
        LaListaProductSearchRepository.class,
        LaListaSearchService.class
})
public class LaListaSearchServiceTest {

    @MockBean
    private LaListaProductSearchRepository laListaProductSearchRepository;

    @MockBean
    private LaListaSearchRepository listaSearchRepository;

    @Autowired
    private LaListaSearchService laListaSearchService;

    @Test
    public void testGetListasByEmailListExists() {
        String email = "oscar@uniovi.es";
        String listaId = "1";
        String name = "Mi lista semanal";
        String date = "fecha";
        LaLista laLista = new LaLista(name, email, date);
        SearchResponse<LaLista> mockListaResponse = mock(SearchResponse.class);
        SearchResponse<LaListaProduct> mockProductsResponse = mock(SearchResponse.class);
        HitsMetadata<LaLista> responseHitsMetadata = mock(HitsMetadata.class);
        HitsMetadata<LaListaProduct> mockProductHitsMetadata = mock(HitsMetadata.class);
        Hit<LaLista> mockLaListaHit = mock(Hit.class);
        Hit<LaListaProduct> moLaListaProductHit = mock(Hit.class);


        when(listaSearchRepository.filterByFieldQuery(eq("email"), anyString()))
                .thenReturn(mockListaResponse);
        when(mockListaResponse.hits()).thenReturn(responseHitsMetadata);
        when(responseHitsMetadata.hits()).thenReturn(Collections.singletonList(mockLaListaHit));
        when(mockLaListaHit.id()).thenReturn(listaId);
        when(mockLaListaHit.source()).thenReturn(laLista);


        when(laListaProductSearchRepository.filterByFieldQuery("listaId", listaId)).thenReturn(mockProductsResponse);
        when(mockProductsResponse.hits()).thenReturn(mockProductHitsMetadata);
        when(mockProductHitsMetadata.hits()).thenReturn(Collections.singletonList(moLaListaProductHit));


        LaListaResponseModel result = laListaSearchService.getListasByEmail(email);


        verify(listaSearchRepository).filterByFieldQuery("email", email);
        verify(laListaProductSearchRepository).filterByFieldQuery("listaId", "1");

        assertEquals(email, result.getEmail());
        assertEquals(name, result.getName());
        assertEquals(date, result.getDate());
        assertTrue(result.getLaListaProductsList() != null);
    }

    @Test
    public void testGetListasByEmailListDoesNotExist() {
        String nonExistingEmail = "nonexisting@uniovi.es";
        HitsMetadata<LaLista> responseHitsMetadata = mock(HitsMetadata.class);
        SearchResponse<LaLista> mockEmptyListaResponse = mock(SearchResponse.class);

        when(listaSearchRepository.filterByFieldQuery(eq("email"), anyString())).thenReturn(mockEmptyListaResponse);
        when(mockEmptyListaResponse.hits()).thenReturn(responseHitsMetadata);
        when(responseHitsMetadata.hits()).thenReturn(Collections.emptyList());
        when(mockEmptyListaResponse.hits().hits()).thenReturn(Collections.emptyList());


        LaListaResponseModel result = laListaSearchService.getListasByEmail(nonExistingEmail);


        verify(listaSearchRepository).filterByFieldQuery("email", nonExistingEmail);

        assertEquals(result, LaListaResponseModel.builder().build());
    }
}
