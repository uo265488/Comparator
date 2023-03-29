package com.api.rest_api.services;

import com.api.rest_api.documents.ResponseModel;
import com.api.rest_api.repositories.search.SearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductSearchService {

    @Autowired
    private SearchRepository productSearchRepository;

    public ResponseModel matchAllQuery() {
        return new ResponseModel(productSearchRepository.matchAllQuery());
    }


}
