package com.api.rest_api.services.laListaProduct;

import co.elastic.clients.elasticsearch.core.BulkResponse;
import com.api.rest_api.documents.domain.LaListaProduct;
import com.api.rest_api.repositories.index.IndexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaListaProductIndexService {

    @Autowired
    private IndexRepository<LaListaProduct> laListaProductIndexRepository;

    public boolean indexLaListaProducts(String id, List<LaListaProduct> productos) {

        productos.stream().forEach(p -> p.setListaId(id));

        BulkResponse productsResponse = laListaProductIndexRepository.synchronousBulkIndexing(productos);

        return !productsResponse.errors();
    }

    public boolean createIndex() {
        return laListaProductIndexRepository.createIndex();
    }
}
