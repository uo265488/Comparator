package com.api.rest_api.documents;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

@ToString
@Getter
@NoArgsConstructor
public class LaListaProduct implements Serializable {
    @JsonProperty("barcode") String barcode;
    @JsonProperty("supermercado") String supermercado;
    @Setter  @JsonProperty("listaId") String listaId;

}
