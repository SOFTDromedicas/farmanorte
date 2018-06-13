/**| @lfernandortiz - @SoftDromedicas*/
$(document).foundation();
console.log("%cDesarrollado  ️ por @Softdromedicas ( @lfernandortiz - @SaidRodriguezC )", "background: #000a7b; color: white; font-size: normal");


//burger menu movil
$(".btn-nav").on("click tap", function(){
    $(".bar").toggleClass("animated");
    $(".burger__menu li").toggleClass("view");
    $("#logo-offcanvas").toggleClass("view");
    document.body.classList.toggle("open");
 })


 //mantiene la ventana del chat en la aplicacion
 $('#consulta-div').on('click', function() {
    window.open('https://tawk.to/chat/585959ccddb8373fd2b14f8e/default/?$_tawk_popout=false', 
                            '_blank', 'location=no,hidden=yes,closebuttoncaption=Done,toolbar=no');
  });

