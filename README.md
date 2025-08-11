# Pokedex

## Commandes basiques à lancer afin de setup le projet : 
```
- npm i
```

## Nous avons décider pour ce projet de mettre en place une base de données MySQL.

## Afin de pouvoir d'avoir la base de données en local, il faut exécuter les commandes suivantes : 
```
- sudo apt update
- sudo apt install mysql-server -y
- sudo systemctl status mysql (pour vérifier si MySQL a bien été installé)
- sudo systemctl start mysql (pour démarrer MySQL)
- bash setupbd.sh -> le script permettant de créer la base de données et de la remplir avec les données du fichier "pokedex.json"
- Il faudra rentrer le mot de passe root lorsque l'on vous demandera de rentrer un mot de passe au lancement du script