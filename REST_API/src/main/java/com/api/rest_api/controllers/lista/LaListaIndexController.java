package com.api.rest_api.controllers.lista;

import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.requestModels.AddListaRequest;
import com.api.rest_api.services.laListaProduct.LaListaProductIndexService;
import com.api.rest_api.services.lista.LaListaIndexService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/v1/listas")
public class LaListaIndexController {

    @Autowired
    private LaListaIndexService laListaIndexService;

    @Autowired
    private LaListaProductIndexService laListaProductIndexService;

    @GetMapping("/create-index")
    public ResponseEntity<Boolean> createIndices() {

        final boolean isIndexCreated = laListaIndexService.createIndex();

        return  isIndexCreated && laListaProductIndexService.createIndex()
                ? ResponseEntity.status(HttpStatus.CREATED).build()
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping
    public ResponseEntity<Boolean> createLista(@RequestBody AddListaRequest request) {
        //Check list exists

        IndexResponse indexResponse = laListaIndexService.indexLista(request.getEmail(), request.getListName());
        if (indexResponse.result().equals(Result.Created)) {
            return laListaProductIndexService.indexLaListaProducts(indexResponse.id(), request.getProductList())
                    ? ResponseEntity.status(HttpStatus.CREATED).build()
                    : ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
