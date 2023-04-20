package com.api.rest_api.repositories.update;

import co.elastic.clients.elasticsearch.core.UpdateResponse;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdateRepository<Document> {

    /**
     * Method   signature for updating a document in Elastic
     * @param document
     * @return
     */
    UpdateResponse<Document> update(Document document);
}
