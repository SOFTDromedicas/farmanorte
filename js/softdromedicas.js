console.log("SoftDromedicas");

//objeto Mapa usado en toda la aplicacion
var map;
//coleccion de objetos Marker con todo los marcadores unicamente de las sucursales
var markerst = new Array();
//varible para objeto de informacion del infowindow del  marcador 
var infoWindowCustom;

//coordenadas iniciales para cucuta usadas en caso de estar desactivado el gps del dispositivo
var cucutalat=  7.8890971;
var cucutalng= -72.49668959999997;
//ubicacion del archivo de imagen del marcador
var urlMarker ;
//este campo usado por el metodo buscarMarcador para asignar el marcador mas cercano
var markerNear;

//coordenadas usadas para establecer la ubicacion actual
var currentLat;
var currentLng;
var distanciaActual;
//variable predicada que establece si el gps esta activo o no
var geoLocateActive;

//informacion y coordenada de sucursales
//--esto se debe reemplazar por un servicio...
var sucursales = [
	['Dromedicas del Oriente SAS', 7.89825331, -72.50836618, 'Avenida 7A # 0BN - 36 Sevilla', '5781240','5780956', 'CUCUTA','','', '', '', '', 1],
	['Farmanorte 01', 7.840764903473619, -72.5028133392334, 'Calle 33 Con Avenida 4 Esquina Brr La Sabana', '5808800','3167409253', 'LOS PATIOS','','7:30am', '22:30', '7:30am', '22:30', 2],
	['Farmanorte 02', 7.90035823,-72.50418631, 'Avenida 5 Con Calle 2N Pescadero', '5780727','3166909962', 'CUCUTA','','8am', '23:30', '8am', '2pm', 3],
	['Farmanorte 03', 7.917091999388589, -72.49572694301605, 'Avenida 4 Con Calle 20An Esquina Brr Prados Del Norte', '5796888','3166909583', 'CUCUTA','true', '', '', '', '', 4],
	['Farmanorte 04', 7.9049350202970805, -72.51519441604614, 'Avenida Kennedy Con 2Da Esquina Brr La Victoria', '5787878','3183353570', 'CUCUTA','','7:30am', '21', '7:30am', '9pm', 5],
	['Farmanorte 05', 7.898048740341691, -72.52727508544922, 'Calle 2 Con Avenida 6 Esquina Brr Ceci', '5870555','3168309523', 'CUCUTA','true', '', '', '', '', 6],
	['Farmanorte 06', 7.87261944, -72.52802511, 'Avenida 26 Con Calle 28 Esquina Brr Belen', '5828280','3155888094', 'CUCUTA','true', '', '', '', '', 7],
	['Farmanorte 07', 7.8904609470678055, -72.49629020690918, 'Calle 8 # 1E-76 Junto Cafesalud La Salle', '5744094','3183437725', 'CUCUTA','true', '', '', '', '', 8],
	['Farmanorte 08', 7.373990247532279, -72.64909029006958, 'Crr 6 # 7-99 Calle Real', '5682217','3183437726', 'PAMPLONA','','7:30am', '22', '7:30am', '10pm', 9],
	['Farmanorte 09', 7.93004383, -72.50486974, 'Avenida 2 Con Calle 4 Esquina Brr Aeropuerto', '5818245','3166910544', 'CUCUTA','true', '', '', '', '', 10],
	['Farmanorte 10', 7.912830721471756, -72.48752474784851, 'Avenida Libertadores # 18N-181 Brr Santa Elena Bloques Del Zulima', '5776206','3155997099', 'CUCUTA','','7:30am', '22', '7:30am', '9pm', 11],
	['Farmanorte 11', 7.8871853, -72.49622654, 'Cll 11 Con Av 2E Esquina Diagonal C.C. Ventura Plaza', '5711737','3173643955', 'CUCUTA','true', '', '', '', '', 12],
	['Farmanorte 12', 7.88983925194856, -72.49102771282196, 'Av. 9E Con Cll 9 Esq Fte Col. Domingo Savio Brr La Riviera', '5751377','3185166993', 'CUCUTA','','7am', '22', '7am', '10pm', 13],
	['Farmanorte 13', 7.89593978, -72.49713292, 'Av 3E # 1-108 Local 1 Frente Al Parque La Ceiba', '5777770','3185166990', 'CUCUTA','','8am', '21', '8am', '9pm', 14],
	['Farmanorte 14', 7.88912722, -72.51350731, 'Cll 6 # 13-61 Fte Ese Loma Bolivar', '5739782','3155120028', 'CUCUTA','true', '', '', '', '', 15],
	['Farmanorte 15', 7.91121118, -72.51772667, 'Avenida 0 # 4-68 Esquina Barrio Comuneros', '5796173','3154372258', 'CUCUTA','true', '', '', '', '', 16],
	['Farmanorte 16', 7.607999367664449, -72.59926557540894, 'Cll 3 # 3-34  Parq Prpal Chinacota', '5864324','3173660022', 'CHINACOTA','true', '', '', '', '', 17],
	['Farmanorte 17', 7.92706246, -72.51931541, 'Avenida 5 Con Calle 24 Ospina Perez Esquina', '5781108','3153084801', 'CUCUTA','true', '', '', '', '', 18],
	['Farmanorte 18', 7.88198692, -72.4986197, 'Avendad 1 #15-87 Barrio La Playa', '5710546','3176410633', 'CUCUTA','','7am', '21:30', '8am', '2pm', 19],
	['Farmanorte 19', 7.87879545, -72.49714686, 'Avenida 0 Con Calle 19 Esquina', '5831554','3174378532', 'CUCUTA','true', '', '', '', '', 20],
	['Farmanorte 20', 7.88715719, -72.5027738, 'Calle 10 Con Avenida 4 Esquina', '5730318','3175020642', 'CUCUTA','','7:30am', '20', '8am', '2pm', 21],
	['Farmanorte 21', 7.88680822, -72.5048961, 'Av 6 Con Calle 10# 5-94  Frente Al Parque Santander Centro', '5719113','3174380134', 'CUCUTA','','7am', '20', '8am', '2pm', 22],
	['Farmanorte 22', 8.23596841, -73.35418615, 'Calle 10 # 12-87 Frente Al Parque - Ocaña', '5691839','3153926643', 'OCAÑA','','7:30am', '21', '7:30am', '5pm', 23],
	['Farmanorte 23', 7.88755082, -72.50502387, 'Avenida 6 # 9-21', '5730526','3183380633', 'CUCUTA','','7am', '20', '8am', '2pm', 24],
	['Farmanorte 24', 7.88765518, -72.49848544, 'Avenida 0 · 10-14', '5711114','3175021518', 'CUCUTA','true', '', '', '', '', 25],
	['Farmanorte 25', 7.8666476, -72.49764258, 'Centro Cial Pinar Del Rio Local 10', '5842555','3174333572', 'CUCUTA','true', '', '', '', '', 26],
	['Farmanorte 26', 7.87187112, -72.52892628, 'Avenida 26 No 29-48 Br Belen', '5754140','3162331144', 'CUCUTA','','7:30am', '21:30', '7:30am', '9:30pm', 27],
	['Farmanorte 27', 7.91694492, -72.4727475, 'El Escobal, Anillo Vial, Plaza Del Este Local 6', '5847808','3188135356', 'CUCUTA','','7am', '22', '7am', '10pm', 28],
	['Farmanorte 28', 7.88749215, -72.50609315, 'Av 7 Calle 9 Esquina Centro', '5727091','3155997098', 'CUCUTA','','7am', '20', '8am', '2pm', 29],
	['Farmanorte 29', 7.90146225, -72.48545421, 'Calle 2N #12E-20 AV Libertadores', '5777135','3125639874','CUCUTA','true','','','','',30],
	['Farmanorte 30', 7.82706424, -72.51198608, 'Autopista los Patios Calle 16 Barrio Once de Noviembre', '5807646','3125480643','PATIOS','true','','','','',31],
	['Farmanorte 31', 7.89229945, -72.48921045, 'Avenida 11e # 7-49 A 100mts De La Clinica Santa Ana Barrio  Colsag', '5773233','3108584088','CUCUTA','true','','','','',32],
	['Farmanorte 32', 7.83258351, -72.47115523, 'Calle 5 #6-79 Villa del Rosario', '','3108506632','VILLA DEL ROSARIO','','8am', '22:00', '8am', '2pm',33],
	['Farmanorte 33', 7.88242446, -72.4987313, 'Avenida 1 #15-03  Junto A La Clinica Jerico Barrio La Playa', '5710314','3105721715','Cucuta','true','', '', '', '',34],
	['Farmanorte 34', 7.88512079, -72.49645917, 'Calle 13 # 1E-97 Caobos frente a las urgencias de la clínica San José', '5712728','3142581605','Cucuta','true','', '', '', '',35]

];
//funcion llamada al final por el registro de evento load del objeto window
function iniciar(){
	//se cargan las coordenadas actuales y dentro 
	//de este medoto se manda a crear el mapa 
	//invocando la funcion crearMapa
	setCurrentCoords();	
}

