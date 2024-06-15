package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.CreateRequest;
import co.elastic.clients.elasticsearch.core.CreateResponse;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import co.elastic.clients.elasticsearch.indices.*;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import co.elastic.clients.util.ObjectBuilder;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.helper.Indices;
import com.api.rest_api.repositories.index.ProductIndexRepository;
import com.api.rest_api.repositories.search.query.executor.QueryExecutor;
import com.api.rest_api.repositories.search.query.factory.QueryFactory;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;

import java.io.IOException;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(ProductSearchRepository.class)
@ContextConfiguration(classes = {
        ESClientConfig.class,
        ProductIndexRepository.class
})
public class ProductIndexRepositoryTest {

    @MockBean
    private ESClientConfig elasticsearchClientConfig;

    @Autowired
    private ProductIndexRepository productIndexRepository;

    @Test
    public void testCreateIndex() throws IOException {
        ElasticsearchClient elasticsearchClient = mock(ElasticsearchClient.class);
        ElasticsearchIndicesClient elasticsearchIndicesClient = mock(ElasticsearchIndicesClient.class);
        CreateIndexResponse createResponse = mock(CreateIndexResponse.class);
        BooleanResponse booleanResponse = mock(BooleanResponse.class);
        PutIndicesSettingsResponse putSettingsResponse = mock(PutIndicesSettingsResponse.class);
        PutMappingResponse putMappingResponse = mock(PutMappingResponse.class);


        when(elasticsearchClientConfig.getEsClient()).thenReturn(elasticsearchClient);
        when(elasticsearchClient.indices()).thenReturn(elasticsearchIndicesClient);
        when(elasticsearchIndicesClient.exists(any(Function.class))).thenReturn(booleanResponse);
        when(booleanResponse.value()).thenReturn(false);
        when(elasticsearchIndicesClient.create(any(Function.class))).thenReturn(createResponse);
        when(createResponse.acknowledged()).thenReturn(true);
        when(elasticsearchIndicesClient.putSettings(any(Function.class))).thenReturn(putSettingsResponse);
        when(elasticsearchIndicesClient.putMapping(any(Function.class))).thenReturn(putMappingResponse);


        boolean result = productIndexRepository.createIndex();


        verify(elasticsearchClientConfig, times(7)).getEsClient();
        verify(elasticsearchClient, times(6)).indices();


        assertTrue(result);
    }

    @Test
    public void testCreateIndexNotCreated() throws IOException {
        ElasticsearchClient elasticsearchClient = mock(ElasticsearchClient.class);
        ElasticsearchIndicesClient elasticsearchIndicesClient = mock(ElasticsearchIndicesClient.class);
        BooleanResponse booleanResponse = mock(BooleanResponse.class);


        when(elasticsearchClientConfig.getEsClient()).thenReturn(elasticsearchClient);
        when(elasticsearchClient.indices()).thenReturn(elasticsearchIndicesClient);
        when(elasticsearchIndicesClient.exists(any(Function.class))).thenReturn(booleanResponse);
        when(booleanResponse.value()).thenReturn(true);


        boolean result = productIndexRepository.createIndex();


        verify(elasticsearchClientConfig, times(1)).getEsClient();
        verify(elasticsearchClient, times(1)).indices();


        assertFalse(result);
    }
}

