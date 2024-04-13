package com.api.rest_api.repositories.search.query.executor;

import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.CountRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.helper.Indices;
import org.springframework.beans.factory.annotation.Autowired;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

@Repository
public class QueryExecutorImpl<T> implements QueryExecutor<T> {

    @Autowired
    private ESClientConfig elasticsearchClientConfig;

    @Override
    public SearchResponse<T> executeSearchQuery(Query query, int size, SortOrder sortOrder, String sortBy,
            Map<String, Aggregation> aggs, String indexName, Class<T> documentClass) {
        SearchResponse<T> response;
        try {
            response = elasticsearchClientConfig.getEsClient()
                    .search(getSearchRequest(query, size, sortOrder, sortBy, aggs, indexName), documentClass);
        } catch(IOException e) {
            Logger.getAnonymousLogger().log(new LogRecord(Level.ALL, e.getMessage()));
            throw new RuntimeException(e.getMessage());
        }
        return response;
    }

    private SearchRequest getSearchRequest(Query query, int size, SortOrder sortOrder,
            String sortBy, Map<String, Aggregation> aggs, String indexName) {
        return SearchRequest.of(s -> {
                            s
                                    .index(indexName)
                                    .query(query)
                                    .size(size)
                                    .aggregations(aggs);
                            addSortingOptions(s, sortBy, sortOrder);
                            return s;
                        }
                );
    }

    private CountRequest getCountRequest(Query query, int size, String sortOrder, String sortBy) {
        return CountRequest.of(s -> {
                            s
                                    .index(Indices.LISTAS_INDEX)
                                    .query(query);
                            return s;
                        }
                );
    }

    private void addSortingOptions(SearchRequest.Builder request, String sortBy, SortOrder sortOrder) {
        List<SortOptions> sortOptions = new ArrayList<>();
        if(sortBy != null && !sortBy.isEmpty() && sortOrder!= null) {
            sortOptions.add(new SortOptions.Builder().field(f -> f.field(sortBy).order(sortOrder)).build());
        }
        request.sort(sortOptions);
    }
}
