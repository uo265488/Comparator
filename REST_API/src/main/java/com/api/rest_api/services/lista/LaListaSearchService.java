package com.api.rest_api.services.lista;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.api.rest_api.documents.domain.LaListaProduct;
import com.api.rest_api.documents.domain.LaLista;
import com.api.rest_api.documents.responseModels.LaListaResponseModel;
import com.api.rest_api.repositories.search.LaListaProductSearchRepository;
import com.api.rest_api.repositories.search.ListaSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class LaListaSearchService {

    @Autowired
    private ListaSearchRepository listaSearchRepository;

    @Autowired
    private LaListaProductSearchRepository laListaProductSearchRepository;

    public LaListaResponseModel getListasByEmail(String email) {
        //exists email

        SearchResponse<LaLista> listaResponse = listaSearchRepository.filterByFieldQuery("email", email);
        if (listaResponse.hits().hits().isEmpty()) {
            return LaListaResponseModel.builder().build();
        }

        LaLista lista = listaResponse.hits().hits().get(0).source();
        SearchResponse<LaListaProduct> productsResponse =
                laListaProductSearchRepository.filterByFieldQuery("listaId", listaResponse.hits().hits().get(0).id());

        LaListaProduct[] productList = Arrays.copyOf(
                productsResponse.hits().hits().stream().map(Hit::source).toArray(),
                productsResponse.hits().hits().size(),
                LaListaProduct[].class);

        return new LaListaResponseModel(
                lista.getEmail(),
                lista.getName(),
                lista.getDate(),
                productList);
    }
}
