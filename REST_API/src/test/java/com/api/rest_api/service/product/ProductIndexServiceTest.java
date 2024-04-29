package com.api.rest_api.service.product;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import com.api.rest_api.controllers.product.ProductIndexController;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import com.api.rest_api.repositories.delete.DeleteRepository;
import com.api.rest_api.repositories.index.IndexRepository;
import com.api.rest_api.services.product.ProductIndexService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(ProductIndexController.class)
@ContextConfiguration(classes = {
        ProductIndexService.class,
        IndexRepository.class,
        DeleteRepository.class
})
public class ProductIndexServiceTest {

    @Autowired
    private ProductIndexService productIndexService;

    @MockBean
    private IndexRepository<Product> indexingRepository;

    @MockBean
    private DeleteRepository<Product> deleteRepository;

    @Test
    public void testIndexDocument() {
        Product product = new Product();
        IndexResponse expectedResponse = mock(IndexResponse.class);

        when(indexingRepository.indexDocument(product)).thenReturn(expectedResponse);

        IndexResponse actualResponse = productIndexService.indexDocument(product);

        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    public void testCreateIndex() {
        when(indexingRepository.createIndex()).thenReturn(true);

        boolean result = productIndexService.createIndex();

        assertTrue(result);
    }

    @Test
    public void testSynchronousBulkIndexingProducts() {
        MultipartFile file = new MockMultipartFile("File name", new byte[0]);
        List<Product> products = Stream.of(new Product(), new Product()).collect(Collectors.toList());
        BulkResponse response = mock(BulkResponse.class);

        when(deleteRepository.deleteIndex()).thenReturn(true);
        when(indexingRepository.createIndex()).thenReturn(true);
        when(indexingRepository.synchronousBulkIndexing(products)).thenReturn(response);

        assertThrows(NotYetImplementedException.class, () -> {
            productIndexService.synchronousBulkIndexingProducts(file);
        });

        //assertTrue(result);
    }
}

