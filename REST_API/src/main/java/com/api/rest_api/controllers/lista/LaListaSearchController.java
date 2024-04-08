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
@RequestMapping("api/v1/search/listas")
public class LaListaSearchController {

    @Autowired
    private LaListaSearchService laListaSearchService;

    @GetMapping
    public ResponseEntity<LaListaResponseModel> findByEmail(@RequestParam("email") String email) {
        if(email == null || email.isEmpty() || email.isBlank())
            return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(laListaSearchService.getListasByEmail(email));
    }
}
