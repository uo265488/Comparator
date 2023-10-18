package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;

import java.util.Map;
import java.util.Optional;

public interface SearchRepository<Document> {

    /**
     * Performs a MatchAll query
     */
    SearchResponse<Document> matchAllQuery(String sortOrder, String sortBy, int size);

    /**
     * Performs a filter query
     * @param field
     * @param value
     * @return
     */
    SearchResponse<Document> filterByFieldQuery(String field, Object value);

    /**
     * Aggregations of prices by supermercado
     * @return
     */
    SearchResponse<Document> getAveragePricesBySupermercado();

    /**
     * Query executor
     * @param query
     * @return List<Hit<Document>>
     */
    SearchResponse<Document> executeQuery(Query query, int size, String ordering, String orderBy);

    /**
     * Query executor
     * @param query
     * @return List<Hit<Document>>
     */

    SearchResponse<Document> executeQuery(Query query, int size, String sortOrder, String sortBy,
                                          Map<String, Aggregation> aggs);


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
    SearchResponse<Document> filterQuery(Optional<String> nombre, Optional<String> marca,
                                         Optional<Double> precio, Optional<String> supermercado,
                                         Optional<String> proveedor, Optional<String> barcode,
                                         Optional<String> fechaDeRegistro);

    /**
     * Performs the moreLikeThisQuery over the List of Documents given and the list of fields
     * @param Documents
     * @param fields
     * @return
     */
    SearchResponse<Document> findAlternativeQuery(Document Document, String[] fields,
                                                  String sortOrder, String sortBy,
                                                  Map<String, String> filters, int size);

    /**
     * Returns the Document with the highest number of updates
     * @return
     */
    SearchResponse<Document> getMostUpdated();


    /**
     * Devuelve las marcas existentes en la base de datos
     * @return
     */
    SearchResponse<Document> getAllMarcas();

}