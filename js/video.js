var lunaReq= webOS.service.request("luna://com.palm.systemservice",
        {
            method:"clock/getTime",
            parameters:{},
            onSuccess: function (args) {
				log("UTC:", args.utc);
            },
            onFailure: function (args) {
            }
        });
var divLOG=null;
document.addEventListener('webOSLaunch', function(inData) {
   log(JSON.stringify(inData.detail));
   webOS.deviceInfo(function(info){
	   log(JSON.stringify(info));
   });
    
}, true);
 
// webOSRelaunch event
document.addEventListener('webOSRelaunch', function(inData) { 
    // Check the received parameters
    log(JSON.stringify(inData.detail));
    PalmSystem.activate();

}, true);
function back(){
	webOS.platformBack();
}
function log(texto){
	if(divLOG==null){
		divLOG=document.getElementById("log");
	}
	divLOG.innerText=(texto+"\r\n")+divLOG.innerText;
	   
}	
var dimensiones={};
function cargarLista(){
	let izquierda=document.getElementById("izquierdo");
	let derecha=document.getElementById("derecho");
	dimensiones["ancho"]=document.body.clientWidth;
	dimensiones["alto"]=document.body.clientHeight;
	
	
	let anchoIzquierdo=Math.round(dimensiones.ancho*0.1);
	let anchoDerecho=Math.round(dimensiones.ancho*0.9);
	
	izquierda.style.width=anchoIzquierdo+"px";
	izquierda.style.height=dimensiones.alto+"px";
	derecha.style.width=anchoDerecho+"px";
	derecha.style.left=anchoIzquierdo+"px";
	derecha.style.height=dimensiones.alto+"px";
	
	
	
	//http://iptv8.premium-stv.com:2052/ARAB@PRO1@m/nxzcK@Hf@5gy/1630
	//http://vevoplaylist-live.hls.adaptive.level3.net/vevo/ch1/appleman.m3u8
	log("iniciamos");
	/*var pantalla=document.getElementById("pantalla");
	*/
	  ///pantalla.src="http://vevoplaylist-live.hls.adaptive.level3.net/vevo/ch1/appleman.m3u8";
	
	//
	webOS.service.request("./m3u/canales.m3u",
	        {
	            method:"",
	            parameters:{},
	            onSuccess: function (args) {
					log("info:", args.utc);
	            },
	            onFailure: function (args) {
	            	log("no he podido");
	            }
	        });
	
	var xhttp = new XMLHttpRequest();
	//xhttp.open("GET", "./m3u/canales.m3u", true);
	xhttp.open("GET", "http://www.programacionextrema.es/proyectos/ext1/servidor/canales.m3u", true);
	xhttp.send();
	xhttp.onreadystatechange = function() {
		//log(this.readyState);
		let obCanal=document.getElementById("canales");
		//obCanal.inneHTML="";
		if (this.readyState == 4){
			log(this.status);
			if(this.status == 200) {
				log(this.responseText.substr(0,100));
				let textoCanales=this.responseText.replace(/\r/,"\n").replace(/\n\n/,"\n");
				let canales=textoCanales.split("\n");
				let nombreCanal="Canal";
				for(let canal of canales){
					
					if(canal[0]!='#'){
						let item=document.createElement("div");
						item.innerHTML=nombreCanal;
						item.onclick=function(evento){
							reproducir(canal, this, evento);
						}
						obCanal.appendChild(item);
					}else{
						nombreCanal=canal.substr(1);
					}
				}
			}else{
				log("ERROR:"+this.statusText);
			}
		}
	};
	xhttp.onError=function(){
		log("Error");
	}
	

}
var itemSeleccionado=null;
function reproducir(url, item, event){
	if(itemSeleccionado!=null){
		itemSeleccionado.className="";
	}
	if(item){
		item.className="seleccionado";
		itemSeleccionado=item;
	}
	
	
	
	let pantalla=document.getElementById("pantalla");
	pantalla.innerHTML="";
	let video=document.createElement("VIDEO");
	video.controls="true";
	video.style.width=+"100%";
	pantalla.appendChild(video);
	video.onerror = function(event) {
		log("Error " + event.target.error.code + "; details: " + event.target.error.message);
	}
	video.src=url;
	video.load();
	video.play();
	
	log(url);
}
function play(){
	log("play");
	var video=document.getElementById("pantalla").getElementsByTags("video")[0];
	video.play();
}
function stop(){
	log("stop");
	var video=document.getElementById("pantalla").getElementsByTags("video")[0];
	video.stop();
	
}
/*function cambiaDireccion(){
	var pantalla=document.getElementById("pantalla");
	var input=document.getElementById("direccion");
	pantalla.src=input.value;
	pantalla.play();
}*/