//establece las coordenadas de la ubicacion actual a las variables globales de longitud y latitud
function setCurrentCoords(){
	GMaps.geolocate({
		success: function(position) {		
			// alert("Latitud: " + position.coords.latitude + "\n" + "Longitud: " + position.coords.longitude);		
			currentLat = position.coords.latitude;
			currentLng = position.coords.longitude;	
			geoLocateActive = true;				
			crearMapa();//manda a crear el mapa y registrar evento
		},
		error: function(error) {//si el gps esta desactivado
			//muestra el div rojo
			var errorGeo = document.getElementById("errorglocate");    	
    		errorGeo.style.display = 'block';
    		//asigna como ubicacion local las coordenadas de cucuta
    		currentLat = cucutalat;
			currentLng = cucutalng;	
			geoLocateActive = false;			
			crearMapa();//manda a crear el mapa, egistrar eventos pero sin marker de ubicacion actual					
		},
		not_supported: function() {			
		},		
	});	
}

//metodo principal que crea el mapa y registra eventos
function crearMapa() {
    //crea el mapa con las coordenada iniciales y el zoom
    map = new GMaps({
        div: '#map',
        lat: currentLat,
        lng: currentLng,
        zoom: 15,
        zoomControl: true,
        // scrollwheel:false,		
        // panControl: false,
        // streetViewControl: true,
        mapTypeControl: false,
        overviewMapControl: false,
        gestureHandling: "greedy",
        // clickable: falsegit
    });

    //si el gps esta activo añade un marker con la ubicacion actual
    if (geoLocateActive) {
        map.addMarker({
            title: 'Mi ubicación',
            lat: currentLat,
            lng: currentLng,
            // draggable:true,
        });
    }
    //creando los marcadores
    createMarkers();

    //registrando manejo de evento de cierre de infowindow clic en el mapa	
    google.maps.event.addListener(map.map, "click", function() {
        map.hideInfoWindows();
    });

    //registro de manejo de evento del boton de menu 
    var menuboton = document.getElementById('buttonmenu');
    var closemenuboton = document.getElementById('closemenu');
    var menu = document.getElementById('menu');
    //consulta de medio
    var consulta = window.matchMedia('(max-width: 768px)');

    //si es un dispositivo mobil registra eventos touch como tap y press
    if (consulta.matches) {
        var menuH = new Hammer(menuboton);
        menuH.on('tap press', function(ev) {
            console.log(ev.type);
            menu.classList.toggle('active');
        });
        var closemenuH = new Hammer(closemenuboton);
        closemenuH.on("tap press", function(ev) {
            console.log(ev.type + " gesto detectado.");
            menu.classList.remove('active');
        });
    } else {
        menuboton.addEventListener('click', function(ev) {
            menu.classList.toggle('active');
        }, false);
        closemenuboton.addEventListener('click', function(ev) {
            menu.classList.remove('active');
        }, false);
    }


    var opcionSuc = document.getElementById('sucursales');
    opcionSuc.addEventListener('click', mostrarSucursales, false);

    var opcionSuc = document.getElementById('close');
    opcionSuc.addEventListener('click', mostrarSucursales, false);

    var marCerca = document.getElementById('mascercana');
    marCerca.addEventListener('click', findMe, false);

    var marCerca = document.getElementById('resetmapa');
    marCerca.addEventListener('click', resetMapa, false);

    // var marCerca = document.getElementById('resetButton');
    // marCerca.addEventListener('click', resetMapa, false);

    var marCerca = document.getElementById('cercabutton');
    marCerca.addEventListener('click', function() {
        mostrarSucursales();
        findMe();
    }, false);

    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.map.getCenter();
        google.maps.event.trigger(map.map, "resize");
        map.map.setCenter(center);
    });

} //fin del metodo iniciar

