package dcc.aaguayo.tarea4.models;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "comuna")
public class Municipality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @Column(name = "region_id", nullable = false, insertable = false, updatable = false)
    private Long regionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @OneToMany(mappedBy = "comuna", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AdoptionListing> avisos;

    // Constructors
    public Municipality() {
    }

    public Municipality(String nombre, Region region) {
        this.nombre = nombre;
        this.region = region;
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

    public Long getRegionId() {
        return regionId;
    }

    public void setRegionId(Long regionId) {
        this.regionId = regionId;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public List<AdoptionListing> getAvisos() {
        return avisos;
    }

    public void setAvisos(List<AdoptionListing> avisos) {
        this.avisos = avisos;
    }
}
