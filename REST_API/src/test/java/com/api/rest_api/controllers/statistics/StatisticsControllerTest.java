package com.api.rest_api.controllers.statistics;

import static org.mockito.Mockito.*;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.api.rest_api.documents.domain.Product;
import com.api.rest_api.documents.responseModels.ProductResponseModel;
import com.api.rest_api.services.product.ProductSearchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.util.HashMap;
import java.util.Map;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@WebMvcTest(StatisticsController.class)
@ContextConfiguration(classes = {
        ProductSearchService.class,
        StatisticsController.class
})
public class StatisticsControllerTest {

    public static final String GET_MOST_UPDATED_URI = "/api/v1/statistics/mostUpdated";
    public static final String LAST_PRICE_CHANGE_URI = "/api/v1/statistics/lastPriceChange";
    public static final String AVG_PRICE_BY_SUPERMERCADO_URI = "/api/v1/statistics/avgPriceBySupermercado";
    public static final String AVG_PRICE_PER_MONTH_BY_SUPERMERCADO = "/api/v1/statistics/avgPricePerMonthBySupermercado";

    @Autowired
    private WebTestClient webTestClient;

    @MockBean
    private ProductSearchService productSearchService;

    @Test
    public void testGetMostUpdatedProduct() {
        ProductResponseModel mockResponse = new ProductResponseModel();

        when(productSearchService.getMostUpdated()).thenReturn(mockResponse);

        webTestClient.get()
                .uri(GET_MOST_UPDATED_URI)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductResponseModel.class)
                .isEqualTo(mockResponse);
    }

    @Test
    public void testGetMostRecentUpdate() {
        ProductResponseModel mockResponse = new ProductResponseModel(/* Create a mock response */);
        when(productSearchService.mostRecentUpdate()).thenReturn(mockResponse);

        webTestClient.get()
                .uri(LAST_PRICE_CHANGE_URI)
                .exchange()
                .expectStatus().isOk()
                .expectBody(ProductResponseModel.class)
                .isEqualTo(mockResponse);
    }

    @Test
    public void testGetAvgPriceBySupermercado() {
        SearchResponse<Product> response = mock(SearchResponse.class);
        Map<String, Aggregate> aggregateMap = new HashMap<>();

        when(productSearchService.getAveragePricesBySupermercado()).thenReturn(response);
        when(response.aggregations()).thenReturn(aggregateMap);

        webTestClient.get()
                .uri(AVG_PRICE_BY_SUPERMERCADO_URI)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .json("{}");
    }

    @Test
    public void testGetAvgPricePerMonthBySupermercado() {
        Map<String, Map<String, Double>> response = new HashMap<>();
        when(this.productSearchService.getAvgPricePerMonthBySupermercado())
                .thenReturn(response);

        webTestClient.get()
                .uri(AVG_PRICE_PER_MONTH_BY_SUPERMERCADO)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Map.class)
                .isEqualTo(response);
    }
}

