package com.api.rest_api.service.product;


import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.*;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.core.search.HitsMetadata;
import com.api.rest_api.controllers.product.ProductIndexController;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.documents.responseModels.ProductResponseModel;
import com.api.rest_api.helper.parser.ProductParser;
import com.api.rest_api.repositories.index.IndexRepository;
import com.api.rest_api.repositories.search.SearchRepository;
import com.api.rest_api.services.product.ProductSearchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(ProductIndexController.class)
@ContextConfiguration(classes = {
        ProductSearchService.class
})
public class ProductSearchServiceTest {

    @MockBean
    private SearchRepository<Product> productSearchRepository;

    @Autowired
    private ProductSearchService productSearchService;

    private SearchResponse<Product> mockSearchResponse() {
        SearchResponse<Product> mockResponse = mock(SearchResponse.class);
        HitsMetadata responsehitsMetadata = mock(HitsMetadata.class);

        when(mockResponse.hits()).thenReturn(responsehitsMetadata);
        when(responsehitsMetadata.hits()).thenReturn(new ArrayList<>());

        return mockResponse;
    }

    @Test
    public void testFindById() {
        Product product = new Product();
        Hit<Product> hit = mock(Hit.class);
        SearchResponse<Product> mockResponse = mock(SearchResponse.class);
        HitsMetadata responsehitsMetadata = mock(HitsMetadata.class);

        when(mockResponse.hits()).thenReturn(responsehitsMetadata);
        when(responsehitsMetadata.hits()).thenReturn(List.of(hit));
        when(hit.source()).thenReturn(product);


        when(productSearchRepository.filterByFieldQuery("_id", "mockId")).thenReturn(mockResponse);


        Product result = productSearchService.findById("mockId");


        assertEquals(product, result);
    }

    @Test
    public void testFindAll() {
        SearchResponse<Product> mockResponse = mockSearchResponse();
        when(productSearchRepository.matchAllQuery(SortOrder.Asc, "supermercado", 1000)).thenReturn(mockResponse);

        ProductResponseModel result = productSearchService.findAll();

        assertEquals(new ProductResponseModel(), result);
    }

    @Test
    public void testFilter() {
        SearchResponse<Product> mockResponse = mockSearchResponse();
        when(productSearchRepository.filterQuery(any(), any(), any(), any(), any(), any(), any())).thenReturn(mockResponse);

        ProductResponseModel result = productSearchService.filter(Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty());

        assertEquals(new ArrayList<>(), result.getHits());
    }

    @Test
    public void testOptimizeList() {
        List<Product> productList = new ArrayList<>();
        productList.add(new Product());
        ProductResponseModel mockResponseModel = new ProductResponseModel();

        SearchResponse<Product> mockResponse = mockSearchResponse();
        when(productSearchRepository.findAlternativeQuery(any(), any(), any(), any(), any(), anyInt())).thenReturn(mockResponse);

        ProductResponseModel result = productSearchService.optimizeList(productList);

        assertEquals(mockResponseModel, result);
    }

    @Test
    public void testFindBestAlternative() {
        Product mockProduct = new Product();
        ProductResponseModel mockResponseModel = new ProductResponseModel();

        SearchResponse<Product> mockResponse = mockSearchResponse();
        when(productSearchRepository.findAlternativeQuery(any(), any(), any(), any(), any(), anyInt())).thenReturn(mockResponse);

        ProductResponseModel result = productSearchService.findBestAlternative(mockProduct, Optional.empty(), Optional.empty());

        assertEquals(mockResponseModel, result);
    }

    @Test
    public void testFindByBarcode() {
        String mockBarcode = "mockBarcode";
        Product product = new Product();
        Hit<Product> hit = mock(Hit.class);
        SearchResponse<Product> mockResponse = mock(SearchResponse.class);
        HitsMetadata responsehitsMetadata = mock(HitsMetadata.class);


        when(mockResponse.hits()).thenReturn(responsehitsMetadata);
        when(responsehitsMetadata.hits()).thenReturn(List.of(hit));
        when(hit.source()).thenReturn(product);


        when(productSearchRepository.filterByFieldQuery("barcode", mockBarcode)).thenReturn(mockResponse);


        Product result = productSearchService.findByBarcode(mockBarcode);


        assertEquals(product, result);
    }

