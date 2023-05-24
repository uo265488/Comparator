package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.Product;

import java.util.List;

import java.util.Map;
import java.util.Optional;

public interface SearchRepository<Document> {

    /**
     * Performs a MatchAll query
     */
    SearchResponse<Product> matchAllQuery();

    /**
     * Performs a filter query
     * @param field
     * @param value
     * @return
     */
    SearchResponse<Product> filterByFieldQuery(String field, Object value);

    /**
     * Query executor
     * @param query
     * @return List<Hit<Document>>
     */
    SearchResponse<Product> executeQuery(Query query, int size, String ordering, String orderBy);


    /**
     * Filters byf everything
     * @param nombre
     * @param marca
     * @param precio
     * @param supermercado
     * @param proveedor
     * @param barcode
     * @param fechaDeRegistro
     * @return
     */
    SearchResponse<Product> filterQuery(Optional<String> nombre, Optional<String> marca,
                                               Optional<Double> precio, Optional<String> supermercado,
                                               Optional<String> proveedor, Optional<String> barcode,
                                               Optional<String> fechaDeRegistro);

    /**
     * Performs the moreLikeThisQuery over the List of products given and the list of fields
     * @param products
     * @param fields
     * @return
     */
    SearchResponse<Product> moreLikeThisQuery(Product product, String[] fields,
                                                    String sortOrder, String sortBy,
                                                    Map<String, String> filters, int size);


}