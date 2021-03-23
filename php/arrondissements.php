<?php
// paramètrage de la connexion vers la base de données RoofPot
$host = 'localhost'; // localhost
$dbname = 'roofpot'; // Base de données sur laquelle on souhaite se connecter
$username = 'postgres'; // par défaut postgres, si un autre user a été défini il afut changer ici
$password = 'geonum'; // mot de passe de connexion à postgressql, par défaut postgres
$port = '5432'; // port local 5432

//On assigne la connexion dans une variable globale 
$dsn = "pgsql:host=$host;port=$port;dbname=$dbname;user=$username;password=$password";

// Test de la connexion
try{
    $db = new PDO($dsn); // 
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } catch (PDOException $e){
    echo $e->getMessage();
}


//  recupération de la varibable db pour faire des requêtes
global $db;

//Récupération des arrondissements avec un requête simple 
$q = $db->prepare("with arrond1 as(SELECT * FROM arrond)    
SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(ST_AsGeoJSON(arrond1.*)::json)
) as Arrond2
from arrond1;"
); 


//exécution de la requête 
$q->execute();

//On applique un fetch() sur le resultat pour le mettre en forme
$result = $q->fetch();


//Renvoi du résultat qui se trouve dans un tableau à une ligne et une colonne 
echo $result[0]; 
?>
