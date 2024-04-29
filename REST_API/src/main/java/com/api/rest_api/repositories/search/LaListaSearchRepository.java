package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.domain.LaLista;
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
public class LaListaSearchRepository implements SearchRepository<LaLista> {

    @Autowired
    private QueryFactory queryFactory;

    @Autowired
    private QueryExecutor<LaLista> queryExecutor;

    @Override
    public SearchResponse<LaLista> filterByFieldQuery(String field, Object value) {
        return queryExecutor.executeSearchQuery(queryFactory.getFilterQuery(field, value.toString()),
                DEFAULT_QUERY_SIZE, SortOrder.Asc, null, Map.of(), Indices.LISTAS_INDEX, LaLista.class);
    }

    @Override
    public SearchResponse<LaLista> matchAllQuery(SortOrder sortOrder, String sortBy, int size) {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaLista> getAveragePricesBySupermercado() {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaLista> filterQuery(Optional<String> nombre, Optional<String> marca, Optional<Double> precio,
                                               Optional<String> supermercado, Optional<String> proveedor,
                                               Optional<String> barcode, Optional<String> fechaDeRegistro) {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaLista> findAlternativeQuery(LaLista Document, String[] fields, SortOrder sortOrder,
                                                        String sortBy, Map<String, String> filters, int size) {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaLista> getMostUpdated() {
        throw new NotYetImplementedException();
    }

    @Override
    public SearchResponse<LaLista> getAllMarcas() {
        throw new NotYetImplementedException();
    }
}