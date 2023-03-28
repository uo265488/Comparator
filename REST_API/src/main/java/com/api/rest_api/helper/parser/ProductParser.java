package com.api.rest_api.helper.parser;

import com.api.rest_api.documents.Product;
import com.api.rest_api.helper.exceptions.NotYetImplementedException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class ProductParser {

    public List<Product> parseProducts(int numMoviesPerExecution) {
        throw new NotYetImplementedException();
    }

    public ProductParser(MultipartFile file) {
        throw new NotYetImplementedException();
    }
}
