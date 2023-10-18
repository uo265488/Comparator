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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductIndexService {

        private Map<UUID, Product> products;

        @Autowired
        private IndexRepository<Product> indexingRepository;

        @Autowired
        private DeleteRepository<Product> deleteRepository;

        public ProductIndexService() {
            products = new HashMap<>();
        }

        public IndexResponse indexDocument(Product product) {
            return indexingRepository.indexDocument(product);
        }
        public boolean createIndex() {
            //deleteRepository.deleteIndex();
            return indexingRepository.createIndex();
        }

        /**
         * Performs synchronous bulk indexing of 'title.basics.tsv' file
         * @param  file for indexing
         * @return
         */
        public boolean synchronousBulkIndexingMovies(MultipartFile file) {

            deleteRepository.deleteIndex();
            indexingRepository.createIndex();

            int numProductsPerExecution = 50000;
            ProductParser movieParser = new ProductParser(file);
            List<Product> products = movieParser.parseProducts(numProductsPerExecution);
            while(!products.isEmpty()) {
                try {
                    indexingRepository.synchronousBulkIndexing(
                            products.stream().filter(m -> m != null).collect(Collectors.toList()));
                } catch (RuntimeException e) {
                    return false;
                }

                products = movieParser.parseProducts(numProductsPerExecution);
            }
            return true;
        }

        /**
         * Performs asynchronous bulk indexing of 'title.basics.tsv' file
         * @param ratings, akas, titleBasics and principals files for indexing
         * @return
         */
        public boolean asynchronousBulkIndexingRatings(
                MultipartFile titleBasics, MultipartFile ratings, MultipartFile akas, MultipartFile principals) {
            throw new RuntimeException("Asynchoronous bulk indexing not yet implemented.");
        }

    public boolean synchronousBulkIndexingProducts(MultipartFile products) {
            throw new NotYetImplementedException();
    }
}
