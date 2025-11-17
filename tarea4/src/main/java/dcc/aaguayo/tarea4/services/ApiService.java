package dcc.aaguayo.tarea4.services;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import dcc.aaguayo.tarea4.models.AdoptionListing;
import dcc.aaguayo.tarea4.models.AdoptionListingRepository;
import dcc.aaguayo.tarea4.models.Rating;
import dcc.aaguayo.tarea4.models.RatingRepository;

// Service layer, handles loggic related to adoption listings and ratings
@Service
public class ApiService {

    private final AdoptionListingRepository adoptionListingRepository;
    private final RatingRepository ratingRepository;

    // Constructor
    public ApiService(AdoptionListingRepository adoptionListingRepository, RatingRepository ratingRepository) {
        this.adoptionListingRepository = adoptionListingRepository;
        this.ratingRepository = ratingRepository;
    }

    // Retrieves all adoption listings, formatted for dispolay
    public List<Map<String, String>> getListingsData() {
        // GGet all listins ordered by most recent
        List<AdoptionListing> listings = adoptionListingRepository.findAllByOrderByFechaIngresoDesc(PageRequest.of(0, Integer.MAX_VALUE)).getContent();
        List<Map<String, String>> listingsData = new ArrayList<>();
        
        // Format date according to flask format 
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        // Convert listing entity to a map
        for (AdoptionListing listing : listings) {
            Map<String, String> listingData = new HashMap<>();
            listingData.put("id", listing.getId().toString());
            listingData.put("fechaPublicacion", listing.getFechaIngreso().format(formatter));
            listingData.put("sector", listing.getSector() != null ? listing.getSector() : "");
            listingData.put("cantidad", listing.getCantidad().toString());
            listingData.put("tipo", listing.getTipo().toString());
            
            // Format age units
            String edad = listing.getEdad().toString() + " ";
            edad += (listing.getUnidadMedida() == AdoptionListing.UnidadMedidaEdad.a) ? "años" : "meses";
            listingData.put("edad", edad);
            
            listingData.put("comuna", listing.getComuna().getNombre());
            
            // Default rating when no ratings are available
            listingData.put("nota", "-");

            listingsData.add(listingData);
        }
        
        return listingsData;
    }

    // Returns all ratings for specific adoption listing
    public List<Rating> getRatingsByListingId(Long listingId) {
        return ratingRepository.findByAvisoId(listingId);
    }

    // Creates a new rating for an adoption listin g
    public Rating addRating(Long listingId, Integer nota) {
        Rating rating = new Rating();
        rating.setAvisoId(listingId);
        rating.setNota(nota);
        return ratingRepository.save(rating);
    }

}