//los suguientes dos metdos de jquery implementan el scrroll para infosucursales
$('.contentsuc').impulse();
$(".encuentranos").fancy_scroll({
  innerWrapper: ".contentsuc"
});


function resetMapa(){
	$('body,html').animate({
				scrollTop: 0
			}, 400);
	//centra el mapa
	map.setCenter(currentLat, cucutalng);
	//actualiza el zoom
	map.setZoom(14);
	//oculta el cuadro de sucursales
	// mostrarSucursales();
	//elimina todas las rutas 
	map.cleanRoute();
	//oculta todos los infowindow
	map.hideInfoWindows();
}

function ocultarMostrar(ev) {	
	console.log('Ocultar Mostrar funcion ' + ev);
    document.getElementById("menu").classList.toggle("active");
}

// cierra el menu cuando el usuario hace click por dentro y fuera de el area
//del menu 
function ocultarMenuTodosPartes(){
	window.onclick = function(event) {	
	  if (!event.target.matches('.burgermenu') ) {  	
	    	var dropdowns = document.getElementById("menu");    	
	    	dropdowns.classList.remove('active');     	
	    }  
	}//fin del manejador de evento	
}


function cerrarSucursales(){	
	 document.getElementById("encuentranos").remove('eactive');
}


function mostrarSucursales(){
	var control = document.getElementById('sucursalesControl').value;	
	var menu = document.getElementById('menu');
	menu.classList.remove('active');
	if(control === 'false'){
		cargarSucursales();
	}	
	document.getElementById('encuentranos').classList.toggle("eactive");
}


function cargarSucursales(){
	for (var i = 1; i < sucursales.length; i++) {
	// for (var i = 1; i < 3; i++) {
		//creacion de la sucursal en el menu de sucursales
		crearSucursal(  sucursales[i][1],//latitud
						sucursales[i][2],//longitud
						sucursales[i][0],//nombre de la sucursal								 
						sucursales[i][3],//direccion		
						i,				 //indice usado para el id de la sucursal
						map.markers[i]	//marcador de la sucursal				 
					);
	}//fin del for
	document.getElementById('sucursalesControl').value = 'true';
}


function createMarkers(){
	
	//iteramos la coleccion de sucursales
	for (var i = 0; i < sucursales.length; i++) {
		//se crea un objeto coordenadas para crear nuestro marcador
		var coordenadas = new google.maps.LatLng(sucursales[i][1], sucursales[i][2]);
		//variables creadas para comparar determinar cual es la ppal
		var principal = new String(sucursales[i][0]);
		var sucursalt = new String('Dromedicas del Oriente SAS');
		
		if (principal.localeCompare(sucursalt) === 0) {	
			//crea el marcador para la oficina ppal
		 	addMarkerWithTimeoutPpal(coordenadas, i * 100, 
										sucursales[i][0], i, sucursales[i][3], sucursales[i][4], sucursales[i][5] );			
		} else {
						
			//creando los marcadores del mapa
			addMarkerWithTimeout(coordenadas,	  //coordenadas del marker
								 i * 50,		  //temporizador para la caida
								 sucursales[i][0],//nombre de la sucursal
								 i, 			  //posicion en la coleccion
								 sucursales[i][3],//direccion
								 sucursales[i][4],//tel fijo 
								 sucursales[i][5],//celular
								 sucursales[i][6],//ciudad
								 sucursales[i][7],//24horas
								 sucursales[i][8],//apertura l-v
								 sucursales[i][9],//cierre l-v
								 sucursales[i][10],//apertura d-f
								 sucursales[i][11]//cierre apertura d-f
								);			
		}
	} //fin del for

}//fin del metodo createMarkers


