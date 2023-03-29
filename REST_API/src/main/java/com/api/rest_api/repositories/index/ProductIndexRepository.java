package com.api.rest_api.repositories.index;

import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.Indices;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;

@Repository
public class ProductIndexRepository implements IndexRepository<Product> {

    @Autowired
    private ESClientConfig elasticsearchClientConfig;

    private static final String configFilePath =
            "C:/Users/oscar/OneDrive/Desktop/TFG/TFG_code/REST_API/src/main/resources";
    private static final String fileName = Indices.PRODUCT_INDEX + ".json";
    @Override
    public String createIndex() {
        try {
            BooleanResponse response =
                    elasticsearchClientConfig.getEsClient().indices().exists(i -> i.index(Indices.PRODUCT_INDEX));
            if(!response.value())
                elasticsearchClientConfig.getEsClient().indices().create(i -> i.index(Indices.PRODUCT_INDEX));
            return updateMapping();
        } catch (ElasticsearchException es) {
            throw new RuntimeException(es.getMessage());
        } catch(IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Updates the mapping of the PRODUCT index
     * @return
     * @throws IOException
     */
    private String updateMapping() throws IOException {
        return elasticsearchClientConfig.getEsClient()
                .indices()
                .putMapping(
                        m -> m.index(Indices.PRODUCT_INDEX)
                                .withJson(this.getClass().getClassLoader().getResourceAsStream(fileName)))
                .toString();
    }

    @Override
    public String indexDocument(Product product) {
        IndexResponse response;
        try {
            response = elasticsearchClientConfig.getEsClient()
                    .index(i -> i.index(Indices.PRODUCT_INDEX)
                            .id(product.getBarcode() + product.getFecha_de_registro())
                            .document(product)
                    );
        } catch (Exception e) {
            return "The indexing of the product could not be performed because " + e.getMessage();
        }
        return "" + response.version();
    }

    @Override
    public List<Product> synchronousBulkIndexing(List<Product> productList) {
        BulkRequest.Builder br = new BulkRequest.Builder();

        for (Product product : productList) {
            br.operations(op -> op
                    .index(idx -> idx
                            .index(Indices.PRODUCT_INDEX)
                            .id(product.getBarcode() + product.getFecha_de_registro())
                            .document(product)
                    )
            );
        }
        BulkResponse result;
        try {
            result = elasticsearchClientConfig.getEsClient().bulk(br.build());
        } catch (IOException e) {
            LoggerFactory.getLogger(this.getClass()).error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
        return productList;
    }

    @Override
    public List<Product> asynchronousBulkIndexing(List<Product> documentsList) {
        throw new NotYetImplementedException();
    }
}
