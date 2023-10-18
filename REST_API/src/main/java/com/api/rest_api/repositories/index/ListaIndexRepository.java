package com.api.rest_api.repositories.index;

import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.Lista;
import com.api.rest_api.helper.Indices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.List;

@Repository
public class ListaIndexRepository implements IndexRepository<Lista> {

    @Autowired
    private ESClientConfig elasticsearchClientConfig;
    private static final String MAPPING_FILENAME = Indices.LISTAS_INDEX + ".json";


    @Override
    public boolean createIndex() {
        boolean res = false;
        try {
            BooleanResponse response =
                    elasticsearchClientConfig.getEsClient().indices().exists(i -> i.index(Indices.LISTAS_INDEX));
            if(!response.value())
                res = elasticsearchClientConfig.getEsClient().indices().create(i -> i.index(Indices.LISTAS_INDEX))
                        .acknowledged();
            updateMapping();
            return res;
        } catch (ElasticsearchException es) {
            throw new RuntimeException(es.getMessage());
        } catch(IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Updates the mapping of the LISTA index
     * @return
     * @throws IOException
     */
    private String updateMapping() throws IOException {
        return elasticsearchClientConfig.getEsClient()
                .indices()
                .putMapping(
                        m -> m.index(Indices.LISTAS_INDEX)
                                .withJson(this.getClass().getClassLoader().getResourceAsStream(MAPPING_FILENAME)))
                .toString();
    }

    @Override
    public IndexResponse indexDocument(Lista lista) {
        IndexResponse response;
        try {
            response = elasticsearchClientConfig.getEsClient()
                    .index(i -> i.index(Indices.LISTAS_INDEX)
                            .id(lista.getNombre() + "_" + lista.getAutor())
                            .document(lista)
                    );
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return response;
    }

    @Override
    public List<Lista> synchronousBulkIndexing(List<Lista> documentsList) {
        return null;
    }

    @Override
    public List<Lista> asynchronousBulkIndexing(List<Lista> documentsList) {
        return null;
    }
}