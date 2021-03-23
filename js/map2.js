//Initialisation de la carte 
var map2 = L.map('map2');
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osm2 = new L.TileLayer(osmUrl, {attribution: osmAttrib}); 
map2.setView([45.76, 4.85], 16);

// ajout du geocoder et de l'échelle 
L.control.scale({imperial: false}).addTo(map2); 
L.Control.geocoder({
	position: 'topleft',
}).addTo(map2);

//ajout de basemaps supplémentaires
var osmhumanUrl2='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
var osmhuman2 = new L.TileLayer(osmhumanUrl2, {attribution: osmAttrib}).addTo(map2);

var Esri_WorldImagery2 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// ne pas afficher certaines div au chargement de la page 
window.onload=function(){
	document.getElementById("fiche1").style.display='none';
	document.getElementById("fiche2").style.display='none';
	document.getElementById("fiche3").style.display='none';
	document.getElementById("carou").style.display='none';
	document.getElementById("myChart3").style.display='none';
  }

//Permet de redimensionner la carte pour l'afficher correctement dans les tabs Bootstrap 
$("a[href='#nav-profile']").on('shown.bs.tab', function(e) {
    map2.invalidateSize();
});

//Appel des couches a charger avec la fonction fecth (plus simple que les xhtpp request)
// async function getDataArrond2() {
//     const response = await fetch("php/arrondissements.php");
//     const data = await response.json();
// 	const geojson = L.geoJSON(data, 
// 		{style:{
// 			color: '#858585'
// 		},
// 		onEachFeature: function(feature, layer) {
// 				layer.on({
// 					'add': function(){
// 					  layer.bringToBack()}})}});
//     geojson.addTo(map2);
//     return geojson;
//   }

// async function getDataToits() {
//     const response = await fetch("php/toits.php");
//     const data = await response.json();
//     return data;
//   }

//   // recuperation des reponses des fonctions asynchrones 
// async function main2() {
// 	const arrond2 = await getDataArrond2()
// 	const toits = await getDataToits()

const arrond2 =  L.geoJSON(arrond1, 
	{style:{
	  color: '#858585'
	},onEachFeature: function(feature, layer) {
			  layer.on({
				  'add': function(){
		  layer.bringToBack()}})}}).addTo(map2);

var pot_flt = L.layerGroup().addTo(map2);


//Ajout de la couche des toits avec une symbologie correspondant à son roof'potentiel
let toit = L.choropleth(toits, {
	valueProperty: 'scoring', // which property in the features to use
	scale: ['EBF9ED', 'CCF1D2', '6EC6BA', '008080'], // chroma.js scale - include as many as you like
	steps: 6, // number of breaks or steps in range
	mode: 'q', // q for quantile, e for equidistant, k for k-means
	onEachFeature: onEachFeature,
	style: {
		color: '#fff', // border color
		weight: 0.5,
		fillOpacity: 0.8, 
	}
}).addTo(pot_flt); 

//Ajout de la légende
var legend = L.control({position: 'bottomleft'});
legend.onAdd = function (map2) {
	
    var div = L.DomUtil.create('div', 'info legend')
    var limits = toit.options.limits
    var colors = toit.options.colors
    var labels = []

    // Add min & max
	div.innerHTML = 
	'Roofpotentiel<div class="labels"><div class="min">' + '0' + '</div> \
	<div id="limit0" class="50 %">' + limits[0] +  '</div> \
			<div id="limit1" class="50 %">' + limits[1] +  '</div> \
			<div id="limit2" class="step">' + limits[2] +  '</div> \
			<div id="limit3" class="step">' + limits[3] +  '</div> \
			<div id="limit4" class="step">' + limits[4] +  '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'
    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(map2)

// //pour la mise en évidence de la séléction du toit
function highlight (layer) {
	layer.setStyle({
		color: '#FCF3CF', 
		weight: 5
	});
}
function dehighlight (layer) {
  if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
	  toit.resetStyle(layer);
  }
}


