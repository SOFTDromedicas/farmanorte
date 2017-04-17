<?php      
      header("Access-Control-Allow-Origin: *");
       
       $dirWS = 'http://dromedicas.ddns.net:8080/serviciomapasfarmanorte/rest/sucursales';      
       $ch = curl_init($dirWS);
       curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
       curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
       // curl_setopt($ch, CURLOPT_HTTPHEADER, array(
       //    'Content-Type: application/json')
       // );
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false)
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
       
       curl_setopt($ch, CURLOPT_TIMEOUT, 40);
       curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 40);
       //execute post
       $jsonResponse = curl_exec($ch);

      //close connection
       curl_close($ch);
       echo $jsonResponse;


     
?>