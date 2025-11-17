package dcc.aaguayo.tarea4.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import dcc.aaguayo.tarea4.services.ApiService;

// Web controller, handles page rendering request
@Controller
public class AppController {
    
    private final ApiService apiService;
    
    // Constructor for ApiService dependency
    public AppController(ApiService apiService) {
        this.apiService = apiService;
    }
    
    // Displays the rate listings paeg
    @GetMapping("/rate_listings")
    public String rateListingsRoute(Model model) {
        List<Map<String, String>> listingsData = apiService.getListingsData();
        model.addAttribute("listings", listingsData);
        
        return "rate_listings";
    }
}
