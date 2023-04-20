package com.api.rest_api.services;

import co.elastic.clients.elasticsearch.core.search.Hit;
import com.api.rest_api.documents.ResponseModel;
import com.api.rest_api.repositories.search.SearchRepository;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.eql.EqlSearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductSearchService {

    @Autowired
    private SearchRepository productSearchRepository;

    public ResponseModel matchAllQuery() {
        return new ResponseModel(productSearchRepository.matchAllQuery());
    }


    public ResponseModel filterBy(String field, Object value) {
        return new ResponseModel(productSearchRepository.filterByFieldQuery(field, value));
    }

    public ResponseModel basicFiltering(Optional<String> nombre, Optional<String> marca,
                                        Optional<String> supermercado, Optional<String> proveedor,
                                        Optional<String> barcode) {

        return new ResponseModel(productSearchRepository.filterQuery(nombre, marca, Optional.empty(),
                supermercado, proveedor, barcode, Optional.empty()));
    }

}
