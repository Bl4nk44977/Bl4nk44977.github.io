/**
 * 
 * Obiekty:
 * 
 * Gra
 * 
 * Drwal
 * 
 * Drzewo
 * 
 */

document.addEventListener('DOMContentLoaded', () =>{ 
    new Gra();
});

class Gra {
    drwal = null;
    drzewo = null;
    punkty = 0;
    czas = 0;
    czas_poczatkowy = 15000;
    punktyElement = null;
    plansza = null;

    interwal = null;

    constructor() {
        this.drwal = new Drwal();
        this.drzewo = new Drzewo();
        this.ustalElementyHTML();
        this.dodajZdarzenia();
    }

    graStart() {
        this.punkty = -1;
        this.czas = this.czas_poczatkowy;
        this.drwal.reset();
        this.drzewo.reset();
        this.dodajPunkt();

        this.pasekCzasu.removeAttribute('style');
        this.pasekCzasuMax = this.pasekCzasu.offsetWidth;
        console.log('pasek', this.pasekCzasuMax);

        //powtarzanie wykoania funkcji powtarzaj co 200 milisekund
        this.interwal = setInterval(()=>{this.powtarzaj();}, 200);
        //uruchomienie klawiszy
        window.addEventListener('keydown', this.obslugaKlawiszy);
    }

    graKoniec() {
        //zatrzymanie powtarzania
        this.drwal.smierc();
        clearInterval(this.interwal);
        window.removeEventListener('keydown', this.obslugaKlawiszy);
        this.btnStart.classList.remove('ukryty');
    }

    powtarzaj() {
        this.czas -= 200;

        let procent = this.czas / this.czas_poczatkowy;
        this.pasekCzasu.style.width = Math.round(this.pasekCzasuMax * procent) + "px";

        if(this.czas <= 0) {
            this.graKoniec();
        }
    }

    //funkcja dla zdarzenia klikania
    obslugaKlawiszy = (e) => {
        if(e.key === 'ArrowLeft') {
            this.drwal.lewo();
            this.sprawdzRuch();
        } else if(e.key === 'ArrowRight') {
            this.drwal.prawo();
            this.sprawdzRuch();
        }
    }

    //weryfikacja ruchu drwala
    sprawdzRuch() {
        this.drzewo.usunOstatniPien();
        if(this.jestKolizja()) {
            this.graKoniec();
        } else {
            this.dodajPunkt();
            this.dodajCzas();
        }
    }

    //sprawdzenie kolizji
    jestKolizja() {
        return (
            (this.drwal.pozycja === 'lewa' && this.drzewo.pnie[0].rodzaj === 1) ||
            (this.drwal.pozycja === 'prawa' && this.drzewo.pnie[0].rodzaj === 2)
            );
    }

    dodajCzas() {
        this.czas += 150;
        if(this.czas > this.czas_poczatkowy) {
            this.czas = this.czas_poczatkowy;
        }
    }

    dodajPunkt() {
        this.punkty++;
        this.punktyElement.innerText = this.punkty;
    }

    //ustal Element Punkty
    ustalElementyHTML() {
        this.plansza = document.querySelector('.plansza');
        this.punktyElement = this.plansza.querySelector('.punkty');
        this.btnStart = this.plansza.querySelector('.btn-start');
        this.pasekCzasu = this.plansza.querySelector('.czas-pasek');
    }

    //dodanie zdarzen
    dodajZdarzenia() {
        //przycisk rozpoczynający grę
        this.btnStart.addEventListener('click', ()=> {
            this.btnStart.classList.add('ukryty');
            this.graStart();
        });
    }
}

/*
    Drzewo
    - tablica z kawałkami drzewa
    - usuwanie ostaniego kawałka
    - dodawanie nowego kawałka na początku
    - losowanie nowych kawałków

*/

class Drzewo {
    elementHTML = null;
    pnie = [];
    iloscPni = 6;

    constructor() {
        this.utworzDrzewo();
        this.generujDrzewo();
    }

    //utworzenie Drzewa (element HTML)
    utworzDrzewo() {
        this.elementHTML = document.createElement('div');
        this.elementHTML.classList.add('drzewo');

        document.querySelector('.plansza').appendChild(this.elementHTML);
    }

