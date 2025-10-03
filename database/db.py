from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload
import utils.fieldnames.new_listing as listingFields
from datetime import datetime

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


# DB Models

class Region(Base):
    __tablename__ = 'region'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Municipality", back_populates="region", cascade="all, delete-orphan")


class Municipality(Base):
    __tablename__ = 'comuna'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(BigInteger, ForeignKey('region.id', ondelete='CASCADE'), nullable=False)

    region = relationship("Region", back_populates="comunas")
    avisos = relationship("AdoptionListing", back_populates="comuna", cascade="all, delete-orphan")


class AdoptionListing(Base):
    __tablename__ = 'aviso_adopcion'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime)
    comuna_id = Column(BigInteger, ForeignKey('comuna.id', ondelete='CASCADE'), nullable=False)
    sector = Column(String(200))
    nombre = Column(String(200))
    email = Column(String(100))
    celular = Column(String(15))
    tipo = Column(Enum('gato', 'perro', name='tipo_mascota'))
    cantidad = Column(Integer)
    edad = Column(Integer)
    unidad_medida = Column(Enum('a', 'm', name='unidad_medida_edad'))
    fecha_entrega = Column(DateTime)
    descripcion = Column(Text)

    comuna = relationship("Municipality", back_populates="avisos")
    fotos = relationship("Photo", back_populates="aviso", cascade="all, delete-orphan")
    contactos = relationship("ContactMethod", back_populates="aviso", cascade="all, delete-orphan")


class Photo(Base):
    __tablename__ = 'foto'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300))
    nombre_archivo = Column(String(300))
    actividad_id = Column(BigInteger, ForeignKey('aviso_adopcion.id', ondelete='CASCADE'), nullable=False)

    aviso = relationship("AdoptionListing", back_populates="fotos")


class ContactMethod(Base):
    __tablename__ = 'contactar_por'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(Enum('whatsapp', 'telegram', 'x', 'instagram', 'tiktok', 'otro', name='medio_contacto'))
    identificador = Column(String(150))
    actividad_id = Column(BigInteger, ForeignKey('aviso_adopcion.id', ondelete='CASCADE'), nullable=False)

    aviso = relationship("AdoptionListing", back_populates="contactos")


# DB Functions

def get_all_regions():
    with SessionLocal() as session:
        regions = session.query(Region).order_by(Region.id.asc()).all()
    
    return regions

def get_municipality_by_name(name: str):
    with SessionLocal() as session:
        municipality = (
            session.query(Municipality)
            .filter_by(nombre = name)
            .first()
        )
    
    return municipality

def get_all_municipalities_by_region_id(id: int):
    with SessionLocal() as session:
        municipalities = (
            session.query(Municipality)
            .filter_by(region_id = id)
            .order_by(Municipality.nombre.asc())
            .all()
        )

    return municipalities

def get_all_municipalities_by_region_name(name: str):
    with SessionLocal() as session:
        municipalities = (
            session.query(Municipality)
            .join(Region)
            .filter(Region.nombre == name)
            .order_by(Municipality.nombre.asc())
            .all()
        )

    return municipalities

def get_regions_data():
    regions_data = []
    for region in get_all_regions():
        region_dict = dict()
        region_dict['region'] = region.nombre

        municipalities = get_all_municipalities_by_region_id(region.id)
        region_dict['comunas'] = [m.nombre for m in municipalities]

        regions_data.append(region_dict)

    return regions_data


def get_listing_by_id(id: int):
    with SessionLocal() as session:
        listing = (
            session.query(AdoptionListing)
            .options(
                joinedload(AdoptionListing.comuna),
                joinedload(AdoptionListing.contactos),
                joinedload(AdoptionListing.fotos),
            )
            .filter_by(id=id)
            .first()
        )
    
    return listing


def get_last_listings(n: int):
    with SessionLocal() as session:
        listings = (
            session.query(AdoptionListing)
            .options(joinedload(AdoptionListing.comuna))
            .order_by(AdoptionListing.fecha_ingreso.desc())
            .limit(n)
            .all()
        )

    return listings


def get_listings_by_page(page: int, listings_per_page: int):
    page = max(page, 1)
    listing_limit = listings_per_page + 1
    listing_start = (page - 1) * listings_per_page
    # print(page, listing_start, listing_limit)

    with SessionLocal() as session:
        listings = (
            session.query(AdoptionListing)
            .options(
                joinedload(AdoptionListing.comuna),
                joinedload(AdoptionListing.contactos),
                joinedload(AdoptionListing.fotos),
            )
            .order_by(AdoptionListing.fecha_ingreso.desc())
            .offset(listing_start)
            .limit(listing_limit)
            .all()
        )

        has_next_page = len(listings) > listings_per_page
        listings = listings[:listings_per_page]

    return {
        'data': listings,
        'page': page,
        'listings_per_page': listings_per_page,
        'has_prev_page': page > 1,
        'has_next_page': has_next_page,
        'prev_page': page - 1 if page > 1 else None,
        'next_page': page + 1 if has_next_page else None,
    }


def get_first_photo_by_listing_id(listing_id: int):
    with SessionLocal() as session:
        photo = (
            session.query(Photo)
            .filter_by(actividad_id=listing_id)
            .first()
        )

        return photo

def create_listing(form):
    with SessionLocal() as session:
        age_units_raw = form.get(listingFields.FIELD_PET_AGE_UNITS)
        new_listing = AdoptionListing(
            fecha_ingreso=datetime.now(),
            comuna_id = get_municipality_by_name(form.get(listingFields.FIELD_MUNICIPALITY)).id,
            sector = form.get(listingFields.FIELD_SECTOR),
            nombre = form.get(listingFields.FIELD_PERSON_NAME),
            email = form.get(listingFields.FIELD_PERSON_EMAIL),
            celular = form.get(listingFields.FIELD_PERSON_PHONE),
            tipo = form.get(listingFields.FIELD_PET_TYPE),
            cantidad = int(form.get(listingFields.FIELD_PET_QUANTITY)),
            edad = int(form.get(listingFields.FIELD_PET_AGE)),
            unidad_medida = 'm' if age_units_raw == 'meses' else 'a',
            fecha_entrega = datetime.fromisoformat(form.get(listingFields.FIELD_DELIVERY_TIME)),
            descripcion = form.get(listingFields.FIELD_DESCRIPTION)
        )
        
        session.add(new_listing)
        session.flush()
        listing_id = new_listing.id
        session.commit()

    return listing_id


def create_photo(file_route, file_name, listing_id):
    with SessionLocal() as session:
        new_photo = Photo(
            ruta_archivo = file_route,
            nombre_archivo = file_name,
            actividad_id = listing_id
        )

        session.add(new_photo)
        session.flush()
        photo_id = new_photo.id
        session.commit()

    return photo_id


def create_contact_method(contact_name, contact_id, listing_id):
    with SessionLocal() as session:
        new_contact_method = ContactMethod(
            nombre = contact_name,
            identificador  =contact_id,
            actividad_id = listing_id
        )


        session.add(new_contact_method)
        session.flush()
        contact_method_id = new_contact_method.id
        session.commit()

    return contact_method_id