    @Test
    public void testGetMostUpdated() {
        SearchResponse<Product> mockResponse = mockSearchResponse();
        ProductResponseModel mockResponseModel = new ProductResponseModel();


        when(productSearchRepository.getMostUpdated()).thenReturn(mockResponse);

        ProductResponseModel result = productSearchService.getMostUpdated();


        assertEquals(mockResponseModel, result);
    }

    @Test
    public void testMostRecentUpdate() {
        SearchResponse<Product> mockResponse = mockSearchResponse();
        ProductResponseModel mockResponseModel = new ProductResponseModel();


        when(productSearchRepository.matchAllQuery(SortOrder.Asc, "fechas_de_registro", 1)).thenReturn(mockResponse);


        ProductResponseModel result = productSearchService.mostRecentUpdate();


        assertEquals(mockResponseModel, result);
    }

    @Test
    public void testGetAveragePricesBySupermercado() {
        SearchResponse<Product> mockResponse = mockSearchResponse();


        when(productSearchRepository.getAveragePricesBySupermercado()).thenReturn(mockResponse);


        SearchResponse<Product> result = productSearchService.getAveragePricesBySupermercado();


        assertEquals(mockResponse, result);
    }

    @Test
    public void testGetAvgPricePerMonthBySupermercado() {
        SearchResponse<Product> mockResponse = mock(SearchResponse.class);
        HitsMetadata hitsMetadata = mock(HitsMetadata.class);
        Map<String, Map<String, Double>> mockMap = new HashMap<>();
        MockedStatic<ProductParser> parser = Mockito.mockStatic(ProductParser.class);

        when(mockResponse.hits()).thenReturn(hitsMetadata);
        when(hitsMetadata.hits()).thenReturn(List.of());
        when(productSearchRepository.matchAllQuery(SortOrder.Asc, "", 10000)).thenReturn(mockResponse);

        parser.when(() -> ProductParser.searchResponseToStatistic(mockResponse)).thenReturn(mockMap);


        Map<String, Map<String, Double>> result = productSearchService.getAvgPricePerMonthBySupermercado();


        assertEquals(mockMap, result);
    }
    @Test
    public void testGetAllMarcas() {
        Map<String, Aggregate> aggregations = new HashMap<>();
        StringTermsBucket mockBucket = mock(StringTermsBucket.class);
        when(mockBucket.key()).thenReturn(FieldValue.of("Marca"));

        Buckets<StringTermsBucket> mockBuckets = mock(Buckets.class);
        when(mockBuckets.array()).thenReturn(List.of(new StringTermsBucket[]{mockBucket}));

        StringTermsAggregate mockStringTermsAggregate = mock(StringTermsAggregate.class);
        when(mockStringTermsAggregate.buckets()).thenReturn(mockBuckets);

        Aggregate mockAggregate = mock(Aggregate.class);
        when(mockAggregate.sterms()).thenReturn(mockStringTermsAggregate);


        aggregations.put("marcas", mockAggregate);
        StringTermsAggregate stringTermsAggregate = mock(StringTermsAggregate.class);
        Buckets<StringTermsBucket> buckets = mock(Buckets.class);


        SearchResponse<Product> searchResponse = mock(SearchResponse.class);

        when(aggregations.get(aggregations.keySet().stream().findFirst().get()   ).sterms()).thenReturn(stringTermsAggregate);
        when(stringTermsAggregate.buckets()).thenReturn(buckets);
        when(searchResponse.aggregations()).thenReturn(aggregations);
        when(productSearchRepository.getAllMarcas()).thenReturn(searchResponse);


        ProductResponseModel result = productSearchService.getAllMarcas();


        verify(productSearchRepository).getAllMarcas();
        verify(searchResponse,times(2)).aggregations();
        verify(mockAggregate).sterms();


        assertEquals(aggregations, result.getAggregations());
    }

}