//anade el marcardor "Marker" al mapa y registra el evento click sobre el marcador
//para mostrar la informacion de la sucursal en un objeto InfoWindow
function addMarkerWithTimeout(position, timeout, 
							  suc, i, dir, telefono, 
							  celular, ciudad, _24H, aLS, cLS, aDF,cDF) {
		
		var contents = 
			'<div id="iw-container">' +
                '<div class="iw-title">'+
					'<img src="../images/iconoFarmanorte.png" alt="logoFarmanorte">'+
					'<h3>Droguería '+ suc +'</h3>'+
				'</div>'+
				'<div class="iw-content">'+
						'<div class="row-content"><span class="icon-home"></span><div class="infocontent">'+ dir +'</div></div>'+
						'<div class="row-content"><a href="tel:(037)'+ telefono +'" class="footertext"><span class="icon-phone"></span><span class="infocontent"><span class="phonesuc">'+ telefono +'</span></span></a></div>'+	
						'<div class="row-content"><a href="tel:'+ celular +'" class="footertext"><span class="icon-mobile"></span><span class="infocontent"><span class="phonesuc">'+celular+'</span></span></a></div>'+	
						'<div class="row-content final"></div>'	+					
						'<div class="layoutcontent">'+
							'<div class="titlesection" id="titulohorario"><h3>Horarios</h3></div>';		
		
		var _24_horas= 	'<div class="_24horas" id="detalle24h"><h4>Servicicio 24 Horas</h4></div>';
						
		var complementoHora = 	'<div class="contentestado">'+
									'<div class="titleestado"><h4>Estado</h4></div>'+
									'<div class="infoestado"><i id="iconestado" class="zmdi zmdi-circle"></i>&nbsp;<span id="estadosuc"></span></div>'+
								'</div>'+
							'</div><!-- fin de layoutcontentbutton de horarios-->'+
						'</div><!-- fin de layoutcontent-->';
						
		var footer =	'<div class="row-content final" id="infoHora"></div>'	+
						'<div class="layoutcontentbutton" >'+
							'<div class="titlesection"><h3>Como Llegar</h3></div>'+
							'<div class="layoutcontentbutton">'+
								'<button class="buttonruta" id="btnCar" data-lat="'+position.lat()+'" data-lng="'+position.lng()+'"><i class="zmdi zmdi zmdi-car zmdi-hc-2x"></i>&nbsp;Carro</button>'+
								'<button class="buttonruta" id="btnWalk" data-lat="'+position.lat()+'" data-lng="'+position.lng()+'"><i class="zmdi zmdi-walk zmdi-hc-2x"></i>&nbsp;Caminando</button>'+
								'<button class="buttonruta" id="btnBus" data-lat="'+position.lat()+'" data-lng="'+position.lng()+'"><i class="zmdi zmdi-bus zmdi-hc-2x"></i>&nbsp;Bus</button>'+
							'</div>'+							
						'</div><!-- fin de layoutcontent-->'+						
					'</div><!--fin de contenedor de horarios -->'+
				'</div>'+
            '</div>';

        //con base en el dia comparamos el rango de horas icluyendo minutos
        //genero el contenido dinamicamente
        //revisa que sea 24 horas   
        if( _24H === 'true'){
        	contents +=   _24_horas + complementoHora + footer ;
        	var est = 'abierto';	//esto se debe cambiar x ahora en codigo duro
        	//registro del manejo de evento click para desplegar el objeto InfoWindow
			window.setTimeout(function(){
					//añadir un marker con GMap
					var myIcon = new google.maps.MarkerImage("../images/markFarmaAbierto.png", null, null, null, new google.maps.Size(30,48));
					urlMarker = "../images/markFarmaAbierto.png";
					var mark = map.createMarker ({	
					    position: position,
					    icon: myIcon,
					    details:{estado:est},
						title: suc,
						infoWindow: {content:contents, maxWidth:345,},
						animation: google.maps.Animation.DROP,
					});
					//obteniendo el infowindow del objeto GMap
					infoWindowCustom = mark.infoWindow;
					//editando el css del infowindow
					editCssInfoWindow();
					//añadiendo la marca al mapa	
					map.addMarker(mark);
					markerst.push(mark);
				}, i * 50);
        }else{
        //si no es 24h, obtenemos el dia y hora actual        	
        	var fechaActual = new Date();
        	var horaActual = fechaActual.getHours();
        	var diaDeLaSemana = fechaActual.getDay();
        	var urlMarker2;
        	var myIcon2;
         	//valida si el dia actual esta entre lunes y Sabado

			if (diaDeLaSemana >= 1 && diaDeLaSemana <= 6) {
				var est;
				if( abierto(fechaActual, aLS, cLS) ){
					myIcon2  = new google.maps.MarkerImage("../images/markFarmaAbierto.png", null, null, null, new google.maps.Size(30,48));
					urlMarker2 = "../images/markFarmaAbierto.png";
					est = 'abierto';								
				}else{
					myIcon2  = new google.maps.MarkerImage("../images/markFarmaCerrado.png", null, null, null, new google.maps.Size(30,48));
					urlMarker2 = "../images/markFarmaCerrado.png";
					est = 'cerrado';								
				}//fin del else 
				var hOrdinario ='<div class="layoutcontentbutton" id="infoHoradetalle">'+
								'<div class="contentestado">'+
								'<input id="estadoSucursal" type="hidden" value="'+est+'">'+
									'<div class="titleestado"><h4>Lunes - Sabado</h4></div>'+
									'<div class="infoestado">' + formatAMPM(getRealHour(aLS)) + ' - ' + formatAMPM(getRealHour(cLS)) +'</div>'+
								'</div>'+
								'<div class="contentestado">'+
									'<div class="titleestado"><h4>Domingos - Festivos</h4></div>'+
									'<div class="infoestado">'+ formatAMPM(getRealHour(aDF)) +' - '+ formatAMPM(getRealHour(cDF)) +' </div>'+
								'</div>';
				contents += hOrdinario + complementoHora + footer;
				//registro del manejo 
				window.setTimeout(function() {
					var markd = map.createMarker({
						position: position,
						icon: myIcon2,
						details:{estado:est},
						title: suc,
						infoWindow: {
							content: contents,
							maxWidth: 330,
						},
						animation: google.maps.Animation.DROP,
					});
					//obteniendo el infowindow del objeto GMap
					infoWindowCustom = markd.infoWindow;
					//editando el css del infowindow
					editCssInfoWindowNormal();
					//añadiendo la marca al mapa	
					map.addMarker(markd);
					markerst.push(markd);
				}, i * 50);

			}//fin del if de horario lunes - sabado

			//valida si el dia actual es domingo			
			if (diaDeLaSemana == 0 ) {
				var est;
				if( abierto(fechaActual, aDF, cDF) ){
					myIcon2  = new google.maps.MarkerImage("../images/markFarmaAbierto.png", null, null, null, new google.maps.Size(30,48));
					urlMarker2 = "../images/markFarmaAbierto.png";
					est = 'abierto';					
				}else{
					myIcon2  = new google.maps.MarkerImage("../images/markFarmaCerrado.png", null, null, null, new google.maps.Size(30,48));
					urlMarker2 = "../images/markFarmaCerrado.png";
					est = 'cerrado';
				}//fin del else 
				var hOrdinario ='<div class="layoutcontentbutton">'+
								'<div class="contentestado">'+
								'<input id="estadoSucursal" type="hidden" value="'+est+'">'+
									'<div class="titleestado"><h4>Lunes - Sabado</h4></div>'+
									'<div class="infoestado">' + formatAMPM(getRealHour(aLS)) + ' - ' + formatAMPM(getRealHour(cLS)) +'</div>'+
								'</div>'+
								'<div class="contentestado">'+
									'<div class="titleestado"><h4>Domingos - Festivos</h4></div>'+
									'<div class="infoestado">'+ formatAMPM(getRealHour(aDF)) +' - '+ formatAMPM(getRealHour(cDF)) +' </div>'+
								'</div>';
				contents += hOrdinario + complementoHora + footer; 
				//registro del manejo 
				window.setTimeout(function() {
					//añadir un marker con GMap					
					var markd = map.createMarker({
						position: position,
						icon: myIcon2,
						details:{estado:est},
						title: suc,
						infoWindow: {
							content: contents,
							maxWidth: 330,
						},
						animation: google.maps.Animation.DROP,
					});
					//obteniendo el infowindow del objeto GMap
					infoWindowCustom = markd.infoWindow;
					//editando el css del infowindow
					editCssInfoWindowNormal();
					//añadiendo la marca al mapa	
					map.addMarker(markd);
					markerst.push(markd);
				}, i * 50);
			}//fin del if de horario para domingo
			
        }//fin del else	
}

