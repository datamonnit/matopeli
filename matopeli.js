 var kanvaasi;
 var kanvaasiCtx;
 var matoLista = [{ x: 20, y: 20 }];
 var matoLiikkuminen = { x: 20, y: 0 };
 var matoAskel = 20;
 var ruoka = { x: 0, y: 0 };
 var pisteet = 0;
 var huippupisteet = 0;

 var omppuSfx;
 var ennatySfx;
 


 kanvaasi = document.getElementById("kanvaasi");
 kanvaasiCtx = kanvaasi.getContext("2d");

 document.getElementById("menu").style.width = innerWidth/2;
 document.getElementById("menu").style.width = innerHeight/2;

 var kentanLeveys = kanvaasi.width;
 var kentanKorkeus = kanvaasi.height;

 var omena = new Image();
 omena.src = 'kuvat/omena.png';
 
 var mato = new Image();
 mato.src = 'kuvat/mato.png';



 luoRuoka();


 document.onkeydown = (event) =>
 {
     switch (event.keyCode)
     {
         case 38: 
         if (matoLiikkuminen.y == matoAskel)
             return
             matoLiikkuminen.x = 0;
             matoLiikkuminen.y = -matoAskel;
             break;
         case 37:
            if (matoLiikkuminen.x == matoAskel)
            return    
             matoLiikkuminen.x = -matoAskel;
             matoLiikkuminen.y = 0;
             break;
         case 39:  
         if (matoLiikkuminen.x == -matoAskel)
             return     
             matoLiikkuminen.x = matoAskel;
             matoLiikkuminen.y = 0;
             break;
         case 40:
            if (matoLiikkuminen.y == -matoAskel)
            return    
             matoLiikkuminen.x = 0;
             matoLiikkuminen.y = matoAskel;
             break;
     }
 };

function aloitus(){
    var musat = document.getElementById("musiikki");
        musat.play();
    document.getElementById("alku").style.display="none";
}
function aloitaPeli() {
    if (sessionStorage.getItem("pisteet")>huippupisteet) {
        huippupisteet= sessionStorage.getItem("pisteet");
    }
    pistekerroin = 1;
    matoLiikkuminen = { x: 20, y: 0 };
    document.getElementById("ennatys").innerHTML=huippupisteet;
    document.getElementById("menu").style.display = "none";
    document.getElementById("tekijapalkki").style.display ="none"; 
    document.getElementById("pistepalkki").style.display ="inline";
    document.getElementById("musiikki").src = "sfx/helppo.mp3";    
    setInterval(peliLoop, 200);
}

function aloitaPeliKeski() {
    if (sessionStorage.getItem("pisteet")>huippupisteet) {
        huippupisteet= sessionStorage.getItem("pisteet");
    }
    pistekerroin = 1.5;
    matoLiikkuminen = { x: 20, y: 0 };
    document.getElementById("ennatys").innerHTML=huippupisteet;
    document.getElementById("menu").style.display = "none";
   document.getElementById("tekijapalkki").style.display ="none"; 
   document.getElementById("pistepalkki").style.display ="inline";
   document.getElementById("musiikki").src = "sfx/keskivaikea.mp3";  
   setInterval(peliLoop, 100);
}

