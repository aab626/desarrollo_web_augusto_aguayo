package dcc.aaguayo.tarea4.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * Data Transfer Object for rating submission requests.
 * Only contains the rating value, while the listing ID comes from the URL path.
 */
public class RatingRequest {

    @NotNull(message = "La nota es obligatoria")
    @Min(value = 1, message = "La nota debe ser al menos 1")
    @Max(value = 7, message = "La nota debe ser como máximo 7")
    private Integer nota;
    
    // Validation to ensure exact values 1-7
    public void setNota(Integer nota) {
        if (nota != null && (nota < 1 || nota > 7)) {
            throw new IllegalArgumentException("La nota debe ser exactamente 1, 2, 3, 4, 5, 6 o 7");
        }
        this.nota = nota;
    }

    // Constructors
    public RatingRequest() {
    }

    public RatingRequest(Integer nota) {
        this.nota = nota;
    }

    // Getters and Setters
    public Integer getNota() {
        return nota;
    }
}
