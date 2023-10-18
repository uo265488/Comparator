package com.api.rest_api.services.lista;

import com.api.rest_api.documents.ListaResponseModel;
import com.api.rest_api.repositories.search.ListaSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ListaSearchService {

    @Autowired
    private ListaSearchRepository repo;

    public ListaResponseModel getListasByAutor(String autor) {
        //exists autor

        System.out.println(repo.filterByFieldQuery("autor", autor));
        return new ListaResponseModel(repo.filterByFieldQuery("autor", autor));
    }

}
