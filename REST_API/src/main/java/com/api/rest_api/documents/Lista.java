package com.api.rest_api.documents;

import lombok.*;

import java.util.List;

@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
@ToString
@Getter
@Setter
public class Lista {
    List<Product> Lista;
    String autor;
    String nombre;
    String fechaDeRegistro;

}