    //wygenerowanie pni (wypełnienie tablicy)
    generujDrzewo() {
        this.pnie.push(new Pien(0));
        for(let i = 0; i < this.iloscPni; i++) {
            this.dodajNowyPien();
        }
    }

    //dodanie pnia do drzewa
    dodajNowyPien() {
        let ostatniPien = this.pnie[this.pnie.length - 1].rodzaj;
        let rodzaj = 0;

        do {
            rodzaj = Math.round(Math.random()*2);
        }
        while( 
            (ostatniPien === 1 && rodzaj === 2) || 
            (ostatniPien === 2 && rodzaj === 1) 
            );
        

        // switch(ostatniPien) {
        //     case 1:
        //         if(rodzaj === 2) {
        //             rodzaj = 1;
        //         }
        //         break;
        //     case 2:
        //         if(rodzaj === 1) {
        //             rodzaj = 2;
        //         }
        //         break;
        // }   
        this.pnie.push(new Pien(rodzaj));
    }

    //usunięcie najniższego pnia
    usunOstatniPien() {

        if(this.pnie.length < 1) {
            return; //jezeli nie ma pni to to nie usuwamy
        }

        //ustalenie ostatniego pnia
        // let ostatni = this.pnie[this.pnie.length - 1];
        let ostatni = this.pnie[0];
        //usuniecie elementu ostatniego pnia
        ostatni.usunPien();
        //usniecie pnia z drzewa
        // this.pnie.pop();
        this.pnie.shift();

        //uzupełnienie drzewa
       this.dodajNowyPien();
    }

    reset() {
        for(let pien of this.pnie) {
            pien.usunPien();
        }
        this.pnie = [];
        this.generujDrzewo();
    }
}

/*
    Pien
*/
class Pien {
    elementHTML = null;
    //rodzaj: 0 - bez gałęzi, 1 - galąź po lewej, 2 - gałąź po prawej
    rodzaj = 0;
    constructor(rodzaj = 0) {
        this.rodzaj = rodzaj;
        this.utworzPien();
    }

    //utworzenie Pnia (element HTML)
    utworzPien() {
        this.elementHTML = document.createElement('div');
        this.elementHTML.classList.add('pien');
        if(this.rodzaj === 1) {
            this.elementHTML.classList.add('pien--lewy');
        } else if(this.rodzaj === 2) {
            this.elementHTML.classList.add('pien--prawy');
        }

        //dodawanie na końcu
        // document.querySelector('.drzewo').appendChild(this.elementHTML);
        //dodawanie na początku
        document.querySelector('.drzewo').prepend(this.elementHTML);
    }

    //usunięcie pnia (elementHTML)
    usunPien() {
        this.elementHTML.remove();
    }
}


/*
    Drwal
    - ruchy prawo lewo  
*/

class Drwal {
    elementHTML = null;
    pozycja = 'lewa';

    constructor() {
        this.utworzDrwala();
    }

    //utworzenie Drwala (element HTML)
    utworzDrwala() {
        this.elementHTML = document.createElement('div');
        this.elementHTML.classList.add('drwal', 'drwal--lewa');

        document.querySelector('.plansza').appendChild(this.elementHTML);
    }

    lewo() {
        this.elementHTML.classList.remove('drwal--prawa');
        this.elementHTML.classList.add('drwal--lewa');
        this.pozycja = 'lewa';
        this.ciecie();
    }

    prawo() {
        this.elementHTML.classList.remove('drwal--lewa');
        this.elementHTML.classList.add('drwal--prawa');
        this.pozycja = 'prawa';
        this.ciecie();
    }

    smierc() {
        this.elementHTML.classList.add('drwal--smierc');
    }

    //Dodanie animacji cięcia
    ciecie() {
        this.elementHTML.classList.add('drwal--ciecie');
        setTimeout(()=>{
            this.elementHTML.classList.remove('drwal--ciecie');
        }, 50);
    }

    reset() {
        this.elementHTML.classList.remove('drwal--prawa', 'drwal--smierc');
        this.elementHTML.classList.add('drwal--lewa');
    }
}

