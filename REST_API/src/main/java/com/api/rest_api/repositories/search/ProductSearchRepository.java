package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.FieldAttr;
import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.Indices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
        return executeQuery(queryFactory.getMatchAllQuery(), DEFAULT_QUERY_SIZE, "ASC", null);
    }

    @Override
    public SearchResponse filterByFieldQuery(String field, Object value) {
        return executeQuery(queryFactory.getFilterQuery(field, value.toString()), DEFAULT_QUERY_SIZE, "ASC", null);
    }

    @Override
    public SearchResponse<Product> filterQuery(Optional<String> nombre, Optional<String> marca, Optional<Double> precio,
                                               Optional<String> supermercado, Optional<String> proveedor,
                                               Optional<String> barcode, Optional<String> fechaDeRegistro) {
        List<Query> filters = new ArrayList<>();

        if (nombre.isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_NAME, nombre.get()));
        if (marca.isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_BRAND, marca.get()));
        if (precio.isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_PRICE, precio.get()));
        if (supermercado.isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_SUPERMARKET, supermercado.get()));
        if (proveedor.isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_PROVIDER, proveedor.get()));
        if (barcode.isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_BARCODE, barcode.get()));
        if(fechaDeRegistro. isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_DATE, fechaDeRegistro.get()));

        return executeQuery(queryFactory.getMustQuery(filters), DEFAULT_QUERY_SIZE, "ASC", null);
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
