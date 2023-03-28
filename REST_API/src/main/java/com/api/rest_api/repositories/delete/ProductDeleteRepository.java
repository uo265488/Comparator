package com.api.rest_api.repositories.delete;

import com.api.rest_api.config.ESClientConfig;
import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.Indices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.io.IOException;

@Repository
public class ProductDeleteRepository implements DeleteRepository<Product> {
    @Autowired
    private ESClientConfig esClientConfig;

    @Override
    public String deleteDocument(String _id) {
        try {
            return esClientConfig.getEsClient()
                    .delete(d -> d.id(_id)).result().toString();

        } catch (IOException e) {
            throw new RuntimeException(e.getCause());
        }
    }

    @Override
    public boolean deleteIndex() {
        try {
            return esClientConfig.getEsClient()
                    .indices().delete(b -> b.index(Indices.PRODUCT_INDEX)).acknowledged();

        } catch (IOException exception) {
            throw new RuntimeException(exception.getMessage());
        }
    }
}
