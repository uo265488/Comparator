package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;

public interface SearchRepository<Document> {

    /**
     * Performs a MatchAll query
     */
    SearchResponse matchAllQuery();

    /**
     * Query executor
     * @param query
     * @return List<Hit<Document>>
     */
    SearchResponse executeQuery(Query query, int size, String ordering, String orderBy);
}