package com.api.rest_api.documents;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.helper.parser.ProductParser;
import lombok.Value;

import java.util.ArrayList;
import java.util.List;

@Value
public class ResponseModel {

    List<Product> hits;

    public ResponseModel(SearchResponse<Product> response) {
        //Hits
        this.hits = new ArrayList<>();
        addHits(response);
    }

    public ResponseModel() {
        //Hits
        this.hits = new ArrayList<>();
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

}
