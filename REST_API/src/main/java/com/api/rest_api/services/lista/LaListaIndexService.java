package com.api.rest_api.services.lista;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.Lista;
import com.api.rest_api.repositories.index.LaListaProductIndexRepository;
import com.api.rest_api.repositories.index.ListaIndexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class LaListaIndexService {

    @Autowired
    private ListaIndexRepository listaIndexRepository;

    @Autowired
    private LaListaProductIndexRepository laListaProductIndexRepository;

    public IndexResponse indexLista(String email, String listName) {

        return listaIndexRepository.indexDocument(Lista.builder()
                .name(listName)
                .email(email)
                .date(LocalDate.now().toString())
                .build());
    }

    public boolean createIndex() {
        return listaIndexRepository.createIndex();
    }

}
