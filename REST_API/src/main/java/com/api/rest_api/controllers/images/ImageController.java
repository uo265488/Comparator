package com.api.rest_api.controllers.images;

import com.api.rest_api.documents.ImageRequest;
//import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("api/v1/images")
public class ImageController {

    @Value("C:\\Users\\oscar\\OneDrive\\Desktop\\TFG\\project\\REST_API\\src\\main\\resources\\")
    private String saveLocation;

    @PostMapping
    public ResponseEntity<String> saveImage(@RequestBody ImageRequest imageRequest) {
        String base64Image = imageRequest.getBase64Image();
        String barcode = imageRequest.getBarcode();

        String base64Data = base64Image.replaceFirst("data:image\\/[^;]+;base64,", "");

        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

        String filename = barcode + ".png";

        String targetPath = saveLocation + filename;

        try {
           // FileUtils.writeByteArrayToFile(new File(targetPath), imageBytes);
            System.out.println("Image saved successfully.");
            return ResponseEntity.ok("Image saved successfully.");
        //} catch (IOException e) {
        } catch (Exception e) {

            System.out.println("Error occurred while saving the image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while saving the image.");
        }
    }
}

