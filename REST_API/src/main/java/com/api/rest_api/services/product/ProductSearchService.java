package com.api.rest_api.services.product;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.documents.responseModels.ProductResponseModel;
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
    private SearchRepository<Product> productSearchRepository;

    public ProductResponseModel findAll() {
        return new ProductResponseModel(productSearchRepository.matchAllQuery(
                SortOrder.Asc,
                "supermercado",
                1000));
    }

    public Product findById(String id) {
        SearchResponse<Product> response = productSearchRepository.filterByFieldQuery("_id", id);

        if (!response.hits().hits().isEmpty()) {
            return response.hits().hits().get(0).source();
        }
        return null;
    }

    public ProductResponseModel filter(Optional<String> nombre, Optional<String> marca,
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
                            SortOrder.Asc, "precioActual", new HashMap<>(), 10));
        }
        return responseModel;
    }

    public ProductResponseModel findBestAlternative(Product product, Optional<String> supermercado, Optional<String> marca) {
        Map<String, String> filters = new HashMap<>();

        supermercado.ifPresent(s -> filters.put("supermercado", s));
        marca.ifPresent(s -> filters.put("marca", s));

        ProductResponseModel res = new ProductResponseModel();
        res.addFirstHit(productSearchRepository.findAlternativeQuery(product, new String[]{"nombre"},
                SortOrder.Asc, "precioActual", filters, 10));

        return res;
    }

    public Product findByBarcode(String barcode) {
        return productSearchRepository.filterByFieldQuery("barcode", barcode).hits().hits().get(0).source();
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
                productSearchRepository.matchAllQuery(SortOrder.Asc, "fechas_de_registro",  1));
    }

    public ProductResponseModel getMostFrecuentlyUpdated() {
        SearchResponse<Product> response = productSearchRepository.getMostFrequentlyUpdated();
        ProductResponseModel productResponseModel = new ProductResponseModel(response);
        productResponseModel.addStermsAggregations(response, "products_with_most_dates");

        return new ProductResponseModel(
                productResponseModel.getHits().stream().filter(
                        hit -> productResponseModel.getAggregations().get("products_with_most_dates")
                                .contains(hit.getBarcode())
                ).toList());
    }

    public SearchResponse<Product> getAveragePricesBySupermercado() {
        return productSearchRepository.getAveragePricesBySupermercado();
    }

    public Map<String, Map<String, Double>> getAvgPricePerMonthBySupermercado() {
        return ProductParser.searchResponseToStatistic(
                productSearchRepository.matchAllQuery(SortOrder.Asc, "", 10000));
    }

    public ProductResponseModel compareProduct(Product product) {
        return new ProductResponseModel(productSearchRepository.findAlternativeQuery(product, new String[]{"nombre"},
                SortOrder.Asc, "", new HashMap<>(), 5));
    }
}
