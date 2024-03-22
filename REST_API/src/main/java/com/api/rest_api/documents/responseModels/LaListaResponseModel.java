package com.api.rest_api.documents.responseModels;

import com.api.rest_api.documents.LaListaProduct;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.io.Serializable;

@Builder
@AllArgsConstructor
public class LaListaResponseModel implements Serializable {
    @JsonProperty("email") private String email;

    @JsonProperty("name") private String name;

    @JsonProperty("date") private String date;

    @JsonProperty("products") private LaListaProduct[] laListaProductsList;
}
