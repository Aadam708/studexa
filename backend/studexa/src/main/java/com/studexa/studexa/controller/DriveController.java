package com.studexa.studexa.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.FileList;
import com.studexa.studexa.service.GoogleDriveService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:3000") //cors to my next frontend
@RequestMapping("/api/drive")
public class DriveController {
    private final GoogleDriveService driveService;

    public DriveController(GoogleDriveService driveService) {
        this.driveService = driveService;
    }

    //getting the current user details from their session and setting up the google drive authentication process
    @GetMapping("/auth-url")
    public ResponseEntity<?> getAuthUrl(HttpServletRequest req) {
        String userId = req.getSession(true).getId();
        String url = driveService.getAuthorizationUrl(userId);
        Map<String, String> response = new HashMap<>();
        response.put("authUrl", url);
        return ResponseEntity.ok(response);
    }

    // handling the responses from google drive so the code,error and state can be optoonal
    //  as they will be handled in this function to determine if theres any problems but
    //the response is requirred to show error message or connection success
    @GetMapping("/oauth2callback")
    public ResponseEntity<?> oauth2callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String error,
            @RequestParam(required = false) String state,
            HttpServletRequest req) throws IOException {
        if (error != null) {
            //if there is an error then we can just redirect to the revise page but give an error response
            //so the frontend can display that there was an error to connect
            String errUrl = "http://localhost:3000/revise?drive_error=" + java.net.URLEncoder.encode(error, "UTF-8");
            return ResponseEntity.status(302).header("Location", errUrl).build();
        }
        if (code == null) {
            //if no status code is returned by google drive there was also a problem to connect
            String errUrl = "http://localhost:3000/revise?drive_error=missing_code";
            return ResponseEntity.status(302).header("Location", errUrl).build();
        }
        String userId = req.getSession(true).getId();
        Credential cred = driveService.handleCallback(code, userId);

        //if the credentials are unable to be made by drive service then we get an auth failure res
        if (cred == null) {
            String errUrl = "http://localhost:3000/revise?drive_error=auth_failed";
            return ResponseEntity.status(302).header("Location", errUrl).build();
        }
        // redirecting to frontend as we connected successfully to the users drive
        String redirect = "http://localhost:3000/revise?drive_connected=true";
        if (state != null && !state.isEmpty()) {
            redirect += "&state=" + java.net.URLEncoder.encode(state, "UTF-8");
        }
        return ResponseEntity.status(302).header("Location", redirect).build();
    }

    //  the endpoint is used after connecting to drive to actually show the files
    @GetMapping("/files")
    public ResponseEntity<?> listFiles(HttpServletRequest req) throws IOException {
        String userId = req.getSession(true).getId();
        Credential cred = driveService.loadCredential(userId);

        //error handling re-using code from the connection to double check the user is connected to drive
        if (cred == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        //now we can show the users files in drive by creating the drive attribute and listing files
        //on 20 files per page to increase viablitiy
        var drive = driveService.buildDrive(cred);
        var result = drive.files().list()
                .setPageSize(20)
                .setFields("files(id,name,mimeType)")
                .execute();

        var files = result.getFiles().stream()
                .map(f -> Map.of(
                        "id", f.getId(),
                        "name", f.getName(),
                        "mimeType", f.getMimeType() != null ? f.getMimeType() : ""
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(files);
    }

    // this is so the frontend can call this endpoint before any others to actually check the user is
    //connected to their drive without moving on to other endpoints
    @GetMapping("/authenticated")
    public ResponseEntity<?> isAuthenticated(HttpServletRequest req) throws IOException {
        String userId = req.getSession(true).getId();
        Credential cred = driveService.loadCredential(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("authenticated", cred != null);
        return ResponseEntity.ok(response);
    }

    // Gettinh the access token from the google drive account that hasbeen connected
    @GetMapping("/access-token")
    public ResponseEntity<?> getAccessToken(HttpServletRequest req) throws IOException {
        String userId = req.getSession(true).getId();
        Credential cred = driveService.loadCredential(userId);
        if (cred == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        Map<String, String> response = new HashMap<>();
        response.put("accessToken", cred.getAccessToken());
        return ResponseEntity.ok(response);
    }
}
