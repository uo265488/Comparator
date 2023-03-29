package com.api.rest_api.documents;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import lombok.Value;

import java.util.ArrayList;
import java.util.List;

@Value
public class ResponseModel {

    List<Object> hits;

    public ResponseModel(SearchResponse<Product> response) {
        //Hits
        this.hits = new ArrayList<>();
        response.hits().hits().forEach(h -> this.hits.add(h.source()));
    }

    /**
     * Adds the List to the hits
     * @param  response
     */
    public void addHits(SearchResponse<Product> response) {
        response.hits().hits().forEach(h ->
        {
            if(!this.hits.contains(h)) hits.add(h);
        });
    }

}
