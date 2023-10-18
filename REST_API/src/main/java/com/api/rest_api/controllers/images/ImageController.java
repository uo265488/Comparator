package com.api.rest_api.controllers.images;

import com.api.rest_api.documents.ImageRequest;
//import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.Base64;

@RestController
public class ImageController {

    @Value("C:\\Users\\oscar\\OneDrive\\Desktop\\TFG\\project\\REST_API\\src\\main\\resources\\")
    private String saveLocation;

    @PostMapping("/utils/saveImage")
    public ResponseEntity<String> saveImage(@RequestBody ImageRequest imageRequest) {
        String base64Image = imageRequest.getBase64Image();
        String barcode = imageRequest.getBarcode();

        // Remove the data URI scheme part
        String base64Data = base64Image.replaceFirst("data:image\\/[^;]+;base64,", "");

        // Decode the base64 data
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

        // Generate a unique filename or use an existing filename
        String filename = barcode + ".png";

        // Specify the target file path within the project folder
        String targetPath = saveLocation + filename;

        try {
            // Save the image file to the specified location
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

