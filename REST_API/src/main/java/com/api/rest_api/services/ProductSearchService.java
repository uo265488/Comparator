package com.api.rest_api.services;

import co.elastic.clients.elasticsearch.core.search.Hit;
import com.api.rest_api.documents.Product;
import com.api.rest_api.documents.ResponseModel;
import com.api.rest_api.repositories.search.SearchRepository;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.eql.EqlSearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public ResponseModel optimizeList(List<Product> laLista) {
        ResponseModel responseModel = new ResponseModel();

        for(Product p : laLista) {
            responseModel.addFirstHit(
                    productSearchRepository.moreLikeThisQuery(p, new String[]{"nombre"},
                            "ASC", "precioActual", new HashMap<>(), 10));
        }
        return responseModel;
    }

    public ResponseModel findBestAlternative(Product product, Optional<String> supermercado) {
        Map<String, String> filters = new HashMap<>();
        filters.put("supermercado", supermercado.isPresent() ? supermercado.get() : "");

        ResponseModel res = new ResponseModel();
        res.addFirstHit(productSearchRepository.moreLikeThisQuery(product, new String[]{"nombre"},
                "ASC", "precioActual", filters, 10));

        return res;
    }

    public ResponseModel findProductByBarcode(String barcode) {
        ResponseModel responseModel = new ResponseModel();
        responseModel.addHits(
                productSearchRepository.filterByFieldQuery("barcode", barcode));
        return responseModel;
    }
}
