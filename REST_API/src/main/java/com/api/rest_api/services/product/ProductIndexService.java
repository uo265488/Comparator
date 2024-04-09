package com.api.rest_api.services.product;

import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import com.api.rest_api.helper.parser.ProductParser;
import com.api.rest_api.repositories.delete.DeleteRepository;
import com.api.rest_api.repositories.index.IndexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductIndexService {

    @Autowired
    private IndexRepository<Product> indexingRepository;

    @Autowired
    private DeleteRepository<Product> deleteRepository;

    public IndexResponse indexDocument(Product product) {
        return indexingRepository.indexDocument(product);
    }

    public boolean createIndex() {
        //deleteRepository.deleteIndex();
        return indexingRepository.createIndex();
    }

    public boolean synchronousBulkIndexingProducts(MultipartFile file) {

        deleteRepository.deleteIndex();
        indexingRepository.createIndex();

        int numProductsPerExecution = 50000;
        ProductParser productParser = new ProductParser(file);
        List<Product> products = productParser.parseProducts(numProductsPerExecution);
        while (!products.isEmpty()) {
            try {
                indexingRepository.synchronousBulkIndexing(
                        products.stream().filter(m -> m != null).collect(Collectors.toList()));
            } catch (RuntimeException e) {
                return false;
            }

            products = productParser.parseProducts(numProductsPerExecution);
        }
        return true;
    }

}
