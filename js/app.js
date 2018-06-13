$(document).foundation();

var currentElement = null;

//burger menu movil
$(".btn-nav").on("click tap", function(){
	$(".bar").toggleClass("animated");
 })



//close off-canvas
$('.off-canvas a').on('click', function() {
  $('.off-canvas').foundation('close');
});

//activa menu
 $('.menu li a').click(function(){
    $('li a').removeClass("activation");
    // $(this).addClass("activation");
    currentElement = $(this);
    currentElement.addClass("activation");
});

//activa menu off-canvas
 $('.vertical .menu li a').click(function(){
    $('li a').removeClass("activation");
    $(this).addClass("activation");                                            
});		
//Activa opcion del menu cuando la navegacion es por scroll
var lastId,
    topMenu = $("#menuppal"),
    topMenuHeight = topMenu.outerHeight()+15;
    // All list items
    menuItems = topMenu.find("a");    

    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

	// Bind click handler to menu items
	// so we can get a fancy scroll animation
	menuItems.click(function(e){
	  var href = $(this).attr("href"),
	      offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
	  $('html, body').stop().animate({ scrollTop: offsetTop }, 300);
	  e.preventDefault();
	});

// Bind to scroll
$(window).scroll(function(){
   // Get container scroll position  
   var fromTop = $(this).scrollTop()+topMenuHeight;
    
   var cur = scrollItems.map(function(){
     if ($(this).offset().top < fromTop)

       return this;
   });
   // Get the id of the current element     	
   // Get id of current scroll item
   cur = cur[cur.length-1];
   var id = cur && cur.length ? cur[0].id : "";
   
   if (lastId !== id) {
       lastId = id;       
       if(currentElement != null){       
       	 if(currentElement.attr("href").replace("#","") !== id);       		
       	 	currentElement.removeClass("activation");
       }
       // Set/remove active class
       menuItems.parent().removeClass("activation").end().filter("[href='#"+id+"']").parent().addClass("activation");
   }                   
});

//eventos para la multimedia y procesamiento del formulario
var asyncRequest;
function toggleFullScreen() {
	var doc = window.document;
	var docEl = doc.documentElement;
  
	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
	  requestFullScreen.call(docEl);
	}
	else {
	  cancelFullScreen.call(doc);
	}
  }

function iniciar() {
	
	toggleFullScreen();

	console.log("Cargando pagina...");
	var sonido = document.getElementById("jigle");
	sonido.play();
	//registro de eventos de envio del formulario
	var bocina = document.getElementById('bocina');	
	var botonForm = document.getElementById("enviarForm");
	var botonFormSmall = document.getElementById("enviarFormSmall");
	var resetBotonFormSmall = document.getElementById("resetFormSmall");
	var resetBoton = document.getElementById("reset");
	var emalField = document.getElementById("emailCliente");
	botonForm.addEventListener("click",  enviarFormulario, false);
	botonFormSmall.addEventListener("click",  enviarFormulario, false);
	resetBoton.addEventListener("click",  reestrablecerFormulario, false);
	resetBotonFormSmall.addEventListener("click",  reestrablecerFormulario, false);
	emalField.addEventListener("blur", resetCalloutAlert, false);
}

//funcion para el manejo del control de multimedia 
$(document).ready(function() {
    var audioElement = document.getElementById('jigle');
    $('#stop').hide();

    $('#play').click(function() {
        $('#play').hide();
        $('#stop').show();
        audioElement.pause();
    });

    $('#stop').click(function() {
        $('#play').show();
        $('#stop').hide();
        audioElement.play();
    });
});



function enviarFormulario(){	
	
	if(validarFormulario()){
		var url = "modules/processform.php?";
		var nombre = document.getElementById("nombreCliente").value;
		var email = document.getElementById("emailCliente").value;
		var telefono = document.getElementById("telefonoCliente").value;
		var comentario = document.getElementById("comentarioCliente").value;
		url += "nombrecliente=" + nombre + "&email=" + email + "&telefono=" + telefono + "&comentario=" + comentario;
		try {
			asyncRequest = new XMLHttpRequest();
			asyncRequest.addEventListener("readystatechange", stateChange, false);
			asyncRequest.open("GET", url, true);
			asyncRequest.send(null);
		} catch (excepcion) {}
	}else{
		document.getElementById("calloutFormAlert").style.display = 'block';
	}
}

