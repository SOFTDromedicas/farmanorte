<?php
       
       $datajson = "";
       $dirWS = 'http://dromedicas.ddns.net:9999/dropos/wsjson/sucursalesweb/';      
       $ch = curl_init($dirWS);
       curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
       // curl_setopt($ch, CURLOPT_POSTFIELDS, $datajson);
       curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
       curl_setopt($ch, CURLOPT_HTTPHEADER, array(
          'Content-Type: application/json')
       );
       curl_setopt($ch, CURLOPT_TIMEOUT, 8);
       curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);

       //execute post
       $jsonResponse = curl_exec($ch);
      //close connection
       curl_close($ch);
       echo $jsonResponse;

       // echo"PRUEBA JSON";
?>