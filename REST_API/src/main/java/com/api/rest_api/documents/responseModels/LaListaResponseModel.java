package com.api.rest_api.documents.responseModels;

import com.api.rest_api.documents.domain.LaListaProduct;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

@Builder
@AllArgsConstructor
@Getter
@EqualsAndHashCode
public class LaListaResponseModel implements Serializable {
    @JsonProperty("email") private String email;

    @JsonProperty("name") private String name;

    @JsonProperty("date") private String date;

    @JsonProperty("products") private LaListaProduct[] laListaProductsList;
}
