package com.api.rest_api.controllers.lista;

import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.Lista;
import com.api.rest_api.services.lista.ListaIndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/index/listas")
public class ListaIndexController {

    @Autowired
    private ListaIndexService listaIndexService;

    @PostMapping("/createIndex")
    public ResponseEntity createIndex() {

        return listaIndexService.createIndex()
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/add")
    public ResponseEntity addLista(@RequestBody Lista lista) {
        IndexResponse response = listaIndexService.indexDocument(lista);

        return response.result().equals(Result.Created)
                ? ResponseEntity.ok(response.version())
                : ResponseEntity.status(HttpStatus.CONFLICT).build();
    }


}
