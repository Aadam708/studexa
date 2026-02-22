package com.studexa.studexa.service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.MemoryDataStoreFactory;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.json.JsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GoogleDriveService {
    private final JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
    private final com.google.api.client.http.HttpTransport httpTransport;
    private final GoogleAuthorizationCodeFlow flow;

    //getting the value from application.properties file
    @Value("${app.redirect-uri:http://localhost:8080/drive/oauth2callback}")
    private String redirectUri;

    public GoogleDriveService(
            //secret keys i have in app.properties so their variable names are passed here
            @Value("${google.client-id}") String clientId,
            @Value("${google.client-secret}") String clientSecret
    ) throws GeneralSecurityException, IOException {
        this.httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        //passing in all attributes to the googleAuth builder
        this.flow = new GoogleAuthorizationCodeFlow.Builder(
                httpTransport,
                jsonFactory,
                clientId,
                clientSecret,
                Collections.singleton(DriveScopes.DRIVE_FILE)
        )
        .setDataStoreFactory(new MemoryDataStoreFactory())
        .setAccessType("offline")
        .setApprovalPrompt("force")
        .build();
    }

    public String getAuthorizationUrl(String userId) {
        return flow.newAuthorizationUrl()
                .setRedirectUri(redirectUri)
                .setState(userId)
                .build();
    }
    
    public Credential handleCallback(String code, String userId) throws IOException {
        GoogleTokenResponse tokenResponse = flow.newTokenRequest(code)
                .setRedirectUri(redirectUri)
                .execute();
        return flow.createAndStoreCredential(tokenResponse, userId);
    }

    public Credential loadCredential(String userId) throws IOException {
        return flow.loadCredential(userId);
    }

    public Drive buildDrive(Credential credential) {
        return new Drive.Builder(httpTransport, jsonFactory, credential)
                .setApplicationName("studexa")
                .build();
    }
}
