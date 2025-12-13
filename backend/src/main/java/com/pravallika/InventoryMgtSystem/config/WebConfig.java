package com.pravallika.InventoryMgtSystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final String IMAGE_DIRECTORY = new File("backend/product-images").getAbsolutePath();

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + IMAGE_DIRECTORY + "/")
                .setCachePeriod(3600);
    }
}
