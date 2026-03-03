package com.studexa.studexa.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    @Async
    public CompletableFuture<String> generateFlashcards(String content, String subject) {
        try {
            //the prompt to make sure it makes the 10 flashcards in the json i want without me converting later
            String prompt = String.format(
                "You are a helpful tutor. Create 10 flashcards based on the following text about %s. " +
                "Return ONLY valid JSON in the following format: " +
                "{\"cards\": [{\"front\": \"Question here\", \"back\": \"Answer here\"}]}. " +
                "Do not add markdown formatting like ```json or ```. " +
                "Text content: %s",
                subject, content.substring(0, Math.min(content.length(), 30000)) // Limit chars to avoid limits
            );

            // constructing the req body and the part as maps where part has the prompt and req will have the contents produced
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            //making the content obj to have parts mapped to  an object with corresponding  parts
            Map<String, Object> contentObj = new HashMap<>();
            contentObj.put("parts", new Object[]{part});

            //placing all the contents into the req body
            requestBody.put("contents", new Object[]{contentObj});

            //for post reqs needs to be application json
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            //this is where the post rquest occurs inside the async func
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_URL + apiKey, entity, String.class);

            // extracting text from Gemini response structure
            JsonNode root = objectMapper.readTree(response.getBody());
            String generatedText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            // just incase gemini doesnt follow instructions as this is free model i just want the json it gives
            generatedText = generatedText.replace("```json", "").replace("```", "").trim();

            //returning the gen content like how i would in js as a new promise using await
            return CompletableFuture.completedFuture(generatedText);

        } catch (Exception e) {
            //this is so i can see any gemini api errors in case i use the wrong model or my free limit is exceeded
            System.err.println("Gemini API Error details:");
            e.printStackTrace();
            return CompletableFuture.failedFuture(e);
        }
    }
}
