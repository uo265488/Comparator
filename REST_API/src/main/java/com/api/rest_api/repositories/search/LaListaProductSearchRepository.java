package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.domain.LaListaProduct;
import com.api.rest_api.helper.Indices;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import com.api.rest_api.repositories.search.query.executor.QueryExecutor;
import com.api.rest_api.repositories.search.query.factory.QueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;

import static com.api.rest_api.repositories.search.ProductSearchRepository.DEFAULT_QUERY_SIZE;

@Repository
public class LaListaProductSearchRepository implements SearchRepository<LaListaProduct> {

    @Autowired
    private QueryFactory queryFactory;

    @Autowired
    private QueryExecutor<LaListaProduct> queryExecutor;

    @Override
    public SearchResponse<LaListaProduct> filterByFieldQuery(String field, Object value) {
        return queryExecutor.executeSearchQuery(queryFactory.getFilterQuery(field, value.toString()),
                DEFAULT_QUERY_SIZE, SortOrder.Asc, null, Map.of(), Indices.LALISTA_PRODUCT_INDEX, LaListaProduct.class);
    }

    @Override
    public SearchResponse<LaListaProduct> filterQuery(Optional<String> nombre, Optional<String> marca,
                                                      Optional<Double> precio, Optional<String> supermercado,
                                                      Optional<String> proveedor, Optional<String> barcode,
                                                      Optional<String> fechaDeRegistro) {
        throw new NotYetImplementedException();
    }


    @Override
    public SearchResponse<LaListaProduct> getMostUpdated() {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaListaProduct> getAllMarcas() {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaListaProduct> getMostFrequentlyUpdated() {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaListaProduct> getAveragePricesBySupermercado() {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaListaProduct> matchAllQuery(SortOrder sortOrder, String sortBy, int size) {
        throw new NotYetImplementedException();
    }
    @Override
    public SearchResponse<LaListaProduct> findAlternativeQuery(LaListaProduct Document, String[] fields, SortOrder sortOrder, String sortBy, Map<String, String> filters, int size) {
        throw new NotYetImplementedException();
    }
}
