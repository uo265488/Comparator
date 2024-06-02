package com.api.rest_api.controllers.laLista;

import com.api.rest_api.documents.responseModels.LaListaResponseModel;
import com.api.rest_api.services.laLista.LaListaSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("api/v1/listas/search")
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
