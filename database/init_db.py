from pathlib import Path
from sqlalchemy import text
from .db import Base, engine

# SQL Scripts
BASE_DIR = Path(__file__).resolve().parent
CREATE_DB_SQL = BASE_DIR / 'create_db.sql'
CREATE_USER_SQL = BASE_DIR / 'create_user.sql'
POPULATE_REGION_SQL = BASE_DIR / 'populate_region.sql'
POPULATE_COMUNA_SQL = BASE_DIR / 'populate_comuna.sql'

# Helper function to run SQL code from a .sql script
def run_sql_file(path, commit=False):
    sql = Path(path).read_text(encoding='utf-8')
    queries = [s.strip() for s in sql.split('\n')]
    with engine.connect() as conn:
        for query in queries:
            if query != '':
                conn.execute(text(query))

        if commit:
            conn.commit()


# Execution block
if __name__ == "__main__":
    # Create tables from models
    Base.metadata.create_all(engine)
    print("Database Initialized")

    # Populate region and comuna tables
    run_sql_file(POPULATE_REGION_SQL, commit=True)
    run_sql_file(POPULATE_COMUNA_SQL, commit=True)
