from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, DateTime, Enum, Text
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from utils import mappers

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

def get_all_municipalities_by_region_id(id: int):
    with SessionLocal() as session:
        municipalities = (
            session.query(Municipality)
            .filter_by(region_id=id)
            .order_by(Municipality.nombre.asc())
            .all()
        )

    return municipalities


def get_listing_by_id(id: int):
    session = SessionLocal()
    listing = session.query(AdoptionListing).filter_by(id=id).first()
    session.close()
    return listing

def get_last_listings(n: int):
    with SessionLocal() as session:
        listings = (
            session.query(AdoptionListing)
            .order_by(AdoptionListing.fecha_ingreso.desc())
            .limit(n)
            .all()
        )

        listings_mapped = [mappers.map_adoption_listing(item) for item in listings]
    
    return listings_mapped