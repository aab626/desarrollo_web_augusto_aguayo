package dcc.aaguayo.tarea4.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "nota")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "aviso_id", nullable = false)
    @NotNull(message = "El ID del aviso es obligatorio")
    private Long avisoId;

    @Column(name = "nota", nullable = false)
    @NotNull(message = "La nota es obligatoria")
    @Min(value = 1, message = "La nota debe ser al menos 1")
    @Max(value = 7, message = "La nota debe ser como máximo 7")
    private Integer nota;

    // Constructors
    public Rating() {
    }

    public Rating(Long avisoId, Integer nota) {
        this.avisoId = avisoId;
        this.nota = nota;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getAvisoId() {
        return avisoId;
    }

    public void setAvisoId(Long avisoId) {
        this.avisoId = avisoId;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }
}
