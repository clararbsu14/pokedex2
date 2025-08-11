#!/bin/bash
# filepath: /home/brodalucas/Documents/ISEN/Projet_web/my-pokedex/backend/setupdb.sh

# Variables
DB_NAME="pokedex"
DB_USER="pokedex_user"
DB_PASSWORD="password123"
SCHEMA_FILE="schema.sql"
AUTH_SCHEMA_FILE="auth_schema.sql"
DATA_IMPORT_SCRIPT="import.js"
DATA_USER_SCRIPT="create_user.js"

# Création de la base de données et de l'utilisateur
mysql -u root -p -e "
DROP DATABASE IF EXISTS ${DB_NAME};
CREATE DATABASE ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
"

# Importation du fichier schema.sql
mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${SCHEMA_FILE}

# Importation du fichier auth_schema.sql
mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < ${AUTH_SCHEMA_FILE}

# Exécution du script d'importation des données et de création de l'utilisateur
node ${DATA_IMPORT_SCRIPT}

echo "Base de données configurée avec succès."