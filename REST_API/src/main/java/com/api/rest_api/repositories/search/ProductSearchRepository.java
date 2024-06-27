package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.aggregations.AverageAggregation;
import co.elastic.clients.elasticsearch._types.aggregations.TermsAggregation;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.fieldAttrs.ProductsFieldAttr;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.helper.Indices;
import com.api.rest_api.repositories.search.query.executor.QueryExecutor;
import com.api.rest_api.repositories.search.query.factory.QueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class ProductSearchRepository implements SearchRepository<Product> {

    @Autowired
    private QueryFactory queryFactory;

    @Autowired
    private QueryExecutor<Product> queryExecutor;

    static final int DEFAULT_QUERY_SIZE = 100;

    @Override
    public SearchResponse<Product> matchAllQuery(SortOrder sortOrder, String sortBy, int size) {

        return queryExecutor.executeSearchQuery(
                queryFactory.getMatchAllQuery(), size, sortOrder, sortBy, Map.of(), Indices.PRODUCT_INDEX, Product.class);
    }

    @Override
    public SearchResponse<Product> filterByFieldQuery(String field, Object value) {
        return queryExecutor.executeSearchQuery(
                queryFactory.getFilterQuery(field, value.toString()), DEFAULT_QUERY_SIZE, SortOrder.Asc, null,
                    Map.of(), Indices.PRODUCT_INDEX, Product.class);
    }

    @Override
    public SearchResponse<Product> filterQuery(Optional<String> nombre, Optional<String> marca, Optional<Double> precio,
                                               Optional<String> supermercado, Optional<String> proveedor,
                                               Optional<String> barcode, Optional<String> fechaDeRegistro) {
        List<Query> filters = new ArrayList<>();

        nombre.ifPresent(s -> filters.add(queryFactory.getLowercaseTermsQuery(ProductsFieldAttr.PRODUCT_NAME, s)));
        marca.ifPresent(s -> filters.add(queryFactory.getTermsQuery(ProductsFieldAttr.PRODUCT_BRAND, s)));
        precio.ifPresent(aDouble -> filters.add(queryFactory.getTermsQuery(ProductsFieldAttr.PRODUCT_PRICES, aDouble)));
        supermercado.ifPresent(s -> filters.add(queryFactory.getTermsQuery(ProductsFieldAttr.PRODUCT_SUPERMARKET, s)));
        proveedor.ifPresent(s -> filters.add(queryFactory.getTermsQuery(ProductsFieldAttr.PRODUCT_PROVIDER, s)));
        barcode.ifPresent(s -> filters.add(queryFactory.getTermsQuery(ProductsFieldAttr.PRODUCT_BARCODE, s)));
        fechaDeRegistro.ifPresent(s -> filters.add(queryFactory.getTermsQuery(ProductsFieldAttr.PRODUCT_DATE, s)));

        return queryExecutor.executeSearchQuery(
                queryFactory.getMustQuery(filters), DEFAULT_QUERY_SIZE, SortOrder.Asc, null, Map.of(), Indices.PRODUCT_INDEX, Product.class);
    }

    @Override
    public SearchResponse<Product> findAlternativeQuery(Product product, String[] fields, SortOrder sortOrder, String sortBy,
                                                        Map<String, String> filters, int size) {
        List<Query> queries = new ArrayList<>();
        queries.add(queryFactory.getMoreLikeThisQuery(product, fields));
        if(!filters.isEmpty())
            filters.forEach((key, value) -> queries.add(queryFactory.getTermsQuery(key, value)));

        return queryExecutor.executeSearchQuery(
                queryFactory.getBoolQuery(queries), size, sortOrder, sortBy, Map.of(), Indices.PRODUCT_INDEX, Product.class);
    }

    @Override
    public SearchResponse<Product> getMostUpdated() {
        return queryExecutor.executeSearchQuery(null, 1, SortOrder.Desc,
                "doc['fechas_de_registro'].size() > 0 ? doc['fechas_de_registro'][doc['fechas_de_registro'].size() - 1] : null",
                Map.of(), Indices.PRODUCT_INDEX, Product.class);
    }

    @Override
    public SearchResponse<Product> getAllMarcas() {
        Aggregation genres = TermsAggregation.of(t -> t.field("marca").size(100))._toAggregation();
        Map<String, Aggregation> aggs = new HashMap<String, Aggregation>();
        aggs.put("marcas", genres);

        return queryExecutor.executeSearchQuery(
                queryFactory.getMatchAllQuery(), 1000, SortOrder.Asc, "nombre", aggs, Indices.PRODUCT_INDEX, Product.class);
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

        return queryExecutor.executeSearchQuery(
                queryFactory.getMatchAllQuery(), 0, null, null, aggs, Indices.PRODUCT_INDEX, Product.class);
    }

}
