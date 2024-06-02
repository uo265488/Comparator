package com.api.rest_api.repositories.search;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.controllers.product.ProductIndexController;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.repositories.search.query.executor.QueryExecutor;
import com.api.rest_api.repositories.search.query.factory.QueryFactory;
import com.api.rest_api.services.product.ProductIndexService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(ProductSearchRepository.class)
@ContextConfiguration(classes = {
        ProductSearchRepository.class,
        ESClientConfig.class,
        QueryExecutor.class,
        QueryFactory.class
})
public class ProductSearchRepositoryTest {

    @MockBean
    private ESClientConfig esClientConfig;

    @MockBean
    private QueryFactory queryFactory;

    @MockBean
    private QueryExecutor<Product> queryExecutor;

    @Autowired
    private ProductSearchRepository productSearchRepository;

    @Test
    public void testMatchAllQuery() {
        SearchResponse<Product> searchResponse = mock(SearchResponse.class);

        when(queryFactory.getMatchAllQuery()).thenReturn(mock(Query.class));
        when(queryExecutor.executeSearchQuery(any(), anyInt(), any(), any(), anyMap(), anyString(), eq(Product.class)))
                .thenReturn(searchResponse);


        SearchResponse<Product> response = productSearchRepository.matchAllQuery(SortOrder.Asc, "fieldName", 10);


        assertNotNull(response);
        assertEquals(searchResponse, response);
    }

    @Test
    public void testFilterByFieldQuery() {
        SearchResponse<Product> searchResponse = mock(SearchResponse.class);
        Query query = mock(Query.class);


        when(queryFactory.getFilterQuery(anyString(), anyString())).thenReturn(query);
        when(queryExecutor.executeSearchQuery(any(), anyInt(), any(), any(), anyMap(), anyString(), eq(Product.class)))
                .thenReturn(searchResponse);


        SearchResponse<Product> response = productSearchRepository.filterByFieldQuery("fieldName", "fieldValue");


        assertNotNull(response);
        assertEquals(searchResponse, response);
    }

    @Test
    public void testFilterQuery() {
        Query query = mock(Query.class);
        SearchResponse<Product> searchResponse = mock(SearchResponse.class);

        when(queryFactory.getLowercaseTermsQuery(anyString(), anyString())).thenReturn(query);
        when(queryFactory.getTermsQuery(anyString(), anyString())).thenReturn(query);
        when(queryFactory.getTermsQuery(anyString(), anyDouble())).thenReturn(query);
        when(queryFactory.getMustQuery(anyList())).thenReturn(query);
        when(queryExecutor.executeSearchQuery(any(), anyInt(), any(), any(), anyMap(), anyString(), eq(Product.class)))
                .thenReturn(searchResponse);


        SearchResponse<Product> response = productSearchRepository.filterQuery(
                Optional.of("name"), Optional.of("brand"), Optional.of(10.0), Optional.of("supermercado"),
                Optional.of("provider"), Optional.of("barcode"), Optional.of("2024-05-03"));


        assertNotNull(response);
        assertEquals(searchResponse, response);
    }
}
