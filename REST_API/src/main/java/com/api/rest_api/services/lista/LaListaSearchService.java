package com.api.rest_api.services.lista;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.Lista;
import com.api.rest_api.documents.responseModels.LaListaResponseModel;
import com.api.rest_api.repositories.search.LaListaProductSearchRepository;
import com.api.rest_api.repositories.search.ListaSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LaListaSearchService {

    @Autowired
    private ListaSearchRepository listaSearchRepository;

    @Autowired
    private LaListaProductSearchRepository laListaProductSearchRepository;

    public LaListaResponseModel getListasByEmail(String email) {
        //exists email

        SearchResponse<Lista> listaResponse = listaSearchRepository.filterByFieldQuery("email", email);
        if (listaResponse.hits().hits().isEmpty()) {
            return LaListaResponseModel.builder().build();
        }
        String listaId = listaResponse.hits().hits().get(0).id();
        SearchResponse productsResponse = laListaProductSearchRepository.filterByFieldQuery("listaId", listaId);

        return LaListaResponseModel.builder()
                .lista(listaResponse.hits().hits().get(0).source())
                .laListaProductsList(productsResponse.hits().hits())
                .build();
    }

}
