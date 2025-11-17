package dcc.aaguayo.tarea4.models;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "region")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Municipality> comunas;

    // Constructors
    public Region() {
    }

    public Region(String nombre) {
        this.nombre = nombre;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<Municipality> getComunas() {
        return comunas;
    }

    public void setComunas(List<Municipality> comunas) {
        this.comunas = comunas;
    }
}
