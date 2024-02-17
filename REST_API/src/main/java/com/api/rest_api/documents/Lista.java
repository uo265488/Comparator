package com.api.rest_api.documents;

import lombok.*;

@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
@ToString
@Getter
@Setter
@Builder
public class Lista {
    String name;
    String email;
    String date;
}
