package com.api.rest_api.services.lista;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.Lista;
import com.api.rest_api.repositories.index.IndexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ListaIndexService {

    @Autowired
    private IndexRepository<Lista> repo;

    public IndexResponse indexDocument(Lista lista) {
        return repo.indexDocument(lista);
    }
    public boolean createIndex() {
        return repo.createIndex();
    }



}
