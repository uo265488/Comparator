package com.api.rest_api.documents.responseModels;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.LaListaProduct;
import com.api.rest_api.helper.parser.ListaParser;
import lombok.Builder;
import lombok.Value;

import java.util.ArrayList;
import java.util.List;

@Builder
@Value
public class ListaResponseModel {

    List<LaListaProduct> hits = new ArrayList<>();

    public ListaResponseModel(SearchResponse<LaListaProduct> response) {
        addHits(response);
    }
    /**
     * Adds the List to the hits
     * @param  response
     */
    public void addHits(SearchResponse<LaListaProduct> response) {
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
