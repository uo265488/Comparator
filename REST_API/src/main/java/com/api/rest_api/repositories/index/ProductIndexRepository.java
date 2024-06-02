package com.api.rest_api.repositories.index;

import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.domain.Product;
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
    private static final String MAPPING_FILENAME = Indices.PRODUCT_INDEX + ".json";
    private static final String MY_ANALYZER_FILENAME = "my_analyzer.json";

    @Override
    public boolean createIndex() {
        boolean res = false;
        try {
            BooleanResponse response =
                    elasticsearchClientConfig.getEsClient().indices().exists(i -> i.index(Indices.PRODUCT_INDEX));
            if (!response.value()) {
                res = elasticsearchClientConfig.getEsClient().indices().create(i -> i.index(Indices.PRODUCT_INDEX))
                        .acknowledged();
                updateSettings();
                updateMapping();

                return res;
            }

            return false;
        } catch (ElasticsearchException es) {
            throw new RuntimeException(es.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Updates the mapping of the PRODUCT index
     *
     * @return
     * @throws IOException
     */
    private String updateMapping() throws IOException {
        return elasticsearchClientConfig.getEsClient()
                .indices()
                .putMapping(
                        m -> m.index(Indices.PRODUCT_INDEX)
                                .withJson(this.getClass().getClassLoader().getResourceAsStream(MAPPING_FILENAME)))
                .toString();
    }

    /**
     * Updates the settings
     *
     * @return String with the update
     */
    private String updateSettings() throws IOException {
        elasticsearchClientConfig.getEsClient().indices().close(c -> c.index(Indices.PRODUCT_INDEX));
        String response = elasticsearchClientConfig.getEsClient()
                .indices()
                .putSettings(
                        p -> p.index(Indices.PRODUCT_INDEX)
                                .withJson(getClass().getClassLoader().getResourceAsStream(MY_ANALYZER_FILENAME)))
                .toString();

        elasticsearchClientConfig.getEsClient().indices().open(c -> c.index(Indices.PRODUCT_INDEX));

        return response;
    }

    @Override
    public IndexResponse indexDocument(Product product) {
        IndexResponse response;
        try {
            response = elasticsearchClientConfig.getEsClient()
                    .index(i -> i.index(Indices.PRODUCT_INDEX)
                            .id(product.getBarcode() + product.getSupermercado())
                            .document(product)
                    );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    @Override
    public BulkResponse synchronousBulkIndexing(List<Product> productList) {
        BulkRequest.Builder br = new BulkRequest.Builder();

        for (Product product : productList) {
            br.operations(op -> op
                    .index(idx -> idx
                            .index(Indices.PRODUCT_INDEX)
                            .id(product.getBarcode() + product.getSupermercado())
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
        return result;
    }

    @Override
    public List<Product> asynchronousBulkIndexing(List<Product> documentsList) {
        throw new NotYetImplementedException();
    }
}
