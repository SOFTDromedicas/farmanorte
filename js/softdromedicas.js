console.log("SoftDromedicas");

//objeto Mapa usado en toda la aplicacion
var map;
//coleccion de objetos Marker con todo los marcadores unicamente de las sucursales
var markerst = new Array();
//varible para objeto de informacion del infowindow del  marcador 
var infoWindowCustom;

//coordenadas iniciales para cucuta usadas en caso de estar desactivado el gps del dispositivo
var cucutalat = 7.8890971;
var cucutalng = -72.49668959999997;
//ubicacion del archivo de imagen del marcador
var urlMarker;
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
var servicioSucursalesUrl = "http://dromedicas.ddns.net:8080/serviciomapasfarmanorte/rest/sucursales";
var sucursales;

//funcion llamada al final por el registro de evento load del objeto window
function iniciar() {	
		consumirServicio(function(result){						
				sucursales = result;
				console.log("Sucusales total: "+sucursales.length);
		    //se cargan las coordenadas actuales y dentro 
		    //de este medoto se manda a crear el mapa 
		    //invocando la funcion crearMapa
				setCurrentCoords();				
		});		
    
}

//consume
function consumirServicio(callback) {
    $.ajax({
            xhrFields: {
                withCredentials: false
            },
            type: 'GET',
            url: servicioSucursalesUrl,
            contentType: 'text/plain',
            crossDomain: true,
            dataType: "jsonp",
        })
        .done(function(data, textStatus, jqXHR) {
            console.log(textStatus);
            //conversion explicita de la respuesta a JSON   
            // callback( $.parseJSON(data) );             
            callback(data);
        })
        .fail(function(xhr, status, error) {
            document.getElementById("errorCargaSuc").style.display = 'block';
        });
}

//establece las coordenadas de la ubicacion actual a las variables globales de longitud y latitud
function setCurrentCoords() {
    GMaps.geolocate({
        success: function(position) {
            // alert("Latitud: " + position.coords.latitude + "\n" + "Longitud: " + position.coords.longitude);		
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;
            geoLocateActive = true;
            crearMapa(); //manda a crear el mapa y registrar evento
        },
        error: function(error) { //si el gps esta desactivado
            //muestra el div rojo
            var errorGeo = document.getElementById("errorglocate");
            errorGeo.style.display = 'block';
            //asigna como ubicacion local las coordenadas de cucuta
            currentLat = cucutalat;
            currentLng = cucutalng;
            geoLocateActive = false;
            crearMapa(); //manda a crear el mapa, egistrar eventos pero sin marker de ubicacion actual					
        },
        not_supported: function() {},
    });
}

