package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.Indices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

@Repository
public class ProductSearchRepository implements SearchRepository<Product> {

    @Autowired
    private ESClientConfig elasticsearchClientConfig;

    @Autowired
    private QueryFactory queryFactory;

    private static final int DEFAULT_QUERY_SIZE = 100;

    @Override
    public SearchResponse matchAllQuery() {
        return executeQuery(queryFactory.matchAllQuery(), DEFAULT_QUERY_SIZE, "ASC", null);
    }

    @Override
    public SearchResponse executeQuery(Query query, int size, String sortOrder, String sortBy) {
        SearchResponse response;
        try {
            response = elasticsearchClientConfig.getEsClient()
                    .search(getSearchRequest(query, size, sortOrder, sortBy), Object.class);
        } catch(IOException e) {
            Logger.getAnonymousLogger().log(new LogRecord(Level.ALL, e.getMessage()));
            throw new RuntimeException(e.getMessage());
        }
        return response;
    }

    /**
     * Creates a sorted Search Request
     * @param query
     * @param size
     * @param sortOrder
     * @param sortBy
     * @return
     */
    private SearchRequest getSearchRequest(Query query, int size, String sortOrder, String sortBy) {
        return SearchRequest.of(s -> s
                .index(Indices.PRODUCT_INDEX)
                .query(query)
                .size(size)
                //.aggregations(getAggregations())
                //.sort(getSortOptions(sortOrder, sortBy))
        );
    }

}