//Fonction pour filter les toits en cliquant sur un bouton
$('#validateform').click(function(event) {
	pot_flt.clearLayers();
	event.preventDefault();
	var surf = $('#inputform').val()
	var score = $('#scoringInputId').val()
	var prop = $('#propinput').val()
	L.choropleth(toits, {
		valueProperty: 'scoring', // which property in the features to use
		scale: ['EBF9ED', 'CCF1D2', '6EC6BA', '008080'], // chroma.js scale - include as many as you like
		steps: 6, // number of breaks or steps in range
		mode: 'q', // q for quantile, e for equidistant, k for k-means
		filter: function (feature, layer) {
            if (prop == "...")
				return(feature.properties.shape_area > surf && feature.properties.scoring >= score)
			else
				return (feature.properties.shape_area > surf && feature.properties.scoring >= score && feature.properties.prop == prop)
				
		},
		onEachFeature: onEachFeature, 
		style: {
			color: '#fff', // border color
			weight: 0.5,
			fillOpacity: 0.8, 
		}
	}).addTo(pot_flt);
});

//Fonction pour réinitialiser la couche en cliquant sur le bouton
$('#reinitialiserform').click(function(event) {
	$('#inputform').val(0)
	$('#scoringInputId').val(0)
	$('#propinput').val("...")
	pot_flt.clearLayers();
	event.preventDefault();
	toit.addTo(pot_flt);
});

// selection des toits et zoom 
function select (layer) {
  if (selected !== null) {
	var previous = selected;
  }
	map2.fitBounds(layer.getBounds());
	selected = layer;
	if (previous) {
	  dehighlight(previous);
	}
}

var selected = null;

//groupe de couche et de basemaps et layerControl
var baseMaps2 = {
    "OSM": osm2,
    "OSM Humanitarian": osmhuman2, 
    "Satellite": Esri_WorldImagery2
};
var overlayMaps2 = {
	"Toits plats" : pot_flt, 
    "Arrondissements": arrond2
};

//Ajout d'un bouton de gestion des calques
L.control.layers(baseMaps2, overlayMaps2).addTo(map2);

