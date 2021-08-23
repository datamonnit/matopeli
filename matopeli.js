 var kanvaasi;
 var kanvaasiCtx;
 var matoLista = [{ x: 20, y: 20 }];
 var matoLiikkuminen = { x: 20, y: 0 };
 var matoAskel = 20;
 var ruoka = { x: 0, y: 0 };
 var pisteet = 0;


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
             matoLiikkuminen.x = 0;
             matoLiikkuminen.y = -matoAskel;
             break;
         case 37:    
             matoLiikkuminen.x = -matoAskel;
             matoLiikkuminen.y = 0;
             break;
         case 39:       
             matoLiikkuminen.x = matoAskel;
             matoLiikkuminen.y = 0;
             break;
         case 40:    
             matoLiikkuminen.x = 0;
             matoLiikkuminen.y = matoAskel;
             break;
     }
 };

function aloitaPeli() {
    pistekerroin = 1;
    document.getElementById("menu").style.display = "none";
    document.getElementById("tekijapalkki").style.display ="none"; 
    document.getElementById("pistepalkki").style.display ="inline";  
    setInterval(peliLoop, 200);
}

function aloitaPeliKeski() {
    pistekerroin = 1.5;
    document.getElementById("menu").style.display = "none";
    document.getElementById("pistepalkki").style.display ="inline";        
    setInterval(peliLoop, 90);
}

function aloitaPeliVaikea() {
    pistekerroin = 2;
    document.getElementById("menu").style.display = "none";
    document.getElementById("pistepalkki").style.display ="inline";     
    setInterval(peliLoop, 40);
}

 function peliLoop()
 {
    if (loppuiko_peli()) {
        peliOhi();
        return;
    } 
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
     document.getElementById("pistepalkki").style.display ="none";
     document.getElementById("loppupalkki").style.display ="inline";
     document.getElementById("omenat").innerHTML=pisteet;
     document.getElementById("kerroin").innerHTML=pistekerroin;
     document.getElementById("pisteetLoppu").innerHTML=Math.round(pisteet*pistekerroin);
     document.getElementById("peliOhi").style.display ="block";
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
        kanvaasiCtx.drawImage(mato, solu.x, solu.y,matoAskel, matoAskel);
     });
 }

 function piirraRuoka()
 {   
    kanvaasiCtx.drawImage(omena, ruoka.x, ruoka.y,matoAskel, matoAskel);
 }

 function drawRectangle(x, y, color, size)
 {
     kanvaasiCtx.beginPath();
     kanvaasiCtx.rect(x, y, size, size);
     kanvaasiCtx.fillStyle = color;
     kanvaasiCtx.fill();
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

