package dcc.aaguayo.tarea4.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "aviso_adopcion")
public class AdoptionListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso;

    @Column(name = "comuna_id", nullable = false, insertable = false, updatable = false)
    private Long comunaId;

    @Column(name = "sector", length = 200)
    private String sector;

    @Column(name = "nombre", length = 200)
    private String nombre;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "celular", length = 15)
    private String celular;

    @Column(name = "tipo")
    @Enumerated(EnumType.STRING)
    private TipoMascota tipo;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "edad")
    private Integer edad;

    @Column(name = "unidad_medida")
    @Enumerated(EnumType.STRING)
    private UnidadMedidaEdad unidadMedida;

    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "comuna_id", nullable = false)
    private Municipality comuna;

    // Enums
    public enum TipoMascota {
        gato, perro
    }

    public enum UnidadMedidaEdad {
        a, m
    }

    // Constructors
    public AdoptionListing() {
    }

    public AdoptionListing(LocalDateTime fechaIngreso, Municipality comuna, String sector,
            String nombre, String email, String celular, TipoMascota tipo,
            Integer cantidad, Integer edad, UnidadMedidaEdad unidadMedida,
            LocalDateTime fechaEntrega, String descripcion) {
        this.fechaIngreso = fechaIngreso;
        this.comuna = comuna;
        this.sector = sector;
        this.nombre = nombre;
        this.email = email;
        this.celular = celular;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.edad = edad;
        this.unidadMedida = unidadMedida;
        this.fechaEntrega = fechaEntrega;
        this.descripcion = descripcion;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDateTime fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public Long getComunaId() {
        return comunaId;
    }

    public void setComunaId(Long comunaId) {
        this.comunaId = comunaId;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public TipoMascota getTipo() {
        return tipo;
    }

    public void setTipo(TipoMascota tipo) {
        this.tipo = tipo;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public UnidadMedidaEdad getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(UnidadMedidaEdad unidadMedida) {
        this.unidadMedida = unidadMedida;
    }

    public LocalDateTime getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDateTime fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Municipality getComuna() {
        return comuna;
    }

    public void setComuna(Municipality comuna) {
        this.comuna = comuna;
    }
}
