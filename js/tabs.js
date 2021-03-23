//Ouverture du modal d'acceuil à l'ouverture de l'application 
setTimeout(function(){ 
	$('#myAlert').fadeIn('slow'); 
}, 30000);

//changement de tabs avec leurs bonnes URL 
$(function(){
    var hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');
  
    $('.nav-tabs a').click(function (e) {
      $(this).tab('show');
      var scrollmem = $('body').scrollTop() || $('html').scrollTop();
      window.location.hash = this.hash;
      $('html,body').scrollTop(scrollmem);
    });
  });
  
  var tabs$ = $(".nav-tabs a");
  

// ouverture du panneau d'information des toits 
 function openNav() {
   document.getElementById("mySidepanel").style.width = "250px";
 }
 
// fermeture du panneau d'information des toits 
function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}

// ouverture du panneau de légende des jardins existants  
function openLeg() {
  document.getElementById("myLegend").style.height = "380px";
  document.getElementById("myLegend").style.width = "80px";  
}

// fermeture du panneau de légende des jardins existants  
function closeLeg() {
 document.getElementById("myLegend").style.height = "0";
 document.getElementById("myLegend").style.width = "0"; 
}

// ouverture du panneau de filtre des toits   
function openFlt() {
  document.getElementById("PotFilter").style.height = "300px";
  document.getElementById("PotFilter").style.width = "200px";  
}
// fermeture du panneau de filtre des toits   
function closeFlt() {
  document.getElementById("PotFilter").style.height = "0";
  document.getElementById("PotFilter").style.width = "0"; 
}

// ouverture du panneau de comparaison des toits 
function openComp() {
  document.getElementById("Comp").style.width = "460px";
  document.getElementById("filter").style.background='darkgrey'; 
  document.getElementById("filterlogo").style.pointerEvents='none'; 
}

// fermeture du panneau de comparaison des toits 
function closeComp() {
  document.getElementById("Comp").style.width = "0"; 
}

