package com.api.rest_api.documents;

import lombok.*;

import java.util.UUID;

@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
@ToString
@Getter
@Setter
public class Product {
    private String barcode;
    private String nombre;
    private String marca;
    private String proveedor;
    private String fecha_de_registro;
    private double precio;
    private String supermercado;

}
