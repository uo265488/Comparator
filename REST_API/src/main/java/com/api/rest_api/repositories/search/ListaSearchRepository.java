package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.Lista;
import com.api.rest_api.helper.Indices;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import static com.api.rest_api.repositories.search.ProductSearchRepository.DEFAULT_QUERY_SIZE;

@Repository
public class ListaSearchRepository implements SearchRepository<Lista> {

    @Autowired
    private ESClientConfig elasticsearchClientConfig;

    @Autowired
    private QueryFactory queryFactory;

    @Override
    public SearchResponse<Lista> filterByFieldQuery(String field, Object value) {
        return executeQuery(queryFactory.getFilterQuery(field, value.toString()), DEFAULT_QUERY_SIZE, "ASC", null);
    }
    @Override
    public SearchResponse<Lista> executeQuery(Query query, int size, String sortOrder, String sortBy, Map<String, Aggregation> aggs) {
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
        SearchRequest request =
                SearchRequest.of(s -> {
                            s
                                    .index(Indices.PRODUCT_INDEX)
                                    .query(query)
                                    .size(size);
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
    @Override
    public SearchResponse<Lista> filterQuery(Optional<String> nombre, Optional<String> marca, Optional<Double> precio, Optional<String> supermercado, Optional<String> proveedor, Optional<String> barcode, Optional<String> fechaDeRegistro) {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<Lista> findAlternativeQuery(Lista Document, String[] fields, String sortOrder, String sortBy, Map<String, String> filters, int size) {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<Lista> getMostUpdated() {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<Lista> getAllMarcas() {
        throw new NotYetImplementedException();
    }
    @Override
    public SearchResponse<Lista> getAveragePricesBySupermercado() {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<Lista> executeQuery(Query query, int size, String ordering, String orderBy) {
        throw new NotYetImplementedException();
    }
    @Override
    public SearchResponse<Lista> matchAllQuery(String sortOrder, String sortBy, int size) {
        throw new NotYetImplementedException();
    }

}
