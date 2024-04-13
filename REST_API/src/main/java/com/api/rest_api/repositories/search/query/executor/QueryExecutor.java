package com.api.rest_api.repositories.search.query.executor;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface QueryExecutor<T> {

    SearchResponse<T> executeSearchQuery(Query query, int size, SortOrder sortOrder, String sortBy,
            Map<String, Aggregation> aggs, String indexName, Class<T> documentClass);

}
