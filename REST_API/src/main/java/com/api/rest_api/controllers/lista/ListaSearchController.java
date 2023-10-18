package com.api.rest_api.controllers.lista;

import com.api.rest_api.documents.ListaResponseModel;
import com.api.rest_api.services.lista.ListaSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Controller
@RequestMapping("/search/listas")
public class ListaSearchController {

    @Autowired
    private ListaSearchService service;

    @GetMapping("/findByAutor")
    public ResponseEntity<ListaResponseModel> findByAutor(@RequestParam("autor") Optional<String> autor) {
        if(autor.isEmpty())
            return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(service.getListasByAutor(autor.get()));
    }
}