function aloitaPeliVaikea() {
    if (sessionStorage.getItem("pisteet")>huippupisteet) {
        huippupisteet= sessionStorage.getItem("pisteet");
    }
    pistekerroin = 2;
    matoLiikkuminen = { x: 20, y: 0 };
    document.getElementById("ennatys").innerHTML=huippupisteet;
    document.getElementById("menu").style.display = "none";
   document.getElementById("tekijapalkki").style.display ="none"; 
   document.getElementById("pistepalkki").style.display ="inline";
   document.getElementById("musiikki").src = "sfx/vaikea.mp3";  
   setInterval(peliLoop, 50);
}

 function peliLoop()
 {
    if (loppuiko_peli()) {
        document.getElementById("musiikki").src = "";  
        peliOhi();  
    } 
    omenaSfx = new sound("sfx/omppu.ogg");
    ennatysSfx = new sound("sfx/voitto.mp3");
     update();
     draw();
 }
 
 function update()
 {
    
     var uusiPaa = {
         x: matoLista[0].x + matoLiikkuminen.x,
         y: matoLista[0].y + matoLiikkuminen.y
     }

     matoLista.unshift(uusiPaa);

     matoLista.pop();

     if (matoLista[0].x === ruoka.x &&
         matoLista[0].y === ruoka.y)
     { 
         omenaSfx.play();
         matoLista.push({ x: ruoka.x, y: ruoka.y });
         pisteet= pisteet+1;
         document.getElementById("pisteet").innerHTML=Math.round(pisteet*pistekerroin);
         luoRuoka();
     }
 }

 function loppuiko_peli() {
     
    for (var i = 3; i < matoLista.length; i++) {
      if (
        matoLista[0].x === matoLista[i-1].x &&
        matoLista[0].y === matoLista[i-1].y
          ) return true
    }
    const osuiVasenSeina = matoLista[0].x < 0;
    const osuiOikeaSeina = matoLista[0].x > kanvaasi.width - 20;
    const osuiYlaSeina = matoLista[0].y < 0;
    const osuiAlaSeina = matoLista[0].y > kanvaasi.height - 20;
    return osuiVasenSeina || osuiOikeaSeina || osuiYlaSeina || osuiAlaSeina
  }

  function peliOhi() {  
    if (Math.round(pisteet*pistekerroin)> huippupisteet){
    ennatysSfx.play();
    huippupisteet=Math.round(pisteet*pistekerroin);
    sessionStorage.setItem("pisteet", huippupisteet);
    document.getElementById("peliloppui").innerText="TEIT UUDEN ENNÄTYKSEN!";
    }  
    document.getElementById("ennatys").innerHTML=huippupisteet;
    document.getElementById("pistepalkki").style.display ="none";
    document.getElementById("loppupalkki").style.display ="inline";
    document.getElementById("omenat").innerHTML=pisteet;
    document.getElementById("kerroin").innerHTML=pistekerroin;
    document.getElementById("pisteetLoppu").innerHTML=Math.round(pisteet*pistekerroin);
    document.getElementById("peliOhi").style.display ="block";
    return 
  }

  function pelaaUudelleen() {
    location.reload();
  }

 function draw()
 {
     tyhjennaKanvaasi("blanchedalmond")
     piirraMato();
     piirraRuoka();
 }

 function tyhjennaKanvaasi(color)
 {

     kanvaasiCtx.clearRect(0, 0, kanvaasi.width, kanvaasi.height);
     kanvaasiCtx.fillStyle = color;
     kanvaasiCtx.beginPath();
     kanvaasiCtx.rect(0, 0, kanvaasi.width, kanvaasi.height);
     kanvaasiCtx.fill();
 }

 function piirraMato()
 {    

     matoLista.forEach(solu =>
     {  
        kanvaasiCtx.shadowColor = 'red';
        kanvaasiCtx.shadowBlur = 5;
        kanvaasiCtx.strokeStyle = 'black';
        kanvaasiCtx.lineWidth = 1;
        kanvaasiCtx.drawImage(mato, solu.x, solu.y,matoAskel, matoAskel);
        kanvaasiCtx.strokeRect(solu.x, solu.y, matoAskel, matoAskel);
     });
 }

 function piirraRuoka()
 {   
    kanvaasiCtx.drawImage(omena, ruoka.x, ruoka.y,matoAskel, matoAskel);
 }

 function luoRuoka()
 {
     ruoka.x = 20 * getRandomInt(0, kentanLeveys / 20  - 1);
     ruoka.y = 20 * getRandomInt(0, kentanKorkeus / 20  - 1);
 }

 function getRandomInt(min, max)
 {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;
 }
