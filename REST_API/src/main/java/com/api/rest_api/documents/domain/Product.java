package com.api.rest_api.documents.domain;

import lombok.*;

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
    private String supermercado;
    private String[] fechas_de_registro;
    private double[] precios;
    private double precioActual;

}
