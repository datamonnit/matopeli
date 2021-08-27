    // Luodaan kanvaasi
    kanvaasi = document.getElementById("kanvaasi");
    kanvaasiCtx = kanvaasi.getContext("2d");


    // Luodaan muuttujat
    var kanvaasi;
    var kanvaasiCtx;
    var matoLista = [{ x: 20, y: 20 }];
    var matoLiikkuminen = { x: 20, y: 0 };
    var vihuLiikkuminen = { x: 200, y: 0 };
    var matoAskel = 20;
    var ruoka = { x: 0, y: 0 };
    var pisteet = 0;
    var huippupisteet = 0;
    var pistekerroin;
    var pelinopeus;
    var suuntax= 0;
    var suuntay= 0;
    var omppuSfx;
    var ennatySfx;
    var vihuaskel=20;
    var vihux = -20;
    var vihuy = -20;
    var viholliskerroin;
    var peliloop;
    var x= 0;
    var kentanLeveys = kanvaasi.width;
    var kentanKorkeus = kanvaasi.height;
    var musiikki;
    var osuminen;
    
    // Tuodaan äänet ja kuvat 
    omenaSfx = new sound("sfx/omppu.ogg");
    ennatysSfx = new sound("sfx/voitto.mp3");
    var omena = new Image();
    omena.src = 'kuvat/omena.png';
    var mato = new Image();
    mato.src = 'kuvat/mato.png';
    var matox0 = new Image();
    matox0.src = 'kuvat/matox0.png';
    var matox1 = new Image();
    matox1.src = 'kuvat/matox1.png';
    var matoy0 = new Image();
    matoy0.src = 'kuvat/matoy0.png';
    var matoy1 = new Image();
    matoy1.src = 'kuvat/matoy1.png';
    var hanta = new Image();
    hanta.src = 'kuvat/hanta.png';
    var hamis = new Image();
    hamis.src = 'kuvat/hamis.png';
    var hamis2 = new Image();
    hamis2.src = 'kuvat/hamis2.png';

    
    // aloitetaan taustamusiikin soitto ja poistetaan aloitus ruutu kun sitä painetaan
    function aloitus(){
        var musat = document.getElementById("musiikki");
            musat.play();
        document.getElementById("alku").style.display="none";  
    }


    // Pelin aloitus funktio jossa annetaan parametrit levelikohtaisesti
    // poistellaan divit edestä ja aloitetaan levelikohtainen musiikki
    // lisäksi ladataan localStoragesta pisteet
    function aloitaPeli(kerroin,tasokerroin,nopeus,musa) {
        if (localStorage.getItem("pisteet")>huippupisteet) {
            huippupisteet= localStorage.getItem("pisteet");
        }
        luoRuoka();
        pistekerroin = kerroin;
        viholliskerroin=tasokerroin;
        pelinopeus=nopeus;
        musiikki=musa;
        document.getElementById("ennatys").innerHTML=huippupisteet;
        document.getElementById("menu").style.display = "none";
        document.getElementById("tekijapalkki").style.display ="none"; 
        document.getElementById("pistepalkki").style.display ="inline";
        document.getElementById("musiikki").src = "sfx/"+musiikki+".mp3";    
        peliloop = setInterval(peliLoop, pelinopeus);
    }


    // Pelin pyöritys loop
    function peliLoop()
    {  
        if (loppuiko_peli()) {
            peliOhi(); 
            clearInterval(peliloop); 
        } 
    madonLiike();
    omenaOsuma();
    draw();
    }
 

    // Madon liikkuminen arrayn avulla
    function madonLiike()
    {
        var uusiPaa = {
            x: matoLista[0].x + matoLiikkuminen.x,
            y: matoLista[0].y + matoLiikkuminen.y
        }
    matoLista.unshift(uusiPaa);
    matoLista.pop(); 
    }

 
    // Kutsutaan kaikki piirrettävät asiat
    function draw()
    {
        tyhjennaKanvaasi("blanchedalmond");
        piirraMato();
        piirraRuoka();
        piirraVihu();
    }


    // kanvaasin piirto
    function tyhjennaKanvaasi(color) {

    kanvaasiCtx.clearRect(0, 0, kanvaasi.width, kanvaasi.height);
    kanvaasiCtx.fillStyle = color;
    kanvaasiCtx.beginPath();
    kanvaasiCtx.rect(0, 0, kanvaasi.width, kanvaasi.height);
    kanvaasiCtx.fill();
    }


    // Madon piirto
    function piirraMato() {    
    var vikapala = matoLista.length - 1;
        // Piirretään jokainen arraysta löytyvä madon sijainti
        matoLista.forEach(solu =>
        {  
        kanvaasiCtx.drawImage(mato, solu.x, solu.y,matoAskel, matoAskel);
        });
        // Piirretään erilainen häntä pala  
        kanvaasiCtx.drawImage(hanta, matoLista[vikapala].x, matoLista[vikapala].y,matoAskel, matoAskel); 
        // Piirretään pää sen mukaan minne ollaan menossa
        if ( matoLiikkuminen.x == 0 && matoLiikkuminen.y == -matoAskel) {
            kanvaasiCtx.drawImage(matoy1, matoLista[0].x, matoLista[0].y-7,matoAskel, matoAskel);
        }
        if ( matoLiikkuminen.x == 0 && matoLiikkuminen.y == matoAskel) {
            kanvaasiCtx.drawImage(matoy0, matoLista[0].x, matoLista[0].y+7,matoAskel, matoAskel);
        }
        if (matoLiikkuminen.x == matoAskel && matoLiikkuminen.y == 0) {
            kanvaasiCtx.drawImage(matox1, matoLista[0].x+7, matoLista[0].y,matoAskel, matoAskel);
        }
        if (matoLiikkuminen.x == -matoAskel && matoLiikkuminen.y == 0) {
            kanvaasiCtx.drawImage(matox0, matoLista[0].x-7, matoLista[0].y,matoAskel, matoAskel);
        }    
    }


    // Ruoan piirto sille arvotun sijainnin mukaan
    function piirraRuoka() {   
        kanvaasiCtx.drawImage(omena, ruoka.x, ruoka.y,matoAskel, matoAskel);
    }
    

    // Liikkuvan vihun sekä staattisen vihun piirtäminen
    // Samassa myös liikkuvan vihun koodi
    function piirraVihu() {      
        if (vihuLiikkuminen.y >= 380) {
            vihuaskel=-20;
        }
        if (vihuLiikkuminen.y <= 0) {
            vihuaskel=20;
        }
        vihuLiikkuminen.y = vihuLiikkuminen.y+vihuaskel;

        kanvaasiCtx.drawImage(hamis, vihuLiikkuminen.x, vihuLiikkuminen.y,20, 20);
        if (pisteet%viholliskerroin == 0) {
            kanvaasiCtx.drawImage(hamis2, vihux, vihuy,20, 20);
        }
    }


    // Ruoan sijainnin luonti
    function luoRuoka() {
        ruoka.x = 20 * getRandomInt(0, kentanLeveys / 20  - 1);
        ruoka.y = 20 * getRandomInt(0, kentanKorkeus / 20  - 1);
    }
    

    // Staattisen vihollisen sijainnin luonti
    // Kutsutaan lopuksi tarkistusfunktio
    function luoVihu() {
        vihux = 20 * getRandomInt(0, kentanLeveys / 20  - 1);
        vihuy = 20 * getRandomInt(0, kentanKorkeus / 20  - 1);
        tarkastaVihu();
    }


    // Tarkastetaan ettei ruoka tai madon pää ole samalla kohdalla kuin ilmestyvä staattinen vihu
    // osuminen muuttuja siksi ettei mato voi osua viholliseen kuin vasta samalla kun vihu piirretään
    function tarkastaVihu() {
        osuminen = 0;
        if (vihux == ruoka.x && vihuy == ruoka.y || vihux == matoLista[0].x && vihuy == matoLista[0].y) {
            luoVihu();
        }
        if (pisteet%viholliskerroin == 0) { 
        osuminen = 1;
        }
    }


    // Random koordinaatti generaattori kanvaasin sisälle, tätä kutsutaan ruoan ja staattisen vihollisen kanssa
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    // Tarkistetaan osuma omenaan ja jos osuu toistetaan ääni sekä annetaan pisteet
    // Samalla luodaan uudet sijainnit omenalle sekä staattiselle viholliselle
    function omenaOsuma() {
        if (matoLista[0].x === ruoka.x &&
            matoLista[0].y === ruoka.y)
        { 
            omenaSfx.play();
            matoLista.push({ x: ruoka.x, y: ruoka.y });
            pisteet= pisteet+1;
            document.getElementById("pisteet").innerHTML=Math.round(pisteet*pistekerroin);
            luoRuoka();
            luoVihu();
        }
     }


    // Tarkistetaan osumat seiniin ja vihollisiin, osumasta palauttaa true.
    function loppuiko_peli() {   
        // Osuma matoon itseensä
        for (var i = 3; i < matoLista.length; i++) {
          if (
            matoLista[0].x === matoLista[i-1].x &&
            matoLista[0].y === matoLista[i-1].y
              ) return true
        }
        // Osuma liikkuvaan viholliseen
        for (var i = 0; i < matoLista.length; i++) {
            if (matoLista[i].x === vihuLiikkuminen.x && matoLista[i].y === vihuLiikkuminen.y)
            return true
          } 
        // Osuma staattiseen viholliseen
        if (matoLista[0].x === vihux && matoLista[0].y === vihuy && osuminen === 1) {
            return true
        }
        // Osuma kanvaasin reunoihin
        const osuiVasenSeina = matoLista[0].x < 0;
        const osuiOikeaSeina = matoLista[0].x > kanvaasi.width - 20;
        const osuiYlaSeina = matoLista[0].y < 0;
        const osuiAlaSeina = matoLista[0].y > kanvaasi.height - 20;
        return osuiVasenSeina || osuiOikeaSeina || osuiYlaSeina || osuiAlaSeina
      }
    

      // Pelin loppumisfunktio, tuodaan divejä esille ja näytellään pisteitä.
      // lisäksi viedään localStorageen huippupisteet ja soitellaan musiikkia jos isommat kuin aiemmat.
      function peliOhi() {  
        if (Math.round(pisteet*pistekerroin)> huippupisteet){
        ennatysSfx.play();
        huippupisteet=Math.round(pisteet*pistekerroin);
        localStorage.setItem("pisteet", huippupisteet);
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
      

      //päivitetään välilehti = aloitetaan uusi peli
      function pelaaUudelleen() {
        location.reload();
      }



    // Liikkuminen, eli tarkkaillaan käyttäjän syötteitä ja liikutaan sen mukaisesti.
    document.onkeydown = (event) =>
    {
        switch (event.keyCode)
        {
            case 38: 
            if (matoLiikkuminen.y == matoAskel)
                return
                matoLiikkuminen.x = 0;
                matoLiikkuminen.y = -matoAskel;
                suuntay=1;
                break;
            case 37:
                if (matoLiikkuminen.x == matoAskel)
                return    
                matoLiikkuminen.x = -matoAskel;
                matoLiikkuminen.y = 0;
                suuntax=-1;
                break;
            case 39:  
            if (matoLiikkuminen.x == -matoAskel)
                return     
                matoLiikkuminen.x = matoAskel;
                matoLiikkuminen.y = 0;
                suuntax=1;
                break;
            case 40:
                if (matoLiikkuminen.y == -matoAskel)
                return    
                matoLiikkuminen.x = 0;
                matoLiikkuminen.y = matoAskel;
                suuntay=-1;
                break;
        }
    };