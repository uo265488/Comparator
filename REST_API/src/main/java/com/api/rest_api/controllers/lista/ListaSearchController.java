package com.api.rest_api.controllers.lista;

import com.api.rest_api.documents.responseModels.LaListaResponseModel;
import com.api.rest_api.services.lista.LaListaSearchService;
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
    private LaListaSearchService service;

    @GetMapping("/findByEmail")
    public ResponseEntity<LaListaResponseModel> findByEmail(@RequestParam("email") Optional<String> email) {
        if(email.isEmpty() || email.get().isBlank())
            return ResponseEntity.badRequest().build();

        System.out.println(email);
        return ResponseEntity.ok(service.getListasByEmail(email.get()));
    }
}
