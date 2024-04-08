package com.api.rest_api.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan
public class ESClientConfig {

    @Bean
    public RestClient lowRestClient() {

        RestClient restClient = RestClient.builder(new HttpHost("localhost", 9200),
                new HttpHost("elasticsearch", 9200)).build();

        return restClient;
    }

    @Bean
    public ElasticsearchClient getEsClient() {

        RestClient restClient = RestClient.builder(new HttpHost("localhost", 9200),
                new HttpHost("elasticsearch", 9200)).build();

        ElasticsearchTransport transport = new RestClientTransport(
                restClient, new JacksonJsonpMapper());

        ElasticsearchClient client = new ElasticsearchClient(transport);
        return client;
    }

}