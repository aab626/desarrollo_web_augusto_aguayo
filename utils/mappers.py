# Maps a region output from the db to a dict
def map_region(region) -> dict:
    pass

# Maps an adoption listing return from the database to a dict
def map_adoption_listing(listing) -> dict:
    if listing is None:
        return None

    municipality = listing.comuna
    region = municipality.region if municipality and hasattr(municipality, "region") else None

    mapping = {
        "id": listing.id,
        "date_input": listing.fecha_ingreso,
        "municipality": {
            "id": municipality.id,
            "name": municipality.nombre,
            "region_id": municipality.region_id,
        },
        "region": {
            "id": region.id,
            "name": region.nombre,
        },
        "sector": listing.sector,
        "name": listing.nombre,
        "email": listing.email,
        "phone_number": listing.celular,
        "type": listing.tipo,
        "quantity": listing.cantidad,
        "age": listing.edad,
        "age_unit": listing.unidad_medida,
        "date_delivery": listing.fecha_entrega,
        "description": listing.descripcion,
        "photos": [
            {
                "id": foto.id,
                "file_route": foto.ruta_archivo,
                "file_name": foto.nombre_archivo,
            }
            for foto in listing.fotos
        ],
        "contact_methods": [
            {
                "id": contacto.id,
                "name": contacto.nombre,
                "identifer": contacto.identificador,
            }
            for contacto in listing.contactos
        ],
    }

    return mapping

# Structures region/municipality db output to json js-ready data
def jsonify_region_municipality_data(regions, municipalities):
    print(regions)