//metodo predicado que determina si la hora actual esta dentro de un rango
// El metodo tiene encuenta la hora y los minutos
function abierto(hActual, hApertura, hCierre){
	var abierto = false;
	//hora actual es mayor a la hora de apertura?
	if( hActual.getHours() > getRealHour(hApertura).getHours() && hActual.getHours()<getRealHour(hCierre).getHours() ){
		abierto = true;
	}
		
	if( hActual.getHours() == getRealHour(hApertura).getHours() ){
			if(hActual.getMinutes() >= getRealHour(hApertura).getMinutes())
				abierto = true;
	}

	if (hActual.getHours() == getRealHour(hCierre).getHours()) {
		if (hActual.getMinutes() < getRealHour(hCierre).getMinutes())
			abierto = true;
	}
	return abierto;	
}

//formato de hora 
function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}// fin del metodo formatAMPM 



//recibe una hora como String y la retorna en formato hora
// puede recibir la hora en cualquier de esto formatos 
//'1:00 pm','1:00 p.m.','1:00 p','1:00pm','1:00p.m.','1:00p','1 pm','1 p.m.','1 p','1pm','1p.m.', '1p','13:00','13'
function getRealHour(stringHour){
	var time = stringHour.match(/(\d+)(?::(\d\d))?\s*(p?)/);
	var dateHour = new Date();
	dateHour.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
	dateHour.setMinutes(parseInt(time[2]) || 0);
	return dateHour;
}//fin del metodo getRealHour


//anade el marcardor "Marker" al mapa y registra el evento click sobre el marcador
//para mostrar la informacion de la sucursal en un objeto InfoWindow
function addMarkerWithTimeoutPpal(position, timeout, suc, i, dir, telefono, celular) {
		
		var contentsp = 
			'<div id="iw-container">' +
                '<div class="iw-titleppal">'+
					'<img src="../images/iconoDromedicas.png" alt="logoDromedicas">'+
					'<h3>'+ suc +'</h3>'+
				'</div>'+
				'<div class="iw-contentppal">'+
						'<div class="row-content"><span class="icon-home"></span><div class="infocontent">'+ dir +'</div></div>'+
						'<div class="row-content"><a href="tel:(037)'+ telefono +'" class="footertext"><span class="icon-phone"></span><span class="infocontent"><span class="phonesuc">'+ telefono +'</span></span></a></div>'+	
						'<div class="row-content"><a href="tel:'+ celular +'" class="footertext"><span class="icon-mobile"></span><span class="infocontent"><span class="phonesuc">'+celular+'</span></span></a></div>';
		
		//registro del manejo de evento click para desplegar el objeto InfoWindow
		window.setTimeout(function(){
					//añadir un marker con GMap
					var mark = map.createMarker ({	
					    position: position,
					    icon: "../images/markDromedicas.png",
						title: 'Dromedicas del Oriente',
						infoWindow: {content:contentsp},
						animation: google.maps.Animation.DROP,
					});
					//obteniendo el infowindow del objeto GMap
					infoWindowCustom = mark.infoWindow;
					//editando el css del infowindow
					editCssInfoWindowPpal();					
					//añadiendo la marca al mapa	
					map.addMarker(mark);
					// markers.push(mark);
			}, i * 50);
}//fin del metodo  addMarkerWithTimeoutPpal


