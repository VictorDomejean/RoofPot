//Initialisation de la carte 
var map1 = L.map('map1');
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
map1.setView([45.76, 4.85], 13);

//ajout de basemaps supplémentaires
var osmhumanUrl='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
var osmhuman = new L.TileLayer(osmhumanUrl, {attribution: osmAttrib}).addTo(map1); 

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// ajout du geocoder et de l'échelle 
L.control.scale({imperial: false}).addTo(map1); 
L.Control.geocoder({
  position: 'topleft',
}).addTo(map1);


//Permet de redimensionner la carte pour l'afficher correctement dans les tabs Bootstrap 
$("a[href='#nav-home']").on('shown.bs.tab', function(e) {
    map1.invalidateSize();
});

//Appel des couches a charger avec la fonction fecth (plus simple que les xhtpp request)
// async function getDataArrond() {
//     const response = await fetch("php/arrondissements.php");
//     const data = await response.json();
//     const geojson = L.geoJSON(data, 
//       {style:{
//         color: '#858585'
//       },onEachFeature: function(feature, layer) {
// 				layer.on({
// 					'add': function(){
// 					  layer.bringToBack()}})}});
//     geojson.addTo(map1);
//     return geojson;
//   }

//Appel des couches a charger avec la fonction fecth (plus simple que les xhtpp request)
// async function getDataJardins() {
//     const response = await fetch("php/jardins.php");
//     const data = await response.json();
//     return data;
//   }

// Définition du main 
// async function main() {

// recuperation des reponses des fonctions asynchrones 
// const arrond = await getDataArrond()
// const jardins = await getDataJardins() 

const arrond =  L.geoJSON(arrond1, 
        {style:{
          color: '#858585'
        },onEachFeature: function(feature, layer) {
  				layer.on({
  					'add': function(){
              layer.bringToBack()}})}}).addTo(map1);
              
// const data = (jardins1); 
// console.log(jardins1); 
// definition des icones des jardins existants 
var greenIcon = new L.Icon({
  iconUrl: 'img/Icone_Jardins_Partages.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -20],
  shadowSize: [41, 41]
});
var violetIcon = new L.Icon({
  iconUrl: 'img/Icone_Jardins_Insertion.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -20],
  shadowSize: [41, 41]
});
var orangeIcon = new L.Icon({
  iconUrl: 'img/Icone_Jardins_Familiaux.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [30, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -20],
  shadowSize: [41, 41]
});

// console.log(jardins.json()); 


// ajout de la couche des jardins et filtre par type
var jar_flt = L.layerGroup().addTo(map1);

const familiaux = L.geoJSON(jardins1,
  {
  pointToLayer: function(feature, latlng) {
  // var type = feature.properties.n_type;  
  return L.marker(latlng, {icon: orangeIcon}); 
  },
  filter: function(feature, layer){
    return(feature.properties.n_type == "familiaux")
  },                    
  onEachFeature: function (feature, layer) {
    let text = feature.properties.title +'  : jardins ' + feature.properties.n_type ;
    layer.bindPopup(text);
  },
}).addTo(jar_flt);

const partages = L.geoJSON(jardins1,
  {
  pointToLayer: function(feature, latlng) {
  // var type = feature.properties.n_type;  
  return L.marker(latlng, {icon: greenIcon}); 
  },
  filter: function(feature, layer){
    return(feature.properties.n_type == "partagés")
  },                    
  onEachFeature: function (feature, layer) {
    let text = feature.properties.title +'  : jardins ' + feature.properties.n_type ;
    layer.bindPopup(text);
  },
}).addTo(jar_flt);

const insertion = L.geoJSON(jardins1,
  {
  pointToLayer: function(feature, latlng) {
  // var type = feature.properties.n_type;  
  return L.marker(latlng, {icon: violetIcon}); 
  },
  filter: function(feature, layer){
    return(feature.properties.n_type == "insertion")
  },                    
  onEachFeature: function (feature, layer) {
    let text = feature.properties.title +'  : jardins ' + feature.properties.n_type ;
    layer.bindPopup(text);
  },
}).addTo(jar_flt);

// fonction de filtre des jardins 
$("input:checkbox").click(function(e) {
  if ($(this).is(":checked")) {    
    if (this.value == "jardins familiaux"){
      familiaux.addTo(jar_flt)
    }
    else if (this.value == "jardins partagés"){
      partages.addTo(jar_flt)
    }
    else {
      insertion.addTo(jar_flt)
    }
  }
  else {
    if (this.value == "jardins familiaux"){
      familiaux.remove()

    }
    else if (this.value == "jardins partagés"){
      partages.remove() 
    }
    else {insertion.remove()}
  }
});
    

//groupe de couche et de basemaps et layerControl
var baseMaps = {
    "OSM": osm,
    "OSM Humanitarian": osmhuman, 
    "Satellite": Esri_WorldImagery
};

var overlayMaps = {
    "Initiatives existantes": jar_flt,
    "Arrondissement": arrond
};

//Ajout d'un bouton de gestion des calques
L.control.layers(baseMaps, overlayMaps).addTo(map1);

// la légende 
$("#legendlogo").click(function(event) {
  openLeg()
});

// appel du main 
// }
// main();

