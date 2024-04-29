package com.api.rest_api.service.product;

import co.elastic.clients.elasticsearch.core.UpdateResponse;
import com.api.rest_api.controllers.product.ProductIndexController;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.repositories.update.ProductUpdateRepository;
import com.api.rest_api.repositories.update.UpdateRepository;
import com.api.rest_api.services.product.ProductUpdateService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(ProductIndexController.class)
@ContextConfiguration(classes = {
        ProductUpdateService.class,
        ProductUpdateRepository.class
})
public class ProductUpdateServiceTest {

    @MockBean
    private UpdateRepository<Product> productUpdateRepository;

    @Autowired
    private ProductUpdateService productUpdateService;

    @Test
    public void testUpdateDocument() {
        Product product = new Product();

        UpdateResponse<Product> mockUpdateResponse = mock(UpdateResponse.class);

        when(productUpdateRepository.update(product)).thenReturn(mockUpdateResponse);

        UpdateResponse<Product> result = productUpdateService.updateDocument(product);

        verify(productUpdateRepository).update(product);

        assertEquals(mockUpdateResponse, result);
    }
}

