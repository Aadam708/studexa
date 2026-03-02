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
import org.springframework.security.core.context.SecurityContextHolder; // Add this import

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.FileList;
import com.studexa.studexa.service.GoogleDriveService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
// allowCredentials = "true" so the browser sends the JWT cookie
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/drive")
public class DriveController {
    private final GoogleDriveService driveService;

    public DriveController(GoogleDriveService driveService) {
        this.driveService = driveService;
    }

    //  getting the email from the JWT filter
    private String getUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            return auth.getName(); // Returns the logged-in email
        }
        throw new RuntimeException("User is not logged in!");
    }

    //getting the current user details from their session and setting up the google drive authentication process
    @GetMapping("/auth-url")
    public ResponseEntity<?> getAuthUrl() {
        // changed code: Use JWT email instead of session
        String userId = getUserId();
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
            @RequestParam(required = false) String state) throws IOException {
        if (error != null) {
            String errUrl = "http://localhost:3000/revise?drive_error=" + java.net.URLEncoder.encode(error, "UTF-8");
            return ResponseEntity.status(302).header("Location", errUrl).build();
        }
        if (code == null) {
            String errUrl = "http://localhost:3000/revise?drive_error=missing_code";
            return ResponseEntity.status(302).header("Location", errUrl).build();
        }

        //  the email is the id in this case as i stored that only in the jwt
        String userId = getUserId();
        Credential cred = driveService.handleCallback(code, userId);

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
    public ResponseEntity<?> listFiles() throws IOException {
        //loading the users email again to show their files
        String userId = getUserId();
        Credential cred = driveService.loadCredential(userId);

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
    public ResponseEntity<?> isAuthenticated() {
        try {
            //try to find credentials for the logged-in email
            String userId = getUserId();
            Credential cred = driveService.loadCredential(userId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("authenticated", cred != null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // If user isn't logged in with JWT return false
            Map<String, Boolean> response = new HashMap<>();
            response.put("authenticated", false);
            return ResponseEntity.ok(response);
        }
    }

    // Gettinh the access token from the google drive account that hasbeen connected
    @GetMapping("/access-token")
    public ResponseEntity<?> getAccessToken() throws IOException {
        //  Usinh JWT email
        String userId = getUserId();
        Credential cred = driveService.loadCredential(userId);
        if (cred == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        Map<String, String> response = new HashMap<>();
        response.put("accessToken", cred.getAccessToken());
        return ResponseEntity.ok(response);
    }
}