function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
} //fin del metodo  clearMarkers

function generarRutaCar(lat, lng, opcionTransporte){
	map.setCenter(lat, lng);	
	map.setZoom(17);
	map.drawRoute({
				origin: [currentLat, currentLng],
				destination: [lat, lng],
				travelMode: opcionTransporte,
				strokeColor: '#0060F1',
				strokeOpacity: 0.6,
				strokeWeight: 6
			});
}

function generarRutaWalk(lat, lng, opcionTransporte){
	map.setCenter(lat, lng);	
	map.setZoom(17);
	map.drawRoute({
				origin: [currentLat, currentLng],
				destination: [lat, lng],
				travelMode: opcionTransporte,
				strokeColor: '#FD3C41',
				strokeOpacity: 0.6,
				strokeWeight: 6
			});
}

function generarRutaSucursal(lat, lng, opcionTransporte){
	map.setCenter(lat, lng);	
	mostrarSucursales();
	map.setZoom(17);
	map.drawRoute({
				origin: [currentLat, currentLng],
				destination: [lat, lng],
				travelMode: opcionTransporte,
				strokeColor: '#0060F1',
				strokeOpacity: 0.6,
				strokeWeight: 6
			});
}

//Geolocalizacion y trazo de ruta
function findMe(){
	map.hideInfoWindows();//cierra el anterior infowindow
	map.cleanRoute();//limpia toda la ruta
	map.setZoom(16);
	//cierro el menu
	var menu = document.getElementById('menu');
	menu.classList.remove('active');
	var coordsMarker = buscarMarcador( currentLat, currentLng);
	console.log("coordenadas de la mas cercana: " + coordsMarker);
	map.drawRoute({
				origin: [currentLat, currentLng],
				destination: coordsMarker,
				// destination: [7.908388743984923, -72.491574883461],
				travelMode: 'driving',
				strokeColor: '#0060F1',				
				strokeOpacity: 0.6,
				strokeWeight: 6
			});
	map.setCenter(coordsMarker[0], coordsMarker[1]);
	markerNear.infoWindow.open(map, markerNear);
}

