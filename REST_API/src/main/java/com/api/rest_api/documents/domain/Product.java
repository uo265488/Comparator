package com.api.rest_api.documents.domain;

import lombok.*;

@Value
@AllArgsConstructor
@NoArgsConstructor(force = true)
@ToString
@Getter
@Setter
public class Product {
    String barcode;
    String nombre;
    String marca;
    String proveedor;
    String supermercado;
    String[] fechas_de_registro;
    double[] precios;
    double precioActual;
}
