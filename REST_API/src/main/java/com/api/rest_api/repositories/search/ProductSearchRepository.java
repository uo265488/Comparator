package com.api.rest_api.repositories.search;


import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.aggregations.AggregationBuilders;
import co.elastic.clients.elasticsearch._types.aggregations.AverageAggregation;
import co.elastic.clients.elasticsearch._types.aggregations.TermsAggregation;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.FieldAttr;
import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.Indices;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.AvgAggregationBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

@Repository
public class ProductSearchRepository implements SearchRepository<Product> {

    @Autowired
    private ESClientConfig elasticsearchClientConfig;

    @Autowired
    private QueryFactory queryFactory;

    static final int DEFAULT_QUERY_SIZE = 100;

    @Override
    public SearchResponse<Product> matchAllQuery(String sortOrder, String sortBy, int size) {

        return executeQuery(queryFactory.getMatchAllQuery(), size, sortOrder, sortBy);
    }

    @Override
    public SearchResponse<Product> filterByFieldQuery(String field, Object value) {
        return executeQuery(queryFactory.getFilterQuery(field, value.toString()), DEFAULT_QUERY_SIZE, "ASC", null);
    }

    @Override
    public SearchResponse<Product> filterQuery(Optional<String> nombre, Optional<String> marca, Optional<Double> precio,
                                               Optional<String> supermercado, Optional<String> proveedor,
                                               Optional<String> barcode, Optional<String> fechaDeRegistro) {
        List<Query> filters = new ArrayList<>();

        if (nombre.isPresent())
            filters.add(queryFactory.getLowercaseTermsQuery(FieldAttr.PRODUCT_NAME, nombre.get()));
        if (marca.isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_BRAND, marca.get()));
        if (precio.isPresent())
            filters.add(queryFactory.getTermsQuery(FieldAttr.PRODUCT_PRICES, precio.get()));
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
    public SearchResponse<Product> findAlternativeQuery(Product product, String[] fields, String sortOrder, String sortBy,
                                                        Map<String, String> filters, int size) {
        List<Query> queries = new ArrayList<>();
        queries.add(queryFactory.getMoreLikeThisQuery(product, fields));
        if(!filters.isEmpty())
            filters.forEach((key, value) -> queries.add(queryFactory.getTermsQuery(key, value)));

        return executeQuery(queryFactory.getBoolQuery(queries), size, sortOrder, sortBy);
    }

    @Override
    public SearchResponse<Product> getMostUpdated() {
        return executeQuery(null, 1, "DESC",
                "doc['fechas_de_registro'].size() > 0 ? doc['fechas_de_registro'][doc['fechas_de_registro'].size() - 1] : null");
    }

    @Override
    public SearchResponse<Product> getAllMarcas() {
        Aggregation genres = TermsAggregation.of(t -> t.field("marca").size(100))._toAggregation();
        Map<String, Aggregation> aggs = new HashMap<String, Aggregation>();
        aggs.put("marcas", genres);

        SearchResponse<Product> response = null;

        return executeQuery(queryFactory.getMatchAllQuery(), 1000, "", "", aggs);
    }

    @Override
    public SearchResponse<Product> getAveragePricesBySupermercado() {
        Aggregation averagePrice = AverageAggregation.of(a -> a.field("precioActual"))._toAggregation();

        Aggregation terms = new Aggregation.Builder()
                .terms(new TermsAggregation.Builder().field("supermercado").build())
                .aggregations(new HashMap<>() {{
                    put("avg_price", averagePrice);
                }}).build();

        Map<String, Aggregation> aggs = new HashMap<>();
        aggs.put("terms_supermercado", terms);

        return executeQuery(queryFactory.getMatchAllQuery(), 0, "", "", aggs);
    }


    @Override
    public SearchResponse<Product> executeQuery(Query query, int size, String sortOrder, String sortBy,
                                                Map<String, Aggregation> aggs) {
        SearchResponse response;
        try {
            response = elasticsearchClientConfig.getEsClient()
                    .search(getSearchRequest(query, size, sortOrder, sortBy, aggs), Object.class);
        } catch(IOException e) {
            Logger.getAnonymousLogger().log(new LogRecord(Level.ALL, e.getMessage()));
            throw new RuntimeException(e.getMessage());
        }
        return response;
    }

    @Override
    public SearchResponse<Product> executeQuery(Query query, int size, String sortOrder, String sortBy) {
        SearchResponse<Product> response;
        try {
            response = elasticsearchClientConfig.getEsClient()
                    .search(getSearchRequest(query, size, sortOrder, sortBy), Product.class);
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
        SearchRequest request =
                SearchRequest.of(s -> {
                            s
                                    .index(Indices.PRODUCT_INDEX)
                                    .query(query)
                                    .size(size);
                            addSortingOptions(s, sortBy, sortOrder);
                            //.aggregations(getAggregations())
                            return s;
                        }
                );
        return request;
    }

    /**
     * Creates a sorted Search Request
     * @param query
     * @param size
     * @param sortOrder
     * @param sortBy
     * @return
     */
    private SearchRequest getSearchRequest(Query query, int size, String sortOrder, String sortBy, Map<String, Aggregation> aggs) {
        SearchRequest request =
                SearchRequest.of(s -> {
                            s
                                    .index(Indices.PRODUCT_INDEX)
                                    .query(query)
                                    .size(size)
                                    .aggregations(aggs);
                            addSortingOptions(s, sortBy, sortOrder);
                            return s;
                        }
                );
        return request;
    }

    private void addSortingOptions(SearchRequest.Builder request, String sortBy, String sortOrder) {
        List<SortOptions> sortOptions = new ArrayList<>();
        if(sortBy != null && !sortBy.isBlank() && sortOrder != null && sortOrder.equals("ASC")) {
            sortOptions.add(new SortOptions.Builder().field(f -> f.field(sortBy)
                    .order(co.elastic.clients.elasticsearch._types.SortOrder.Asc)).build());
        } else if(sortBy != null && !sortBy.isBlank() && sortOrder != null && sortOrder.equals("DESC")) {
            sortOptions.add(new SortOptions.Builder().field(f -> f.field(sortBy)
                    .order(SortOrder.Desc)).build());
        }
        request.sort(sortOptions);
    }


}