//Interaction au click sur la couche des toits
function onEachFeature(feature, layer) {
    layer.on({
		'mouseover': function (e) {
			highlight(e.target);
		  },
		  'mouseout': function (e) {
			dehighlight(e.target);
		  }, 
		'click': function(e)
			{
				// enlever les interaction avec la carte sur une div 
				$('#mySidepanel.sidepanel').mousedown( function() {
					map2.dragging.disable();
				  });
				  $('html').mouseup( function() {
					map2.dragging.enable();
				});
				// ouverture du panel 
			openNav(e.target),
			// affichage des graphiques 
			document.getElementById("myChart").style.display='block';
			document.getElementById("myChart3").style.display='none';
			// fermeture de la comparaison 
			// selection des toits 
			select(e.target), 
			// information dans le panel sur le toit sélectionné 
			document.getElementById("5").innerHTML = "<strong>Adresse : </strong>" + feature.properties.addr_numer + feature.properties.addr_nom_1 + "<br>" +  "<strong>Type : </strong>" + feature.properties.prop + "<br>" + "<strong>Usage : </strong>" + feature.properties.usage1  + "<br>" + "<strong>Pluviométrie : </strong>" + feature.properties.pluvio_max.toFixed(2) + " mm/an"+"<br>" + "<strong>Surface : </strong>" + feature.properties.shape_area.toFixed(2) + " m²" + "<br>" + "<strong>Ensoleillement : </strong>" + feature.properties.sr_mwh.toFixed(2)  + " KWh/m²" + "<hr>"
// graphique sur l'influence des critères dans le roofpotentiel 
			var ctx1 = document.getElementById('myChart2').getContext('2d');
var chart1 = new Chart(ctx1, { 
    // The type of chart we want to create
    type: 'horizontalBar',

    // The data for our dataset
    data: {
        labels: ['Pluviométrie', 'Surface', 'Ensoleillement', 'Solidité'],
        datasets: [{
			backgroundColor: ['rgb(26, 196, 179)', 
			'rgb(26, 196, 179)', 
			'rgb(26, 196, 179)', 'rgb(26, 196, 179)'],  
            borderColor: 'rgb(255, 99, 132)',
            data: [e.target.feature.properties.pluviok, e.target.feature.properties.surfacek, e.target.feature.properties.expok, e.target.feature.properties.solidek]
        }]
    },

    // Configuration options go here
	options: {
		// animation: {
        //     duration: 0 // general animation time
        // },
		events: [], 
		legend: {
			display: false}, 
			scales: {
				xAxes: [{
					ticks: {
						max: 5,
						min: 0,
						stepSize: 1, 
						display: false
					}
				}]
			}
	}
}); 
// graphique du roofpotentiel 
var ctx2 = document.getElementById('myChart').getContext('2d');
$('#PluvioInputId').val(1)
$('#PluvioOutputId').val(1)
$('#SurfaceInputId').val(1)
$('#SurfaceOutputId').val(1)
$('#ExpoInputId').val(1)
$('#ExpoOutputId').val(1)
$('#SoliInputId').val(1)
$('#SoliOutputId').val(1)
	var chart2 =new Chart(ctx2, {
		// The type of chart we want to create
		type: 'horizontalBar',
	
		// The data for our dataset
		data: {
			datasets: [{
				backgroundColor: function(feature){
	
					var score = e.target.feature.properties.scoring;
					if (score > 90) {
						return '#008080'; 
					  } 
					  else if (score > 80) {
						return '#6EC6BA';
					  } 
					  else if (score > 75) {
						return '#A8E1CE';
					  }
					  else if (score > 70) {
						return ' #CCF1D2';
					  }
					  else if (score >= 0) {
						return '#EBF9ED';
					  };

				},
				data: [e.target.feature.properties.scoring],
				barThickness: 2,
			}]
		},
		// Configuration options go here
		options: {
			events: [], 
			legend: {
				display: false}, 
				scales: {
					xAxes: [{
						ticks: {
							max: 100,
							min: 0,
							stepSize: 20
						}
					}]
				}
		}
	});

//Fonction pour faire varier le poids des critéres et calculer à nouveau le scoring
$('#valideform').click(function(event) {
	document.getElementById("myChart3").style.display='block';
	document.getElementById("myChart").style.display='none';
	var ctx3 = document.getElementById('myChart3').getContext('2d');
	document.getElementById('mySidepanel').scroll({top:0,behavior:'smooth'});
	var pluvio = $('#PluvioInputId').val()
	var surface = $('#SurfaceInputId').val()
	var ensoleillement = $('#ExpoInputId').val()
	var solidite = $('#SoliInputId').val()
	var somme = (100/((5*pluvio)+(5*surface)+(5*ensoleillement)+(5*solidite)))*(e.target.feature.properties.pluviok * pluvio + e.target.feature.properties.expok * ensoleillement + e.target.feature.properties.surfacek * surface +  e.target.feature.properties.solidek * solidite)
		var chart3 =new Chart(ctx3, {
			// The type of chart we want to create
			type: 'horizontalBar',
		
			// The data for our dataset
			data: {
				datasets: [{
					backgroundColor: function(feature){
		
						var score = somme;
						if (score > 90) {
							return '#008080'; 
						  } 
						  else if (score > 80) {
							return '#6EC6BA';
						  } 
						  else if (score > 75) {
							return '#A8E1CE';
						  }
						  else if (score > 70) {
							return ' #CCF1D2';
						  }
						  else if (score >= 0) {
							return '#EBF9ED';
						  };
					},
					data: [somme],
					barThickness: 2,
				}]
			},
		
		
			// Configuration options go here
			options: {
				events: [], 
				legend: {
					display: false}, 
					scales: {
						xAxes: [{
							ticks: {
								max: 100,
								min: 0,
								stepSize: 20
							}
						}]
					}
			}
		});
});

//Fonction pour réinitialiser les critères par un bouton 
$('#renitform').click(function(event) {
	document.getElementById("myChart3").style.display='none';
	document.getElementById("myChart").style.display='block';
	document.getElementById('mySidepanel').scroll({top:0,behavior:'smooth'});
	$('#PluvioInputId').val(1)	//replace le slider sur la valeur 1
	$('#PluvioOutputId').val(1)
	$('#SurfaceInputId').val(1)
	$('#SurfaceOutputId').val(1)
	$('#ExpoInputId').val(1)
	$('#ExpoOutputId').val(1)
	$('#SoliInputId').val(1)
	$('#SoliOutputId').val(1)
})


//Fonction pour ouvrir les fiches en fonction du scoring 
function showButton(){
	var type = e.target.feature.properties.scoring
	  if (type >= 90) {
		return document.getElementById("fiche1").style.display='block',
		document.getElementById("fiche1body").innerHTML = "<strong>Adresse : </strong>" + feature.properties.addr_numer + feature.properties.addr_nom_1 + "<br>" +  "<strong>Type : </strong>" + feature.properties.prop + "<br>" + "<strong>Usage : </strong>" + feature.properties.usage1  + "<br>" + "<strong>Pluviométrie : </strong>" + feature.properties.pluvio_max.toFixed(2) + " mm/an"+"<br>" + "<strong>Surface : </strong>" + feature.properties.shape_area.toFixed(2) + " m²" + "<br>" + "<strong>Ensoleillement : </strong>" + feature.properties.sr_mwh.toFixed(2)  + " KWh/m²", 
		document.getElementById("fiche2").style.display='none', 
		document.getElementById("fiche3").style.display='none',
		document.getElementById("nbpersonne1").innerHTML = ((feature.properties.shape_area)*3.5/127).toFixed(0); 
	  } 
	  else if (type >= 70) {
		return document.getElementById("fiche2").style.display='block',
		document.getElementById("fiche2body").innerHTML = "<strong>Adresse : </strong>" + feature.properties.addr_numer + feature.properties.addr_nom_1 + "<br>" +  "<strong>Type : </strong>" + feature.properties.prop + "<br>" + "<strong>Usage : </strong>" + feature.properties.usage1  + "<br>" + "<strong>Pluviométrie : </strong>" + feature.properties.pluvio_max.toFixed(2) + " mm/an"+"<br>" + "<strong>Surface : </strong>" + feature.properties.shape_area.toFixed(2) + " m²" + "<br>" + "<strong>Ensoleillement : </strong>" + feature.properties.sr_mwh.toFixed(2)  + " KWh/m²", 
		document.getElementById("fiche1").style.display='none', 
		document.getElementById("fiche3").style.display='none',
		document.getElementById("nbpersonne2").innerHTML = ((feature.properties.shape_area)*2.5/127).toFixed(0); 
	  } 
	  else {
		return document.getElementById("fiche3").style.display='block',
		document.getElementById("fiche3body").innerHTML = "<strong>Adresse : </strong>" + feature.properties.addr_numer + feature.properties.addr_nom_1 + "<br>" +  "<strong>Type : </strong>" + feature.properties.prop + "<br>" + "<strong>Usage : </strong>" + feature.properties.usage1  + "<br>" + "<strong>Pluviométrie : </strong>" + feature.properties.pluvio_max.toFixed(2) + " mm/an"+"<br>" + "<strong>Surface : </strong>" + feature.properties.shape_area.toFixed(2) + " m²" + "<br>" + "<strong>Ensoleillement : </strong>" + feature.properties.sr_mwh.toFixed(2)  + " KWh/m²", 
		document.getElementById("fiche1").style.display='none', 
		document.getElementById("fiche2").style.display='none',
		document.getElementById("nbpersonne3").innerHTML = ((feature.properties.shape_area)*1.5/127).toFixed(0); 
	  }
  }; 
showButton(e.target); 

// destruction des graphiques a la fermeture du panel 
(function() { // self calling function replaces document.ready()
	//adding event listenr to button
document.querySelector('#closesidepanel').addEventListener('click',function(){
		chart1.destroy();
		chart2.destroy(); 
		});
	})();
}
})
}
// enlever les interactions sur la div du filtre des toits 
$("#filterlogo").click(function(event) {
	openFlt(),
	$('#PotFilter.sidefilter').mousedown( function() {
		map2.dragging.disable();
	  });
	  $('html').mouseup( function() {
		map2.dragging.enable();
	});
  });

