package com.api.rest_api.controllers.lista;

import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.LaListaProduct;
import com.api.rest_api.services.laListaProduct.LaListaProductIndexService;
import com.api.rest_api.services.lista.ListaIndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/index/listas")
public class ListaIndexController {

    @Autowired
    private ListaIndexService listaIndexService;

    @Autowired
    private LaListaProductIndexService laListaProductIndexService;

    @GetMapping("/createIndex")
    public ResponseEntity createIndices() {

        return listaIndexService.createIndex() && laListaProductIndexService.createIndex()
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/add")
    public ResponseEntity addLista(@RequestBody List<LaListaProduct> productList,
                                   @RequestBody String email,
                                   @RequestBody String listName) {
        //Check list exists
        IndexResponse indexResponse = listaIndexService.indexLista(email, listName);
        if (indexResponse.result().equals(Result.Created)) {
            return laListaProductIndexService.indexLaListaProducts(indexResponse.id(), productList)
                    ? ResponseEntity.ok(HttpStatus.CREATED)
                    : ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