function stateChange() {
	if(asyncRequest.readyState == 1 || asyncRequest.readyState == 2 ||
			asyncRequest.readyState == 3 ){
		document.getElementById("spinner").style.display = 'block';
	}
	if (asyncRequest.readyState == 4 && asyncRequest.status == 200) {		
		var response = asyncRequest.responseText;
		console.log(response);
		if(response === "true"){	
			document.getElementById("spinner").style.display = 'none';
			// reestablece el formulario		
			reestrablecerFormulario();
			document.getElementById("calloutForm").style.display = 'block';
			document.getElementById("calloutFormAlert").style.display = 'none';
		}else{
			document.getElementById("spinner").style.display = 'none';
			document.getElementById("calloutFormWarning").style.display = 'block';
		}			 
	} 
}

function validarFormulario(){
	var valido = true;
	document.getElementById("nombreCliente").addEventListener("invalid.zf.abide",function(ev,el) {
  		valido = false;
  		document.getElementById("span0").setAttribute("class","input input--yoshiko") ;
		document.getElementById("nombreCliente").value = "";
		document.getElementById("nombreCliente").blur();
		document.getElementById("nombreCliente").setAttribute("class","input__field input__field--yoshiko is-invalid-input");
	});

	if(document.getElementById("nombreCliente").value == "" || 
		document.getElementById("nombreCliente").value == ""){
		valido = false;
  		document.getElementById("span0").setAttribute("class","input input--yoshiko") ;
		document.getElementById("nombreCliente").value = "";
		document.getElementById("nombreCliente").blur();
		document.getElementById("nombreCliente").setAttribute("class","input__field input__field--yoshiko is-invalid-input");
	}

	document.getElementById("emailCliente").addEventListener("invalid.zf.abide",function(ev,el) {
  		valido = false;
	});
	
	if(!validateEmail(document.getElementById("emailCliente").value)){
		valido = false;
		document.getElementById("span1").setAttribute("class","input input--yoshiko") ;
		document.getElementById("emailCliente").value = "";
		document.getElementById("emailCliente").blur();
		document.getElementById("emailCliente").setAttribute("class","input__field input__field--yoshiko is-invalid-input");
	}

	document.getElementById("comentarioCliente").addEventListener("invalid.zf.abide",function(ev,el) {
  		valido = false;
	});

	if(document.getElementById("comentarioCliente").value == "" || 
		document.getElementById("comentarioCliente").value == ""){
		valido = false;
  		document.getElementById("span0").setAttribute("class","input input--yoshiko") ;
		document.getElementById("comentarioCliente").value = "";
		document.getElementById("comentarioCliente").blur();
		document.getElementById("comentarioCliente").setAttribute("class","input__field input__field--yoshiko is-invalid-input");
	}
	return valido;
}

function reestrablecerFormulario(){
	document.getElementById("nombreCliente").value = "";
	document.getElementById("emailCliente").value = "";
	document.getElementById("telefonoCliente").value = "";
	document.getElementById("comentarioCliente").value = "";
	document.getElementById("span0").setAttribute("class","input input--yoshiko") ;
	document.getElementById("span1").setAttribute("class","input input--yoshiko") ;
	document.getElementById("span2").setAttribute("class","input input--yoshiko") ;
	document.getElementById("span3").setAttribute("class","input input--yoshiko") ;	

	//con la ayuda de la funcion predicada oculto los callout
	if(isShowing(document.getElementById("calloutFormAlert"))){
		document.getElementById("calloutFormAlert").style.display = 'none';	
	}
	if(isShowing(document.getElementById("calloutForm"))){
		document.getElementById("calloutForm").style.display = 'none';	
	}
}


//oculta el callout allert luego de perder el foco el email input
function resetCalloutAlert(){
	if(validateEmail(document.getElementById("emailCliente").value)){
		if( isShowing(document.getElementById("calloutFormAlert"))){
			document.getElementById("calloutFormAlert").style.display = 'none';	
		}
	}
}

//valida si contiene el valor block para la propiedad display en un objeto object
function isShowing(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'block');
}

function validateEmail(email){        
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
   return emailPattern.test(email);   
 }  

window.addEventListener("load", iniciar, false);