//metodo principal que crea el mapa y registra eventos
function crearMapa() {	
    //crea el mapa con las coordenada iniciales y el zoom
    map = new GMaps({
        div: '#map',
        lat: currentLat,
        lng: currentLng,
        zoom: 14,
        zoomControl: true,
        // scrollwheel:false,		
        // panControl: false,
        // streetViewControl: true,
        mapTypeControl: false,
        overviewMapControl: false,
        gestureHandling: "greedy",
        // clickable: false
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

    //si es un dispositivo movil registra eventos touch como tap y press
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


function resetMapa() {
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
    
    document.getElementById("menu").classList.toggle("active");
}

// cierra el menu cuando el usuario hace click por dentro y fuera de el area
//del menu 
function ocultarMenuTodosPartes() {
    window.onclick = function(event) {
            if (!event.target.matches('.burgermenu')) {
                var dropdowns = document.getElementById("menu");
                dropdowns.classList.remove('active');
            }
        } //fin del manejador de evento	
}


function cerrarSucursales() {
    document.getElementById("encuentranos").remove('eactive');
}


function mostrarSucursales() {
    var control = document.getElementById('sucursalesControl').value;
    var menu = document.getElementById('menu');
    menu.classList.remove('active');
    if (control === 'false') {
        cargarSucursales();
    }
    document.getElementById('encuentranos').classList.toggle("eactive");
}


function cargarSucursales() {
    for (var i = 1; i < sucursales.length; i++) {
        // for (var i = 1; i < 3; i++) {
        //creacion de la sucursal en el menu de sucursales
        crearSucursal(sucursales[i].latitud.trim(), //latitud
            sucursales[i].longitud.trim(), //longitud
            sucursales[i].sucursal, //nombre de la sucursal								 
            sucursales[i].direccion2, //direccion		
            i, //indice usado para el id de la sucursal
            map.markers[i] //marcador de la sucursal				 
        );
    } //fin del for
    document.getElementById('sucursalesControl').value = 'true';
}


function createMarkers() {
		
    //iteramos la coleccion de sucursales
    try{
	    for (var i = 0; i < sucursales.length; i++) {	    
            //console.log("Sucursal: " + sucursales[i].sucursal);
	        //se crea un objeto coordenadas para crear nuestro marcador
	        var coordenadas = new google.maps.LatLng(sucursales[i].latitud.trim(), sucursales[i].longitud.trim() );
	        //variables creadas para comparar determinar cual es la ppal
	        var sucursalt = new String(sucursales[i].sucursal);
	        var principal = new String('DROMEDICAS');

	        if (principal.localeCompare(sucursalt) === 0) {
	            //crea el marcador para la oficina ppal
	            addMarkerWithTimeoutPpal(coordenadas, i * 100,
	                nombrePropio(sucursales[i].sucursal) + "Del Oriente SAS", i, 
	                nombrePropio(sucursales[i].direccion2), 
	                sucursales[i].telefono, 
	                sucursales[i].celular);
	        } else {

	            //creando los marcadores del mapa
	            addMarkerWithTimeout(coordenadas, //coordenadas del marker
	                i * 50, //temporizador para la caida
	                nombrePropio(sucursales[i].sucursal), //nombre de la sucursal
	                i, //posicion en la coleccion
	                nombrePropio(sucursales[i].direccion2), //direccion
	                sucursales[i].telefono, //tel fijo 
	                sucursales[i].celular, //celular
	                sucursales[i].nombre, //ciudad
	                sucursales[i].es24horas, //24horas
	                sucursales[i].an, //apertura l-v
	                sucursales[i].cn, //cierre l-v
                    sucursales[i].ae, //apertura d-f
	                sucursales[i].ce, //apertura d-f
                    i//contador
	                // sucursales[i].contador //contador
	            );
	        }
	    } //fin del for    	
    }catch(ex){
    	console.log(ex.message);
    }

} //fin del metodo createMarkers


//anade el marcardor "Marker" al mapa y registra el evento click sobre el marcador
//para mostrar la informacion de la sucursal en un objeto InfoWindow
function addMarkerWithTimeout(position, timeout,
    suc, i, dir, telefono,
    celular, ciudad, _24H, aLS, cLS, aDF, cDF) {
		
    var contents =
        '<div id="iw-container">' +
        '<div class="iw-title">' +
        '<img src="../images/iconoFarmanorte.png" alt="logoFarmanorte">' +
        '<h3>Droguería ' + suc + '</h3>' +
        '</div>' +
        '<div class="iw-content">' +
        '<div class="row-content"><span class="icon-home"></span><div class="infocontent">' + dir + '</div></div>' +
        '<div class="row-content"><a href="tel:(037)' + telefono + '" class="footertext"><span class="icon-phone"></span><span class="infocontent"><span class="phonesuc">' + telefono + '</span></span></a></div>' +
        '<div class="row-content"><a href="tel:' + celular + '" class="footertext"><span class="icon-mobile"></span><span class="infocontent"><span class="phonesuc">' + celular + '</span></span></a></div>' +
        '<div class="row-content final"></div>' +
        '<div class="layoutcontent">' +
        '<div class="titlesection" id="titulohorario"><h3>Horarios</h3></div>';

    var _24_horas = '<div class="_24horas" id="detalle24h"><h4>Servicicio 24 Horas</h4></div>';

    var complementoHora = '<div class="contentestado">' +
        '<div class="titleestado"><h4>Estado</h4></div>' +
        '<div class="infoestado"><i id="iconestado" class="zmdi zmdi-circle"></i>&nbsp;<span id="estadosuc"></span></div>' +
        '</div>' +
        '</div><!-- fin de layoutcontentbutton de horarios-->' +
        '</div><!-- fin de layoutcontent-->';

    var footer = '<div class="row-content final" id="infoHora"></div>' +
        '<div class="layoutcontentbutton" >' +
        '<div class="titlesection"><h3>Como Llegar</h3></div>' +
        '<div class="layoutcontentbutton">' +
        '<button class="buttonruta" id="btnCar" data-lat="' + position.lat() + '" data-lng="' + position.lng() + '"><i class="zmdi zmdi zmdi-car zmdi-hc-2x"></i>&nbsp;Carro</button>' +
        '<button class="buttonruta" id="btnWalk" data-lat="' + position.lat() + '" data-lng="' + position.lng() + '"><i class="zmdi zmdi-walk zmdi-hc-2x"></i>&nbsp;Caminando</button>' +
        '<button class="buttonruta" id="btnBus" data-lat="' + position.lat() + '" data-lng="' + position.lng() + '"><i class="zmdi zmdi-bus zmdi-hc-2x"></i>&nbsp;Bus</button>' +
        '</div>' +
        '</div><!-- fin de layoutcontent-->' +
        '</div><!--fin de contenedor de horarios -->' +
        '</div>' +
        '</div>';

    //con base en el dia comparamos el rango de horas icluyendo minutos
    //genero el contenido dinamicamente
    //revisa que sea 24 horas   
    if (_24H === 'true') {
        contents += _24_horas + complementoHora + footer;
        var est = 'abierto'; //esto se debe cambiar x ahora en codigo duro
        //registro del manejo de evento click para desplegar el objeto InfoWindow
        window.setTimeout(function() {
            //añadir un marker con GMap
            var myIcon = new google.maps.MarkerImage("../images/markFarmaAbierto.png", null, null, null, new google.maps.Size(30, 48));
            urlMarker = "../images/markFarmaAbierto.png";
            var mark = map.createMarker({
                position: position,
                icon: myIcon,
                details: {
                    estado: est
                },
                title: suc,
                infoWindow: {
                    content: contents,
                    maxWidth: 345,
                },
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
    } else {
        //si no es 24h, obtenemos el dia y hora actual        	
        var fechaActual = new Date();
        var horaActual = fechaActual.getHours();
        var diaDeLaSemana = fechaActual.getDay();
        var urlMarker2;
        var myIcon2;
        //valida si el dia actual esta entre lunes y Sabado

        if (diaDeLaSemana >= 1 && diaDeLaSemana <= 6) {
            var est;
            if (abierto(fechaActual, aLS, cLS)) {
                myIcon2 = new google.maps.MarkerImage("../images/markFarmaAbierto.png", null, null, null, new google.maps.Size(30, 48));
                urlMarker2 = "../images/markFarmaAbierto.png";
                est = 'abierto';
            } else {
                myIcon2 = new google.maps.MarkerImage("../images/markFarmaCerrado.png", null, null, null, new google.maps.Size(30, 48));
                urlMarker2 = "../images/markFarmaCerrado.png";
                est = 'cerrado';
            } //fin del else 
            var hOrdinario = '<div class="layoutcontentbutton" id="infoHoradetalle">' +
                '<div class="contentestado">' +
                '<input id="estadoSucursal" type="hidden" value="' + est + '">' +
                '<div class="titleestado"><h4>Lunes - Sabado</h4></div>' +
                '<div class="infoestado">' + formatAMPM(getRealHour(aLS)) + ' - ' + formatAMPM(getRealHour(cLS)) + '</div>' +
                '</div>' +
                '<div class="contentestado">' +
                '<div class="titleestado"><h4>Domingos - Festivos</h4></div>' +
                '<div class="infoestado">' + formatAMPM(getRealHour(aDF)) + ' - ' + formatAMPM(getRealHour(cDF)) + ' </div>' +
                '</div>';
            contents += hOrdinario + complementoHora + footer;
            //registro del manejo 
            window.setTimeout(function() {
                var markd = map.createMarker({
                    position: position,
                    icon: myIcon2,
                    details: {
                        estado: est
                    },
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

        } //fin del if de horario lunes - sabado

        //valida si el dia actual es domingo			
        if (diaDeLaSemana == 0) {
            var est;            
            if (abierto(fechaActual, aDF, cDF)) {
                myIcon2 = new google.maps.MarkerImage("../images/markFarmaAbierto.png", null, null, null, new google.maps.Size(30, 48));
                urlMarker2 = "../images/markFarmaAbierto.png";
                est = 'abierto';
            } else {
                myIcon2 = new google.maps.MarkerImage("../images/markFarmaCerrado.png", null, null, null, new google.maps.Size(30, 48));
                urlMarker2 = "../images/markFarmaCerrado.png";
                est = 'cerrado';
            } //fin del else 
            var hOrdinario = '<div class="layoutcontentbutton">' +
                '<div class="contentestado">' +
                '<input id="estadoSucursal" type="hidden" value="' + est + '">' +
                '<div class="titleestado"><h4>Lunes - Sabado</h4></div>' +
                '<div class="infoestado">' + formatAMPM(getRealHour(aLS)) + ' - ' + formatAMPM(getRealHour(cLS)) + '</div>' +
                '</div>' +
                '<div class="contentestado">' +
                '<div class="titleestado"><h4>Domingos - Festivos</h4></div>' +
                '<div class="infoestado">' + formatAMPM(getRealHour(aDF)) + ' - ' + formatAMPM(getRealHour(cDF)) + ' </div>' +
                '</div>';
            contents += hOrdinario + complementoHora + footer;
            //registro del manejo 
            window.setTimeout(function() {
                //añadir un marker con GMap					
                var markd = map.createMarker({
                    position: position,
                    icon: myIcon2,
                    details: {
                        estado: est
                    },
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
        } //fin del if de horario para domingo

    } //fin del else
}

//metodo predicado que determina si la hora actual esta dentro de un rango
// El metodo tiene encuenta la hora y los minutos
function abierto(hActual, hApertura, hCierre) {
    var abierto = false;
    //hora actual es mayor a la hora de apertura?
    if (hActual.getHours() > getRealHour(hApertura).getHours() && hActual.getHours() < getRealHour(hCierre).getHours()) {
        abierto = true;
    }

    if (hActual.getHours() == getRealHour(hApertura).getHours()) {
        if (hActual.getMinutes() >= getRealHour(hApertura).getMinutes())
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
} // fin del metodo formatAMPM 



//recibe una hora como String y la retorna en formato hora
// puede recibir la hora en cualquier de esto formatos 
//'1:00 pm','1:00 p.m.','1:00 p','1:00pm','1:00p.m.','1:00p','1 pm','1 p.m.','1 p','1pm','1p.m.', '1p','13:00','13'
function getRealHour(stringHour) {		
    var time = stringHour.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    var dateHour = new Date();
    dateHour.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
    dateHour.setMinutes(parseInt(time[2]) || 0);
    return dateHour;
} //fin del metodo getRealHour


//anade el marcardor "Marker" al mapa y registra el evento click sobre el marcador
//para mostrar la informacion de la sucursal en un objeto InfoWindow
function addMarkerWithTimeoutPpal(position, timeout, suc, i, dir, telefono, celular) {

    var contentsp =
        '<div id="iw-container">' +
        '<div class="iw-titleppal">' +
        '<img src="../images/iconoDromedicas.png" alt="logoDromedicas">' +
        '<h3>' + suc + '</h3>' +
        '</div>' +
        '<div class="iw-contentppal">' +
        '<div class="row-content"><span class="icon-home"></span><div class="infocontent">' + dir + '</div></div>' +
        '<div class="row-content"><a href="tel:(037)' + telefono + '" class="footertext"><span class="icon-phone"></span><span class="infocontent"><span class="phonesuc">' + telefono + '</span></span></a></div>' +
        '<div class="row-content"><a href="tel:' + celular + '" class="footertext"><span class="icon-mobile"></span><span class="infocontent"><span class="phonesuc">' + celular + '</span></span></a></div>';

    //registro del manejo de evento click para desplegar el objeto InfoWindow
    window.setTimeout(function() {
        //añadir un marker con GMap
        var mark = map.createMarker({
            position: position,
            icon: "../images/markDromedicas.png",
            title: 'Dromedicas del Oriente',
            infoWindow: {
                content: contentsp
            },
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
} //fin del metodo  addMarkerWithTimeoutPpal


function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
} //fin del metodo  clearMarkers

function generarRutaCar(lat, lng, opcionTransporte) {
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

function generarRutaWalk(lat, lng, opcionTransporte) {
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

function generarRutaSucursal(lat, lng, opcionTransporte) {
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
function findMe() {
    map.hideInfoWindows(); //cierra el anterior infowindow
    map.cleanRoute(); //limpia toda la ruta
    map.setZoom(16);
    //cierro el menu
    var menu = document.getElementById('menu');
    menu.classList.remove('active');
    var coordsMarker = buscarMarcador(currentLat, currentLng);
    
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
function editCssInfoWindowNormal() {

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
        iwBackground.children(':nth-child(2)').css({
            'display': 'none'
        });
        // Removes white background DIV
        iwBackground.children(':nth-child(4)').css({
            'display': 'none'
        });
        // Moves the infowindow 115px to the right.
        iwOuter.parent().parent().css({
            left: '0px'
        });
        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({
            'box-shadow': 'rgba(0, 10, 123, .5) 0px 1px 6px',
            'z-index': '1'
        });
        // Reference to the div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();
        // Apply the desired effect to the close button
        var consulta = window.matchMedia('(max-width:320px)');
        if (consulta.matches) {
            iwCloseBtn.css({
                opacity: '1',
                right: '2px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        } else {
            iwCloseBtn.css({
                opacity: '1',
                right: '38px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        }
        consulta = window.matchMedia('(min-width:321px) and (max-width:550px)');
        if (consulta.matches) {
            iwCloseBtn.css({
                opacity: '1',
                right: '10px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        }

        // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
        // if($('.iw-content').height() < 140){
        // $('.iw-bottom-gradient').css({display: 'none'});
        // }
        // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
        iwCloseBtn.mouseout(function() {
            $(this).css({
                opacity: '1'
            });
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
        } //fin del else

        var btnCars = document.getElementById('btnCar');
        btnCars.addEventListener('click', function() {
            generarRutaCar(btnCars.getAttribute('data-lat'),
                btnCars.getAttribute('data-lng'),
                'driving')
        }, false);
        var btnWalk = document.getElementById('btnWalk');
        btnWalk.addEventListener('click', function() {
            generarRutaWalk(btnWalk.getAttribute('data-lat'),
                btnWalk.getAttribute('data-lng'),
                'walking')
        }, false);
        var btnBus = document.getElementById('btnBus');
        btnBus.addEventListener('click', function() {
            generarRutaCar(btnBus.getAttribute('data-lat'),
                btnBus.getAttribute('data-lng'),
                'driving')
        }, false);


    });
} // fin del metodo editCssInfoWindow


//Edicion del CSS para el objeto InfoWindows
function editCssInfoWindow() {
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
        iwBackground.children(':nth-child(2)').css({
            'display': 'none'
        });
        // Removes white background DIV
        iwBackground.children(':nth-child(4)').css({
            'display': 'none'
        });
        // Moves the infowindow 115px to the right.
        iwOuter.parent().parent().css({
            left: '0px'
        });
        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({
            'box-shadow': 'rgba(0, 10, 123, .5) 0px 1px 6px',
            'z-index': '1'
        });
        // Reference to the div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();
        // Apply the desired effect to the close button
        var consulta = window.matchMedia('(max-width:320px)');
        if (consulta.matches) {
            iwCloseBtn.css({
                opacity: '1',
                right: '2px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        } else {
            iwCloseBtn.css({
                opacity: '1',
                right: '38px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        }
        consulta = window.matchMedia('(min-width:321px) and (max-width:550px)');
        if (consulta.matches) {
            iwCloseBtn.css({
                opacity: '1',
                right: '10px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        }
        // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
        // if($('.iw-content').height() < 140){
        // $('.iw-bottom-gradient').css({display: 'none'});
        // }
        // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
        iwCloseBtn.mouseout(function() {
            $(this).css({
                opacity: '1'
            });
        });
        document.getElementById('estadosuc').innerHTML = '';
        var iconoAbierto = document.getElementById('iconestado');
        iconoAbierto.setAttribute("class", "zmdi zmdi-circle iconestadoabierto");
        var infoes = document.getElementById('estadosuc');
        infoes.appendChild(document.createTextNode("Abierto"));

        var btnCars = document.getElementById('btnCar');
        btnCars.addEventListener('click', function() {
            generarRutaCar(btnCars.getAttribute('data-lat'),
                btnCars.getAttribute('data-lng'),
                'driving')
        }, false);
        var btnWalk = document.getElementById('btnWalk');
        btnWalk.addEventListener('click', function() {
            generarRutaWalk(btnWalk.getAttribute('data-lat'),
                btnWalk.getAttribute('data-lng'),
                'walking')
        }, false);
        var btnBus = document.getElementById('btnBus');
        btnBus.addEventListener('click', function() {
            generarRutaCar(btnBus.getAttribute('data-lat'),
                btnBus.getAttribute('data-lng'),
                'driving')
        }, false);
    });
} // fin del metodo editCssInfoWindow


//Edicion del CSS para el objeto InfoWindows
function editCssInfoWindowPpal() {
    //Desde aca se comienza la manipulacion del DOM del objeto Info Window
    //nos apoyamos de jQuery
    console.log('css ppal');
    google.maps.event.addListener(infoWindowCustom, 'domready', function() {
        // Reference to the DIV that wraps the bottom of infowindow
        var iwOuter = $('.gm-style-iw');
        // iwOuter.children(':nth-child(1)').css({'display' : 'block'});		
        var iwBackground = iwOuter.prev();
        // Removes background shadow DIV
        iwBackground.children(':nth-child(2)').css({
            'display': 'none'
        });
        // Removes white background DIV
        iwBackground.children(':nth-child(4)').css({
            'display': 'none'
        });
        // Moves the infowindow 115px to the right.
        iwOuter.parent().parent().css({
            left: '0px'
        });
        // Changes the desired tail shadow color.
        iwBackground.children(':nth-child(3)').find('div').children().css({
            'box-shadow': 'rgba(0, 10, 123, .5) 0px 1px 6px',
            'z-index': '1'
        });
        // Reference to the div that groups the close button elements.
        var iwCloseBtn = iwOuter.next();
        // Apply the desired effect to the close button
        var consulta = window.matchMedia('(max-width:320px)');
        if (consulta.matches) {
            iwCloseBtn.css({
                opacity: '1',
                right: '2px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        } else {
            iwCloseBtn.css({
                opacity: '1',
                right: '38px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        }
        consulta = window.matchMedia('(min-width:321px) and (max-width:550px)');
        if (consulta.matches) {
            iwCloseBtn.css({
                opacity: '1',
                right: '10px',
                top: '3px',
                border: '7px solid rgba(0, 10, 123, 1.0)',
                'border-radius': '5px',
                'box-shadow': '0 0 5px rgba(0, 10, 123, .9)'
            });
        }
        // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
        // if($('.iw-content').height() < 140){
        // $('.iw-bottom-gradient').css({display: 'none'});
        // }
        // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
        iwCloseBtn.mouseout(function() {
            $(this).css({
                opacity: '1'
            });
        });
    });
} // fin del metodo editCssInfoWindow


//crea los div de las sucursales y los inserta en el contenedor
function crearSucursal(lat, lng, suc, dir, i, marker) {
    //1. creo los elementos
    //obtengo el contenedor 
    var contenedorSucursales = document.getElementById('contenedorSucursales');
    //creo el elemento ancla class linkdiv
    var id = "linkdivsuc" + i;
    var linkdivAncla = document.createElement("a");
    linkdivAncla.setAttribute("class", "linkdiv");
    linkdivAncla.setAttribute("id", id);
    linkdivAncla.setAttribute("data-lat", lat);
    linkdivAncla.setAttribute("data-lng", lng);
    //creo el element div class divsucursal
    var divsucursalElement = document.createElement("div");
    divsucursalElement.setAttribute("class", "divsucursal");
    //creo el div clase infosuc
    var infosucElement = document.createElement("div");
    infosucElement.setAttribute("class", "infosuc");
    //creo el div clase divmarker
    var divmarkerElement = document.createElement("div");
    divmarkerElement.setAttribute("class", "divmarker");
    //creo el elemento img con el marker
    var markerElement = document.createElement("img")
    markerElement.setAttribute("src", "../images/markFarmaAbierto.png");
    //creo el div clase detallesuc
    var detallesucElement = document.createElement("div");
    detallesucElement.setAttribute("class", "detallesuc");
    //creo el h3 id sucursalNombre
    var sucursalNombreElement = document.createElement("h3");
    sucursalNombreElement.setAttribute("id", "sucursalNombre");
    sucursalNombreElement.appendChild(document.createTextNode( nombrePropio(suc) ));
    //creo el p id dirSucursal
    var dirSucursalElement = document.createElement("p");
    dirSucursalElement.setAttribute("id", "dirSucursal");
    dirSucursalElement.appendChild(document.createTextNode( nombrePropio(dir) ));
    //creo el div clase distancediv
    var distancedivElement = document.createElement("div");
    distancedivElement.setAttribute("class", "distancediv");
    //creo el elemento p id distanciaSuc	
    var distanciaSucElement = document.createElement("p");
    distanciaSucElement.setAttribute("id", "distanciaSuc");

    //ACA DEBO TRAER LA DISTANCIA DE LA SUCURSAL
    var service = new google.maps.DistanceMatrixService;
    var origin = {
        lat: currentLat,
        lng: currentLng
    };
    var dest = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
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
                if (d < 1000) {
                    distancia = d + " mts";
                } else {
                    distancia = (d / 1000).toFixed(2) + " Km"
                }
                distanciaSucElement.appendChild(document.createTextNode(distancia));
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
        function() {
            generarRutaSucursal(sucursal.getAttribute('data-lat'),
                sucursal.getAttribute('data-lng'), 'driving');
            map.hideInfoWindows(); //cierra el anterior infowindow
            map.cleanRoute(); //limpia toda la ruta	
            console.log(suc);
            //itera los marcadores para disparar el infowindow correspondiente
            for (var i = 0; i < map.markers.length; i++) {
                if (suc == map.markers[i].title)
                    map.markers[i].infoWindow.open(map, map.markers[i]);
            } //fin del if
        },
        false);
} // fin del metodo crearSucursal



/***************************
 Metodos de Geolocalizacion
****************************/

// tomado de http://stackoverflow.com/a/4060721
function rad(x) {
    return x * Math.PI / 180;
}

function buscarMarcador(lat, lng) {
    //variables para el calculo
    var lat = lat;
    var lng = lng;
    var R = 6371; // radio de la tierra en kilometros
    var distances = [];
    var closest = -1;
    for (i = 0; i < markerst.length; i++) {
        var mlat = markerst[i].position.lat();
        var mlng = markerst[i].position.lng();
        var dLat = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        distances[i] = d;
        if ((closest == -1 || d < distances[closest]) && (markerst[i].details.estado === 'abierto')) {
            closest = i;
        }
    }
    markerNear = markerst[closest];
    return [markerst[closest].position.lat(), markerst[closest].position.lng()];
}


//Consuta la distancia entre la aubicacion actual y las coordenadas enviadas como parametros
function getCurrentDistanceGoogleMaps(lat, lng) { //----este metodo no se usa... :-(
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

                var d = response.rows[0].elements[0].distance.text;
                setDistancia(d);
            }
        }
    );
} //fin del metodo getCurrentDistanceGoogleMaps

/*
 * Recibe una cadena compuesta de varios tokens o palabras en
 * mayuscula o minuscula y lo convierte en nombre propio, Ej:
 * DROMEDICAS DEL ORIENTE ---> Dromedicas Del Oriente
 * dromedicas del oriente ---> Dromedicas Del Oriente
 */
function nombrePropio(cadena){
	var tokens = cadena.trim().split(" ");
	var nuevaCadena = "" ;
	for( var i = 0; i < tokens.length ; i++){
		var temp = tokens[i].substring(0, 1);
		var tokenTemp = temp.toUpperCase() + tokens[i].substring(1, tokens[i].length).toLowerCase();
		nuevaCadena += " " + tokenTemp;
	}
	return nuevaCadena.trim();

}


window.addEventListener('load', iniciar, false)