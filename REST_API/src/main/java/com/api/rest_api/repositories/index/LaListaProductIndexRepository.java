package com.api.rest_api.repositories.index;

import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.indices.PutMappingResponse;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.domain.LaListaProduct;
import com.api.rest_api.helper.Indices;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;

@Repository
public class LaListaProductIndexRepository implements IndexRepository<LaListaProduct> {

    @Autowired
    private ESClientConfig elasticsearchClientConfig;

    private static final String MAPPING_FILENAME = Indices.LALISTA_PRODUCT_INDEX + ".json";

    @Override
    public boolean createIndex() {
        boolean res = false;
        try {
            BooleanResponse response =
                    elasticsearchClientConfig.getEsClient().indices().exists(i -> i.index(Indices.LALISTA_PRODUCT_INDEX));
            if(!response.value())
                res = elasticsearchClientConfig.getEsClient().indices().create(i -> i.index(Indices.LALISTA_PRODUCT_INDEX))
                        .acknowledged();
            updateMapping();
            return res;
        } catch (ElasticsearchException es) {
            throw new RuntimeException(es.getMessage());
        } catch(IOException e) {
            throw new RuntimeException(e);
        }
    }

    private PutMappingResponse updateMapping() throws IOException {
        return elasticsearchClientConfig.getEsClient()
                .indices()
                .putMapping(
                        m -> m.index(Indices.LALISTA_PRODUCT_INDEX)
                                .withJson(this.getClass().getClassLoader().getResourceAsStream(MAPPING_FILENAME)));
    }

    @Override
    public IndexResponse indexDocument(LaListaProduct laListaProduct) {
        IndexResponse response;
        try {
            response = elasticsearchClientConfig.getEsClient()
                    .index(i -> i.index(Indices.LALISTA_PRODUCT_INDEX)
                            .id(laListaProduct.getListaId())
                            .document(laListaProduct)
                    );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    @Override
    public BulkResponse synchronousBulkIndexing(List<LaListaProduct> laListaProductsList) {
        BulkResponse bulkResponse;
        BulkRequest.Builder request = new BulkRequest.Builder();

        laListaProductsList.forEach(laListaProduct -> request.operations(op -> op
                .index(i -> i
                        .index(Indices.LALISTA_PRODUCT_INDEX)
                        .document(laListaProduct))));
        try {
            bulkResponse = elasticsearchClientConfig.getEsClient().bulk(request.build());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return bulkResponse;
    }

    @Override
    public List<LaListaProduct> asynchronousBulkIndexing(List<LaListaProduct> documentsList) {
       throw new NotYetImplementedException();
    }
}