//   ouverture du didacticiel 
$("#didacopen").click(function(event) {
	document.getElementById("carou").style.display='block'
});
// fermeture du didacticiel 
$("#closedidac").click(function(event) {
	document.getElementById("carou").style.display='none'
});


//Fonction pour passer en mode comparaison des toits
$("#comparaisonlogo").click(function(event) {
	closeNav();
	pot_flt.clearLayers();
	event.preventDefault();
	let t = L.choropleth(toits, {
		valueProperty: 'scoring', // which property in the features to use
		scale: ['EBF9ED', 'CCF1D2', '6EC6BA', '008080'], // chroma.js scale - include as many as you like
		steps: 5, // number of breaks or steps in range
		mode: 'q', // q for quantile, e for equidistant, k for k-means
		onEachFeature: onEachFeatureComp,
		style: {
			color: '#fff', // border color
			weight: 0.5,
			fillOpacity: 0.8, 
		}
	}).addTo(pot_flt); 
	openComp()

// passage en mode comparaison
	function onEachFeatureComp(feature, layer) {
		layer.on({
			'mouseover': function(e){
				layer.bindTooltip("Toit n°: " + String(layer.feature.properties.id).substr(14))			},
			  'click': function(e) {
				openComp()
				var layer = e.target;
				if (layer.options.color == '#00FFFF') {
					t.resetStyle(e.target);
				
					e.target.feature.properties.selected = false;
				} else {
					layer.setStyle({
						weight: 3,
						color: "#00FFFF",
						opacity: 1,
						fillOpacity: 0.1
					});
					e.target.feature.properties.selected = true;						
				}
				// suppremier la selection des toits 
				$('#zero').click(function(event) {
					var layer = e.target;
					if (layer.options.color == '#00FFFF') {
						t.resetStyle(e.target);
						e.target.feature.properties.selected = false;}
					document.getElementById("tablecomp").style.display='none';
					$('#selectedCount').text("0");
				});
				// quitter le mode comparaison 
				$('#fin').click(function(event) {
					closeComp();
					document.getElementById("filterlogo").style.pointerEvents='auto';
					document.getElementById("filter").style.background='';
					document.getElementById("tablecomp").style.display='none';
					var layer = e.target;
					if (layer.options.color == '#00FFFF') {
						e.target.feature.properties.selected = false;}
					$('#selectedCount').text("0");
					pot_flt.clearLayers();
					event.preventDefault();
					toit.addTo(pot_flt);
				});		
				//recuperer les information des toits selectionnés  
				getAllElements();
				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToFront();
				}
			}
		})
	}
});

