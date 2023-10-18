package com.api.rest_api.documents;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.helper.parser.ListaParser;
import lombok.Value;

import java.util.ArrayList;
import java.util.List;

@Value
public class ListaResponseModel {

    List<Lista> hits = new ArrayList<>();

    public ListaResponseModel(SearchResponse<Lista> response) {
        addHits(response);
    }
    /**
     * Adds the List to the hits
     * @param  response
     */
    public void addHits(SearchResponse<Lista> response) {
        response.hits().hits().forEach(h ->
        {
            if(!this.hits.contains(h)) {
                hits.add(ListaParser.mapToLista(h.source()));

            }
        });
    }
    @Override
    public String toString() {
        if(hits.isEmpty())
            return "No product found";
        return hits.stream().map(h -> h.toString()).reduce((h, h1) -> h + " " + h1).get();
    }

}
