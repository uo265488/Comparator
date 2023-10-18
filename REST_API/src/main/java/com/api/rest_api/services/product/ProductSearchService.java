package com.api.rest_api.services.product;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.Product;
import com.api.rest_api.documents.ProductResponseModel;
import com.api.rest_api.helper.parser.ProductParser;
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

    public ProductResponseModel matchAllQuery() {
        return new ProductResponseModel(productSearchRepository.matchAllQuery("ASC", "supermercado", 1000));
    }


    public ProductResponseModel filterBy(String field, Object value) {

        return new ProductResponseModel(productSearchRepository.filterByFieldQuery(field, value));
    }

    public ProductResponseModel basicFiltering(Optional<String> nombre, Optional<String> marca,
                                               Optional<String> supermercado, Optional<String> proveedor,
                                               Optional<String> barcode) {

        return new ProductResponseModel(productSearchRepository.filterQuery(nombre, marca, Optional.empty(),
                supermercado, proveedor, barcode, Optional.empty()));
    }

    public ProductResponseModel optimizeList(List<Product> laLista) {
        ProductResponseModel responseModel = new ProductResponseModel();

        for(Product p : laLista) {
            responseModel.addFirstHit(
                    productSearchRepository.findAlternativeQuery(p, new String[]{"nombre"},
                            "ASC", "precioActual", new HashMap<>(), 10));
        }
        return responseModel;
    }

    public ProductResponseModel findBestAlternative(Product product, Optional<String> supermercado, Optional<String> marca) {
        Map<String, String> filters = new HashMap<>();
        if(supermercado.isPresent())
            filters.put("supermercado", supermercado.get());

        if(marca.isPresent())
            filters.put("marca", marca.get());

        ProductResponseModel res = new ProductResponseModel();
        res.addFirstHit(productSearchRepository.findAlternativeQuery(product, new String[]{"nombre"},
                "ASC", "precioActual", filters, 10));

        return res;
    }

    public ProductResponseModel findProductByBarcode(String barcode) {
        ProductResponseModel responseModel = new ProductResponseModel();
        responseModel.addHits(
                productSearchRepository.filterByFieldQuery("barcode", barcode));
        return responseModel;
    }

    public ProductResponseModel getMostUpdated() {
        return new ProductResponseModel(productSearchRepository.getMostUpdated());
    }

    public ProductResponseModel getAllMarcas() {
        ProductResponseModel responseModel = new ProductResponseModel();
        responseModel.addStermsAggregations(productSearchRepository.getAllMarcas(), "marcas");

        return responseModel;
    }

    public ProductResponseModel mostRecentUpdate() {
        return new ProductResponseModel(
                productSearchRepository.matchAllQuery("DESC", "fechas_de_registro",  1));
    }

    public SearchResponse<Product> getAveragePricesBySupermercado() {
        return productSearchRepository.getAveragePricesBySupermercado();
    }

    public Map<String, Map<String, Double>> getAvgPricePerMonthBySupermercado() {
        return ProductParser.searchResponseToStatistic(
                productSearchRepository.matchAllQuery("", "", 10000));
    }
}
