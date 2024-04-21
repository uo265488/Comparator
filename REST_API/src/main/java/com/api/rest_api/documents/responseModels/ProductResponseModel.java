package com.api.rest_api.documents.responseModels;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.helper.parser.ProductParser;
import lombok.Value;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Value
public class ProductResponseModel {

    List<Product> hits = new ArrayList<>();
    Map<String, List> aggregations = new HashMap<>();

    public ProductResponseModel(SearchResponse<Product> response) {
        addHits(response);
    }

    //For testing purposes
    public ProductResponseModel(List<Product> hits) {
        this.hits.addAll(hits);
    }

    public ProductResponseModel() { }

    /**
     * Adds the List to the hits
     */
    public void addHits(SearchResponse<Product> response) {
        response.hits().hits().forEach(h ->
        {
            if(!this.hits.contains(h)) {
                hits.add(ProductParser.mapToProduct(h.source()));
            }
        });
    }
    public void addFirstHit(SearchResponse<Product> response) {
        if(!response.hits().hits().isEmpty())
            this.hits.add(ProductParser.mapToProduct(response.hits().hits().get(0).source()));
    }

    @Override
    public String toString() {
        if(hits.isEmpty())
            return "No product found";
        return hits.stream().map(h -> h.toString()).reduce((h, h1) -> h + " " + h1).get();
    }

    public void addStermsAggregations(SearchResponse res, String name) {
        if(!res.aggregations().isEmpty()) {
            Aggregate marcasAgg = (Aggregate) res.aggregations().get(name);
            List list = new ArrayList();

            marcasAgg.sterms().buckets().array().forEach(bucket -> {
                list.add(bucket.key()._get());
            });

            aggregations.put(name, list);
        }
    }


}
