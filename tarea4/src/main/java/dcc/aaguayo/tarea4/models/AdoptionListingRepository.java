package dcc.aaguayo.tarea4.models;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdoptionListingRepository extends JpaRepository<AdoptionListing, Long> {
    
    Page<AdoptionListing> findAllByOrderByFechaIngresoDesc(Pageable pageable);
    
}
