package dcc.aaguayo.tarea4.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;

import dcc.aaguayo.tarea4.services.ApiService;
import dcc.aaguayo.tarea4.models.Rating;
import dcc.aaguayo.tarea4.dto.RatingRequest;

// REST API Controller, handles rating-related endpoints
@RestController
@RequestMapping("/api")
@Validated
public class ApiController {

    @Autowired
    private ApiService apiService;

    // Gets ratings for specific adoption listiong
    @GetMapping("/listings/{listingId}/ratings")
    public ResponseEntity<List<Rating>> getListingRatings(@PathVariable Long listingId) {
        List<Rating> ratings = apiService.getRatingsByListingId(listingId);
        return ResponseEntity.ok(ratings);
    }

    // Submits new rating for an adoption listing
    @PostMapping("/listings/{listingId}/ratings")
    public ResponseEntity<Rating> addRating(@PathVariable Long listingId, @Valid @RequestBody RatingRequest request) {
        Rating rating = apiService.addRating(listingId, request.getNota());
        return ResponseEntity.ok(rating);
    }

}