// définition de la fonction de recuperation des informations des toits 
function getAllElements() {
	var selectedFeatureScore = new Array();
	var selectedFeatureSurface = [];
	var selectedFeatureEnso = [];
	var selectedFeatureProp = [];
	var selectedFeatureID = [];

	// ajoutes les infomrations dans un array 
	$.each(map2._layers, function (ml) {
		if (map2._layers[ml].feature && map2._layers[ml].feature.properties.selected === true) {
			selectedFeatureScore.push(map2._layers[ml].feature.properties.scoring);
			selectedFeatureSurface.push(map2._layers[ml].feature.properties.shape_area.toFixed(2));
			selectedFeatureEnso.push(map2._layers[ml].feature.properties.sr_mwh.toFixed(2));
			selectedFeatureProp.push(map2._layers[ml].feature.properties.prop);
			selectedFeatureID.push(map2._layers[ml].feature.properties.id);
		}
	});
	$('#selectedCount').text( selectedFeatureScore.length );
	let showInfo = "";
	let somme = 0;
	let sommeSurface = 0;
	let sommeEnso = 0;
	tableau();
// creation du tableau avec l'ensemble des informations sur les toits sélectionnés
	function tableau (){
		for(let i = 0;i<selectedFeatureScore.length;i++){
			let n = 1 + i;
			somme += selectedFeatureScore[i];
			sommeSurface += Number(selectedFeatureSurface[i]);
			sommeEnso += Number(selectedFeatureEnso[i]);
			let result = (somme/n).toFixed(2);
			let resultEnso = (sommeEnso/n).toFixed(2);
			let resultSurface = (sommeSurface/n).toFixed(2);
			showInfo += `
			<tbody>
				<tr>
					<th scope="row"> <FONT size="1">${String(selectedFeatureID[i]).substr(14)}</FONT></th>
					<td>${selectedFeatureScore[i]}</td>
					<td>${selectedFeatureSurface[i]}</td>
					<td>${selectedFeatureEnso[i]}</td>
					<td>${selectedFeatureProp[i]}</td>
				</tr>
			  </tbody>
			`;	
			meantab = `
			<tr>
				<th scope="row">Moyenne</th>
				<td>${result}</td>
				<td>${resultSurface}</td>
				<td>${resultEnso}</td>
			</tr>
			`;	
			document.getElementById('display').innerHTML = showInfo;
			document.getElementById('moyenne').innerHTML = meantab;
			document.getElementById("tablecomp").style.display='block';
		}
		

	}
};
// }
// main2();