//Edicion del CSS para el objeto InfoWindows
function editCssInfoWindowNormal(){
			
	//Desde aca se comienza la manipulacion del DOM del objeto Info Window
	//nos apoyamos de jQuery
	google.maps.event.addListener(infoWindowCustom, 'domready', function() {
		
		// Reference to the DIV that wraps the bottom of infowindow
		var iwOuter = $('.gm-style-iw');
		// iwOuter.children(':nth-child(1)').css({'display' : 'block'});	
		/* Since this div is in a position prior to .gm-div style-iw.
		* We use jQuery and create a iwBackground variable,
		* and took advantage of the existing reference .gm-style-iw for 
		* the previous div with .prev().
		*/		
		var iwBackground = iwOuter.prev();		
		// Removes background shadow DIV
		iwBackground.children(':nth-child(2)').css({'display' : 'none'});
		// Removes white background DIV
		iwBackground.children(':nth-child(4)').css({'display' : 'none'});
		// Moves the infowindow 115px to the right.
		iwOuter.parent().parent().css({left: '0px'});
		// Changes the desired tail shadow color.
		iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 10, 123, .5) 0px 1px 6px', 'z-index' : '1'});
		// Reference to the div that groups the close button elements.
		var iwCloseBtn = iwOuter.next();
		// Apply the desired effect to the close button
		var consulta = window.matchMedia('(max-width:320px)');		
		if( consulta.matches){			
			iwCloseBtn.css({opacity: '1', right: '2px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});		
		}else{
			iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});
		}		
		consulta = window.matchMedia('(min-width:321px) and (max-width:550px)');		
		if( consulta.matches){			
			iwCloseBtn.css({opacity: '1', right: '10px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});		
		}

		// If the content of infowindow not exceed the set maximum height, then the gradient is removed.
		// if($('.iw-content').height() < 140){
		// $('.iw-bottom-gradient').css({display: 'none'});
		// }
	    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
	    iwCloseBtn.mouseout(function(){
	      $(this).css({opacity: '1'});
	    });
	    //aca se registran eventos para infowindow
	    var estado = document.getElementById('estadoSucursal').value;
	    document.getElementById('estadosuc').innerHTML = '';
		if (estado === 'abierto') {
			abiertoCerrado = 'Abierto';
			var iconoAbierto = document.getElementById('iconestado');				
			iconoAbierto.setAttribute("class", "zmdi zmdi-circle iconestadoabierto");
			var infoes = document.getElementById('estadosuc');
			infoes.appendChild(document.createTextNode(abiertoCerrado));
		} else {
			var iconoCerrado = document.getElementById('iconestado');
			abiertoCerrado = 'Cerrado';
			iconoCerrado.setAttribute("class", "zmdi zmdi-circle iconestadocerrado");
			var infoes = document.getElementById('estadosuc');
			infoes.appendChild(document.createTextNode(abiertoCerrado));
		}//fin del else

		var btnCars = document.getElementById('btnCar');
		btnCars.addEventListener('click', function(){ generarRutaCar(btnCars.getAttribute('data-lat'),
																 btnCars.getAttribute('data-lng'),
																 'driving')}, false);
		var btnWalk = document.getElementById('btnWalk');
		btnWalk.addEventListener('click', function(){ generarRutaWalk(btnWalk.getAttribute('data-lat'),
																 btnWalk.getAttribute('data-lng'),
																 'walking')}, false);
		var btnBus = document.getElementById('btnBus');
		btnBus.addEventListener('click', function(){ generarRutaCar(btnBus.getAttribute('data-lat'),
																 btnBus.getAttribute('data-lng'),
																 'driving')}, false);


  	});
}// fin del metodo editCssInfoWindow


//Edicion del CSS para el objeto InfoWindows
function editCssInfoWindow(){
	//Desde aca se comienza la manipulacion del DOM del objeto Info Window
	//nos apoyamos de jQuery
	google.maps.event.addListener(infoWindowCustom, 'domready', function() {
		// Reference to the DIV that wraps the bottom of infowindow
		var iwOuter = $('.gm-style-iw');
		// iwOuter.children(':nth-child(1)').css({'display' : 'block'});		

		/* Since this div is in a position prior to .gm-div style-iw.
		* We use jQuery and create a iwBackground variable,
		* and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
		*/		
		var iwBackground = iwOuter.prev();		
		// Removes background shadow DIV
		iwBackground.children(':nth-child(2)').css({'display' : 'none'});
		// Removes white background DIV
		iwBackground.children(':nth-child(4)').css({'display' : 'none'});
		// Moves the infowindow 115px to the right.
		iwOuter.parent().parent().css({left: '0px'});
		// Changes the desired tail shadow color.
		iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 10, 123, .5) 0px 1px 6px', 'z-index' : '1'});
		// Reference to the div that groups the close button elements.
		var iwCloseBtn = iwOuter.next();
		// Apply the desired effect to the close button
		var consulta = window.matchMedia('(max-width:320px)');		
		if( consulta.matches){			
			iwCloseBtn.css({opacity: '1', right: '2px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});		
		}else{
			iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});
		}		
		consulta = window.matchMedia('(min-width:321px) and (max-width:550px)');		
		if( consulta.matches){			
			iwCloseBtn.css({opacity: '1', right: '10px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});		
		}
		// If the content of infowindow not exceed the set maximum height, then the gradient is removed.
		// if($('.iw-content').height() < 140){
		// $('.iw-bottom-gradient').css({display: 'none'});
		// }
	    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
	    iwCloseBtn.mouseout(function(){
	      $(this).css({opacity: '1'});
	    });	
	    document.getElementById('estadosuc').innerHTML = '';
	    var iconoAbierto = document.getElementById('iconestado');				
			iconoAbierto.setAttribute("class", "zmdi zmdi-circle iconestadoabierto");
			var infoes = document.getElementById('estadosuc');
			infoes.appendChild(document.createTextNode("Abierto"));

		var btnCars = document.getElementById('btnCar');
		btnCars.addEventListener('click', function(){ generarRutaCar(btnCars.getAttribute('data-lat'),
																 btnCars.getAttribute('data-lng'),
																 'driving')}, false);
		var btnWalk = document.getElementById('btnWalk');
		btnWalk.addEventListener('click', function(){ generarRutaWalk(btnWalk.getAttribute('data-lat'),
																 btnWalk.getAttribute('data-lng'),
																 'walking')}, false);
		var btnBus = document.getElementById('btnBus');
		btnBus.addEventListener('click', function(){ generarRutaCar(btnBus.getAttribute('data-lat'),
																 btnBus.getAttribute('data-lng'),
																 'driving')}, false);
  	});
}// fin del metodo editCssInfoWindow


//Edicion del CSS para el objeto InfoWindows
function editCssInfoWindowPpal(){
	//Desde aca se comienza la manipulacion del DOM del objeto Info Window
	//nos apoyamos de jQuery
	console.log('css ppal');
	google.maps.event.addListener(infoWindowCustom, 'domready', function() {
		// Reference to the DIV that wraps the bottom of infowindow
		var iwOuter = $('.gm-style-iw');
		// iwOuter.children(':nth-child(1)').css({'display' : 'block'});		
		var iwBackground = iwOuter.prev();		
		// Removes background shadow DIV
		iwBackground.children(':nth-child(2)').css({'display' : 'none'});
		// Removes white background DIV
		iwBackground.children(':nth-child(4)').css({'display' : 'none'});
		// Moves the infowindow 115px to the right.
		iwOuter.parent().parent().css({left: '0px'});
		// Changes the desired tail shadow color.
		iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 10, 123, .5) 0px 1px 6px', 'z-index' : '1'});
		// Reference to the div that groups the close button elements.
		var iwCloseBtn = iwOuter.next();
		// Apply the desired effect to the close button
		var consulta = window.matchMedia('(max-width:320px)');		
		if( consulta.matches){			
			iwCloseBtn.css({opacity: '1', right: '2px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});		
		}else{
			iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});
		}		
		consulta = window.matchMedia('(min-width:321px) and (max-width:550px)');		
		if( consulta.matches){			
			iwCloseBtn.css({opacity: '1', right: '10px', top: '3px', border: '7px solid rgba(0, 10, 123, 1.0)', 'border-radius': '5px', 'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'});		
		}
		// If the content of infowindow not exceed the set maximum height, then the gradient is removed.
		// if($('.iw-content').height() < 140){
		// $('.iw-bottom-gradient').css({display: 'none'});
		// }
	    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
	    iwCloseBtn.mouseout(function(){
	      $(this).css({opacity: '1'});
	    });		 
  	});
}// fin del metodo editCssInfoWindow


//crea los div de las sucursales y los inserta en el contenedor
function crearSucursal(lat, lng, suc,  dir, i, marker){
	//1. creo los elementos
	//obtengo el contenedor 
	var contenedorSucursales = document.getElementById('contenedorSucursales');		
	//creo el elemento ancla class linkdiv
	var id = "linkdivsuc" + i;
	var linkdivAncla  = document.createElement("a");
	linkdivAncla.setAttribute("class", "linkdiv");
	linkdivAncla.setAttribute("id", id);
	linkdivAncla.setAttribute("data-lat", lat);
	linkdivAncla.setAttribute("data-lng", lng);
		//creo el element div class divsucursal
		var divsucursalElement  = document.createElement("div");
		divsucursalElement.setAttribute("class", "divsucursal");
			//creo el div clase infosuc
			var infosucElement  = document.createElement("div");
			infosucElement.setAttribute("class", "infosuc");
				//creo el div clase divmarker
				var divmarkerElement  = document.createElement("div");
				divmarkerElement.setAttribute("class", "divmarker");				
					//creo el elemento img con el marker
					var markerElement  = document.createElement("img")
					markerElement.setAttribute("src", "../images/markFarmaAbierto.png");
				//creo el div clase detallesuc
				var detallesucElement  = document.createElement("div");				
				detallesucElement.setAttribute("class", "detallesuc");
					//creo el h3 id sucursalNombre
					var sucursalNombreElement  = document.createElement("h3");
					sucursalNombreElement.setAttribute("id", "sucursalNombre");
					sucursalNombreElement.appendChild( document.createTextNode( suc ) );
					//creo el p id dirSucursal
					var dirSucursalElement  = document.createElement("p");				
					dirSucursalElement.setAttribute("id", "dirSucursal");	
					dirSucursalElement.appendChild( document.createTextNode( dir ) );
			//creo el div clase distancediv
			var distancedivElement  = document.createElement("div");
			distancedivElement.setAttribute("class", "distancediv");
				//creo el elemento p id distanciaSuc	
				var distanciaSucElement  = document.createElement("p");
				distanciaSucElement.setAttribute("id", "distanciaSuc");

				//ACA DEBO TRAER LA DISTANCIA DE LA SUCURSAL
				var service = new google.maps.DistanceMatrixService;
				var origin = {
					lat: currentLat,
					lng: currentLng
				};
				var dest = {
					lat: lat,
					lng: lng
				};				
				service.getDistanceMatrix({
						origins: [origin],
						destinations: [dest],
						travelMode: google.maps.TravelMode.DRIVING,
						unitSystem: google.maps.UnitSystem.METRIC,
						avoidHighways: false,
						avoidTolls: false
					},
					function(response, status) {
						if (status !== google.maps.DistanceMatrixStatus.OK) {
							//implementar div
						} else {		
							var d = response.rows[0].elements[0].distance.value;
							var distancia;
							if( d < 1000){
								distancia = d + " mts";
							}else{
								distancia = (d/1000).toFixed(2) + " Km"
							}
							distanciaSucElement.appendChild( document.createTextNode( distancia ) );							
						}
					}
				);

		//2. los inserto en los contenedores respectivos	
		distancedivElement.appendChild(distanciaSucElement);
		detallesucElement.appendChild(sucursalNombreElement);
		detallesucElement.appendChild(dirSucursalElement);
		divmarkerElement.appendChild(markerElement);
		infosucElement.appendChild(divmarkerElement);
		infosucElement.appendChild(detallesucElement);
		divsucursalElement.appendChild(infosucElement);
		divsucursalElement.appendChild(distancedivElement);
		linkdivAncla.appendChild(divsucursalElement);
		contenedorSucursales.appendChild(linkdivAncla);
		
		var sucursal = document.getElementById(id);
		sucursal.addEventListener('click', 
						function(){ generarRutaSucursal(sucursal.getAttribute('data-lat'), 
												sucursal.getAttribute('data-lng'), 'driving');
									map.hideInfoWindows();//cierra el anterior infowindow
									map.cleanRoute();//limpia toda la ruta	
									console.log(suc);
									//itera los marcadores para disparar el infowindow correspondiente
									for( var i = 0 ; i < map.markers.length ; i++){
										if( suc == map.markers[i].title)
											map.markers[i].infoWindow.open(map, map.markers[i]);										
										}//fin del if
									},
								  false);
}// fin del metodo crearSucursal



/***************************
 Metodos de Geolocalizacion
****************************/
//Ortodrómica 
// tomado de http://stackoverflow.com/a/4060721
function rad(x) {return x*Math.PI/180;}
function buscarMarcador( lat, lng ) {	
	//variables para el calculo
	var lat = lat;
    var lng = lng;
    var R = 6371; // radio de la tierra en kilometros
    var distances = [];
    var closest = -1;
    for( i=0;i<markerst.length; i++ ) {
    	var mlat = markerst[i].position.lat();
        var mlng = markerst[i].position.lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( (closest == -1 || d < distances[closest]) && (markerst[i].details.estado==='abierto')) {
            closest = i;
        }
    }
    markerNear = markerst[closest];
    return [markerst[closest].position.lat(),  markerst[closest].position.lng()];    
}


//Consuta la distancia entre la aubicacion actual y las coordenadas enviadas como parametros
function getCurrentDistanceGoogleMaps(lat, lng){//----este metodo no se usa... :-(
	var service = new google.maps.DistanceMatrixService;
	var origin = {lat: currentLat, lng: currentLng};
	var dest = {lat: lat, lng: lng};
	service.getDistanceMatrix(
	    {
	        origins: [origin ],
	        destinations: [dest],
	        travelMode: google.maps.TravelMode.DRIVING,
    		unitSystem: google.maps.UnitSystem.METRIC,
    		avoidHighways: false,
    		avoidTolls: false
	    }, 
		function(response, status) {
			if (status !== google.maps.DistanceMatrixStatus.OK) {
				//implementar div
			} else {
				
				var d = response.rows[0].elements[0].distance.text;
				setDistancia(d);				
			}
		}
	);	
}//fin del metodo getCurrentDistanceGoogleMaps


window.addEventListener('load',iniciar,false);
