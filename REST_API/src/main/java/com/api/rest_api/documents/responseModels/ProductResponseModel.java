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

    public ProductResponseModel() {
    }

    public ProductResponseModel(SearchResponse res, String name) {
        addStermsAggregations(res, name);
    }

    /**
     * Adds the List to the hits
     * @param  response
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
        if(response.hits().hits().size() > 0)
            this.hits.add(ProductParser.mapToProduct(response.hits().hits().get(0).source()));
    }

    @Override
    public String toString() {
        if(hits.isEmpty())
            return "No product found";
        return hits.stream().map(h -> h.toString()).reduce((h, h1) -> h + " " + h1).get();
    }

    public void addStermsAggregations(SearchResponse res, String name) {
        if(res.aggregations().size() > 0) {
            Aggregate marcasAgg = (Aggregate) res.aggregations().get(name);
            List list = new ArrayList();

            marcasAgg.sterms().buckets().array().forEach(bucket -> {
                list.add(bucket.key()._get());
            });

            aggregations.put(name, list);
        }
    }


}
