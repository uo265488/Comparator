package com.api.rest_api.documents;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.io.Serializable;

@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
@ToString
@Builder
public class Lista implements Serializable {

    @JsonProperty("name")
    String name;
    @JsonProperty("email") String email;
    @JsonProperty("date") String date;
}
