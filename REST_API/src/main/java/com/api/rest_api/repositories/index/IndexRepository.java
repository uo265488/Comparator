package com.api.rest_api.repositories.index;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndexRepository<Document> {

    /**
     * Creates an index
     * @return acknowledge
     */
    boolean createIndex();

    /**
     * Index a document
     * @return version of the document
     */
    IndexResponse indexDocument(Document document);

    /**
     * Performs synchronous bulk indexing
     * @param documentsList
     * @return the documentList
     */
    List<Document> synchronousBulkIndexing(List<Document> documentsList);

    /**
     * Performs asynchronous bulk indexing
     * @param documentsList
     * @return
     */
    List<Document> asynchronousBulkIndexing(List<Document> documentsList);

}
