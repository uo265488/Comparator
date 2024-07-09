package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.domain.Product;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface SearchRepository<Document> {

    /**
     * Performs a MatchAll query
     */
    SearchResponse<Document> matchAllQuery(SortOrder sortOrder, String sortBy, int size);

    /**
     * Performs a filter query
     * @param field : document field to filter
     * @param value : value of that field
     * @return SearchResponse
     */
    SearchResponse<Document> filterByFieldQuery(String field, Object value);

    /**
     * Aggregations of prices by supermercado
     * @return
     */
    SearchResponse<Document> getAveragePricesBySupermercado();

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
     * Returns an improved alternative for a document
     * @param Document
     * @param fields
     * @param sortOrder
     * @param sortBy
     * @param filters
     * @param size
     * @return
     */
    SearchResponse<Document> findAlternativeQuery(Document Document, String[] fields,
                                                  SortOrder sortOrder, String sortBy,
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

    /**
     * Returns the documents with higher number of price updates
     * @return
     */
    SearchResponse<Document> getMostFrequentlyUpdated();
}