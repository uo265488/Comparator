package com.api.rest_api.services.laLista;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.domain.LaLista;
import com.api.rest_api.repositories.index.LaListaIndexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class LaListaIndexService {

    @Autowired
    private LaListaIndexRepository laListaIndexRepository;

    public IndexResponse indexLista(String email, String listName, double precioTotal) {

        return laListaIndexRepository.indexDocument(LaLista.builder()
                .name(listName)
                .email(email)
                .date(LocalDate.now().toString())
                .precioTotal(precioTotal)
                .build());
    }

    public boolean createIndex() {
        return laListaIndexRepository.createIndex();
    }

}
