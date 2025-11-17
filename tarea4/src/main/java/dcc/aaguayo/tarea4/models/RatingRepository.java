package dcc.aaguayo.tarea4.models;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    
    List<Rating> findByAvisoId(Long avisoId);

}
