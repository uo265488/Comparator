package com.api.rest_api.services;

import com.api.rest_api.documents.Product;
import com.api.rest_api.documents.ResponseModel;
import com.api.rest_api.repositories.search.SearchRepository;
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
                    productSearchRepository.findAlternativeQuery(p, new String[]{"nombre"},
                            "ASC", "precioActual", new HashMap<>(), 10));
        }
        return responseModel;
    }

    public ResponseModel findBestAlternative(Product product, Optional<String> supermercado) {
        Map<String, String> filters = new HashMap<>();
        if(supermercado.isPresent())
            filters.put("supermercado", supermercado.get());

        ResponseModel res = new ResponseModel();
        res.addFirstHit(productSearchRepository.findAlternativeQuery(product, new String[]{"nombre"},
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
