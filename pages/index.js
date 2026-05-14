import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const PROPERTIES = [
  // ── BUDAPEST LAKÁSOK ──────────────────────────────────────
  {
    id: 1,
    cim: "Pozsonyi út 14., V. emelet",
    kerulet: "XIII. kerület, Újlipótváros",
    ar: "96 500 000 Ft",
    tipus: "lakás",
    alapterulet: 74,
    szobak: 3,
    emelet: "5/7",
    tajolas: "dél-nyugat",
    allapot: "felújított",
    leiras: "Tágas, világos háromszobás lakás a Pozsonyi úton. Déli tájolásnak köszönhetően egész nap süt be a nap. A Duna-part és a Margit-sziget gyalogosan elérhető. Teljesen felújított, új konyhabútor, parketta, klíma. Csendes belső utca, mégis minden közel: piac, iskola, bolt. Kisállat hozható. Parkolási lehetőség a környéken. Kiváló közlekedés: villamos, busz, metró közelben.",
    tags: ["napfényes","csendes","kisállat ok","felújított","Duna-közel"],
  },
  {
    id: 2,
    cim: "Ráday utca 8., II. emelet",
    kerulet: "IX. kerület, Ferencváros",
    ar: "78 900 000 Ft",
    tipus: "lakás",
    alapterulet: 62,
    szobak: 2,
    emelet: "2/4",
    tajolas: "észak-kelet",
    allapot: "jó állapotú",
    leiras: "Hangulatos kétszobás lakás a Ráday utcában, a város legsűrűbben teli kávézós-éttermes negyedében. Belmagasság 3,2 méter, eredeti stukkók. Home office-hoz ideális: gyors net, elkülönített dolgozószoba. Tömegközlekedés előtt az ajtó. Erkély az udvarra néz. Bolt, gyógyszertár, könyvtár sétatávolságra.",
    tags: ["home office","belváros","magas belmagasság","erkély","étterem-negyed"],
  },
  {
    id: 3,
    cim: "Thököly út 67., fsz.",
    kerulet: "XIV. kerület, Zugló",
    ar: "54 200 000 Ft",
    tipus: "lakás",
    alapterulet: 68,
    szobak: 2,
    emelet: "fsz./4",
    tajolas: "dél",
    allapot: "felújítandó",
    leiras: "Kertes, földszinti lakás Zuglóban - ritka lehetőség! Az 50 m²-es, kizárólagos használatú kert gyerekeknek és állatoknak ideális. Déli tájolású, sok fény. Felújítandó állapot, de a szerkezet kiváló. A Városliget gyalogosan 12 percre. Iskola, óvoda, bolt mind 500 méteren belül. Kisgyermekes vagy állatos egyéneknek ajánljuk.",
    tags: ["kert","gyerekbarát","kisállat ok","csendes","felújítandó","déli tájolás"],
  },
  {
    id: 4,
    cim: "Hajós utca 22., IV. emelet",
    kerulet: "VI. kerület, Terézváros",
    ar: "119 000 000 Ft",
    tipus: "lakás",
    alapterulet: 88,
    szobak: 3,
    emelet: "4/5",
    tajolas: "dél-kelet",
    allapot: "felújított",
    leiras: "Tágas háromszobás lakás a belvárosi Hajós utcában. Teljesen felújítva 2022-ben: új villany, gép, klíma, parketta. Két fürdőszoba, nagy nappali, különálló dolgozószoba. Az Andrássy út és az Opera sétatávolságra. Kulturális élet, éttermek, coworking helyek mind közvetlen közelben.",
    tags: ["belváros","befektetés","opera-negyed","felújított","két fürdő","coworking-közel"],
  },
  {
    id: 5,
    cim: "Gyár utca 17., III. emelet",
    kerulet: "VIII. kerület, Józsefváros",
    ar: "39 800 000 Ft",
    tipus: "lakás",
    alapterulet: 55,
    szobak: 2,
    emelet: "3/4",
    tajolas: "nyugat",
    allapot: "közepes",
    leiras: "Ára alapján az egyik legjobb ajánlat Budapest belső kerületeiben. Kétszobás, közepes állapotú lakás a fejlődő Józsefvárosban. Nem igényel azonnali felújítást, belköltözhető. Befektetőknek is érdemes megvizsgálni: a kerület értéke folyamatosan nő. Tömegközlekedés előtt.",
    tags: ["olcsó","belső kerület","befektetés","közel tömegközlekedés"],
  },
  {
    id: 6,
    cim: "Bartók Béla út 43., I. emelet",
    kerulet: "XI. kerület, Újbuda",
    ar: "87 500 000 Ft",
    tipus: "lakás",
    alapterulet: 71,
    szobak: 3,
    emelet: "1/4",
    tajolas: "dél",
    allapot: "felújított",
    leiras: "Felújított háromszobás lakás az újbudai Bartók Béla úton. Déli tájolású, egész nap napos. Új konyha, fürdőszoba, padló. Erkély az utcára néz. A 4-es metró Móricz Zsigmond körtér állomása 5 perc séta. Parkolás az utcán megoldható. Iskolák, óvoda, bevásárlóközpont közvetlen közelben. Kisgyermekes családoknak is ideális elhelyezkedés.",
    tags: ["napfényes","felújított","erkély","metróközel","családbarát"],
  },
  {
    id: 7,
    cim: "Váci út 112., VIII. emelet",
    kerulet: "XIII. kerület, Angyalföld",
    ar: "68 000 000 Ft",
    tipus: "lakás",
    alapterulet: 52,
    szobak: 2,
    emelet: "8/10",
    tajolas: "észak-kelet",
    allapot: "jó állapotú",
    leiras: "Panorámás kétszobás lakás a Váci úton, magas emeleten. Szép kilátás a városra. Liftes ház, portaszolgálat. Metró és villamos megálló 3 percre. Bevásárlóközpont az épület közelében. Home office-hoz alkalmas, gyors internet elérhető. Mélygarázs bérlése lehetséges. Befektetésként is kiváló, könnyen kiadható.",
    tags: ["panoráma","portaszolgálat","lift","metróközel","befektetés","home office"],
  },
  {
    id: 8,
    cim: "Kossuth Lajos utca 5., III. emelet",
    kerulet: "V. kerület, Belváros",
    ar: "145 000 000 Ft",
    tipus: "lakás",
    alapterulet: 95,
    szobak: 3,
    emelet: "3/5",
    tajolas: "dél",
    allapot: "felújított",
    leiras: "Elegáns háromszobás lakás Budapest szívében, a Kossuth Lajos utcában. Magas belmagasság, eredeti stukkók, parketta. Teljesen felújítva, prémium anyaghasználattal. A Deák tér és a Vörösmarty tér sétatávolságra. Airbnb célra engedélyezett, kiváló hozammal. Kulturális élet, éttermek, kávézók mind előtt az ajtón.",
    tags: ["belváros","airbnb","befektetés","magas belmagasság","stukkó","felújított"],
  },
  // ── BUDAPEST KERTES HÁZAK ────────────────────────────────
  {
    id: 9,
    cim: "Virág utca 12.",
    kerulet: "XVI. kerület, Mátyásföld",
    ar: "89 900 000 Ft",
    tipus: "kertes ház",
    alapterulet: 120,
    szobak: 4,
    emelet: "földszint + tetőtér",
    tajolas: "dél",
    allapot: "jó állapotú",
    leiras: "Tágas családi ház Mátyásföldön, 600 m²-es gondozott kerttel. Négy szoba, két fürdőszoba, garázs. Déli tájolású terasz a kerttel szemben. Csendes, zöld utca, mégis közel a városhoz. Iskola, óvoda, bolt mind 5 percen belül. HÉV megálló 8 percre gyalog. Kutyásoknak és gyermekes családoknak ideális. Az épület jó állapotban van, minimális felújítást igényel.",
    tags: ["kert","garázs","csendes","gyerekbarát","kisállat ok","HÉV-közel","4 szoba"],
  },
  {
    id: 10,
    cim: "Rózsa utca 34.",
    kerulet: "XVII. kerület, Rákosmente",
    ar: "62 500 000 Ft",
    tipus: "kertes ház",
    alapterulet: 95,
    szobak: 3,
    emelet: "földszint",
    tajolas: "dél-nyugat",
    allapot: "felújítandó",
    leiras: "Felújítandó családi ház Rákosmentén, 450 m²-es telken. Három szoba, garázs, pince. A szerkezet kiváló állapotban van, belső felújítást igényel. Nagy kert, gyümölcsfákkal. Csendes lakóterület, közeli bolt, iskola. Busz megálló 5 percre. Aki saját ízlése szerint szeretné kialakítani otthonát, annak ideális. Ára alapján kivételes lehetőség.",
    tags: ["kert","garázs","felújítandó","olcsó","csendes","gyümölcsös"],
  },
  {
    id: 11,
    cim: "Határ út 78.",
    kerulet: "XX. kerület, Pesterzsébet",
    ar: "47 900 000 Ft",
    tipus: "kertes ház",
    alapterulet: 80,
    szobak: 3,
    emelet: "földszint",
    tajolas: "kelet",
    allapot: "közepes",
    leiras: "Belköltözhető kis családi ház Pesterzsébeten, 320 m²-es kerttel. Három szoba, felszerelt konyha, fürdőszoba. A kert gondozott, kis terasz, kerti tároló. Busz és villamos megálló 3 percre. Bevásárlóközpont közelben. Kisgyermekes vagy állatokat tartó családoknak kiváló ár-érték arány.",
    tags: ["kert","belköltözhető","olcsó","kisállat ok","gyerekbarát","terasz"],
  },
  // ── BUDAPEST IKERHÁZAK ───────────────────────────────────
  {
    id: 12,
    cim: "Liliom köz 6/A",
    kerulet: "XV. kerület, Rákospalota",
    ar: "79 000 000 Ft",
    tipus: "ikerház",
    alapterulet: 110,
    szobak: 4,
    emelet: "földszint + emelet",
    tajolas: "dél",
    allapot: "újépítésű",
    leiras: "Újépítésű ikerház fele Rákospalotán, 250 m²-es saját kerttel. Négy szoba, két fürdőszoba, garázs. Modern, energiatakarékos kivitelezés: hőszivattyú, padlófűtés, napelem előkészítés. Déli terasz, tágas nappali. Csendes utca, iskola és óvoda közelben. HÉV megálló 10 percre. Azonnal beköltözhető. A szomszéd félben is azonos adottságú ingatlan elérhető.",
    tags: ["újépítésű","kert","garázs","padlófűtés","hőszivattyú","csendes","energiatakarékos"],
  },
  {
    id: 13,
    cim: "Diófa utca 23/B",
    kerulet: "XVIII. kerület, Pestszentlőrinc",
    ar: "68 500 000 Ft",
    tipus: "ikerház",
    alapterulet: 98,
    szobak: 3,
    emelet: "földszint + tetőtér",
    tajolas: "dél-kelet",
    allapot: "felújított",
    leiras: "Felújított ikerház fele Pestszentlőrincen, 200 m²-es gondozott kerttel. Három szoba, tágas nappali, két fürdőszoba. A tetőtéren extra dolgozószoba kialakítva - home office-hoz tökéletes. Garázs és tárolóhelyiség. Csendes, fás utca. Busz megálló 4 percre, Ferihegy 15 percre autóval. Kisgyermekes és home office-t igénylő családoknak egyaránt ajánlott.",
    tags: ["kert","garázs","home office","felújított","csendes","tetőtér"],
  },
  {
    id: 14,
    cim: "Körte utca 11/A",
    kerulet: "XIX. kerület, Kispest",
    ar: "52 000 000 Ft",
    tipus: "ikerház",
    alapterulet: 85,
    szobak: 3,
    emelet: "földszint",
    tajolas: "nyugat",
    allapot: "felújítandó",
    leiras: "Felújítandó ikerház fele Kispesten, 180 m²-es kerttel. Három szoba, garázs, pince. A szerkezet rendben van, belső megújítást igényel. Csendes mellékutca, de busz és metró elérhető közelségben. Jó befektetési lehetőség: a felújítás után jelentős értéknövekedéssel lehet számolni. Állatbarát környék.",
    tags: ["kert","garázs","felújítandó","befektetés","olcsó","kisállat ok"],
  },
  // ── PEST MEGYE KERTES HÁZAK ─────────────────────────────
  {
    id: 15,
    cim: "Petőfi utca 45.",
    kerulet: "Érd, Érd-Parkváros",
    ar: "74 900 000 Ft",
    tipus: "kertes ház",
    alapterulet: 130,
    szobak: 4,
    emelet: "földszint + emelet",
    tajolas: "dél",
    allapot: "jó állapotú",
    leiras: "Tágas kétszintes családi ház Érd legkedveltebb részén, Parkvárosban. 400 m²-es gondozott kert, garázs, két fürdőszoba. Nagy terasz, pergola. Déli tájolású kert, egész nap napos. Iskola, óvoda, orvosi rendelő, bolt 5 percen belül. Érd-Pfeiffer HÉV megálló 8 percre - Budapestre 35 perc. Csendes lakóterület, jó szomszédsággal.",
    tags: ["kert","garázs","csendes","déli tájolás","HÉV-közel","4 szoba","terasz"],
  },
  {
    id: 16,
    cim: "Ady Endre utca 12.",
    kerulet: "Budaörs, Frankhegy",
    ar: "138 000 000 Ft",
    tipus: "kertes ház",
    alapterulet: 160,
    szobak: 5,
    emelet: "földszint + emelet",
    tajolas: "dél-nyugat",
    allapot: "felújított",
    leiras: "Prémium családi ház Budaörs legzöldebb negyedében, Frankhegyen. Öt szoba, három fürdőszoba, garázs kettő autónak. 600 m²-es, gondozott kert medencével. Klíma, okosotthon rendszer, napelem. Panoráma a budai hegyekre. Csendes, prémium lakókörnyezet. Budapest M1 autópályán 15 perc. Iskolák, óvodák, bevásárlás közvetlen közelben Budaörsön.",
    tags: ["kert","medence","garázs","panoráma","napelem","okosotthon","prémium","5 szoba"],
  },
  {
    id: 17,
    cim: "Fő utca 67.",
    kerulet: "Szigetszentmiklós, Lakihegy",
    ar: "58 500 000 Ft",
    tipus: "kertes ház",
    alapterulet: 105,
    szobak: 3,
    emelet: "földszint",
    tajolas: "dél",
    allapot: "jó állapotú",
    leiras: "Szép állapotú, egyszintes családi ház Szigetszentmiklóson, 500 m²-es telken. Három szoba, fürdőszoba, garázs, pince. Nagy kert gyümölcsfákkal és teraszos résszel. Csendes, rendezett utca. Iskola, óvoda, bolt gyalog elérhető. Budapest M0 autópályán 10 perc, HÉV megálló közelben. Kisgyermekes és állatos famíliáknak ajánlott.",
    tags: ["kert","garázs","csendes","gyümölcsös","gyerekbarát","kisállat ok","HÉV-közel"],
  },
  {
    id: 18,
    cim: "Kossuth utca 23.",
    kerulet: "Dunakeszi, Alag",
    ar: "82 000 000 Ft",
    tipus: "kertes ház",
    alapterulet: 125,
    szobak: 4,
    emelet: "földszint + tetőtér",
    tajolas: "dél",
    allapot: "felújított",
    leiras: "Gondosan felújított kétszintes ház Dunakeszin, az Alagjárás közelében. 350 m²-es rendezett kert, garázs, tároló. Négy szoba, két fürdőszoba, tágas nappali. Új tető, nyílászárók, fűtés. HÉV megálló gyalogosan 6 percre - Budapest Nyugati 30 perc. Iskola, óvoda, bevásárlás közelben. Kutyásoknak, gyermekes családoknak ideális.",
    tags: ["kert","garázs","felújított","HÉV-közel","csendes","kisállat ok","4 szoba"],
  },
  {
    id: 19,
    cim: "Rákóczi utca 88.",
    kerulet: "Vecsés, Belváros",
    ar: "43 500 000 Ft",
    tipus: "kertes ház",
    alapterulet: 90,
    szobak: 3,
    emelet: "földszint",
    tajolas: "kelet",
    allapot: "felújítandó",
    leiras: "Felújítandó kis ház Vecsésen, 400 m²-es telken, garázzsal. Három szoba, fürdőszoba, pince. A szerkezet rendben, belső megújítást igényel. Nagy kert, gyümölcsfák. Ferihegyi repülőtér 5 percre - reptér mellett dolgozóknak ideális. Busz és vasút elérhető közelségben. Jó ár-érték arány, befektetési célra is alkalmas.",
    tags: ["kert","garázs","felújítandó","olcsó","repülőtér-közel","befektetés","gyümölcsös"],
  },
  {
    id: 20,
    cim: "Bartók Béla utca 5.",
    kerulet: "Göd, Strand",
    ar: "67 000 000 Ft",
    tipus: "kertes ház",
    alapterulet: 115,
    szobak: 4,
    emelet: "földszint + emelet",
    tajolas: "dél-kelet",
    allapot: "jó állapotú",
    leiras: "Kellemes kétszintes ház Gödön, a Duna-parttól 5 percre. 450 m²-es, gondozott kert. Négy szoba, két fürdőszoba, garázs. Napelem, korszerű fűtés. A Gödi strand és a Duna-part sétatávolságra - nyaralóként és főlakásként is kiváló. HÉV megálló 7 percre, Budapest Nyugati 40 perc. Csendes, kellemes szomszédság.",
    tags: ["kert","Duna-közel","napelem","garázs","strand-közel","HÉV-közel","4 szoba"],
  },
  // ── PEST MEGYE IKERHÁZAK ────────────────────────────────
  {
    id: 21,
    cim: "Tulipán utca 14/A",
    kerulet: "Gyál, Újtelep",
    ar: "49 900 000 Ft",
    tipus: "ikerház",
    alapterulet: 92,
    szobak: 3,
    emelet: "földszint + emelet",
    tajolas: "dél",
    allapot: "újépítésű",
    leiras: "Újépítésű ikerház fele Gyálon, 200 m²-es saját kerttel. Három szoba, két fürdőszoba, garázs. Padlófűtés, hőszivattyú, A+ energiaosztály. Modern kialakítás, azonnal beköltözhető. Iskola, óvoda, bolt gyalog elérhető. Budapest M0 autópályán 10 perc. Ferihegy 15 perc. Kisgyermekes és állatokat tartó családoknak ideális.",
    tags: ["újépítésű","kert","garázs","padlófűtés","energiatakarékos","belköltözhető","csendes"],
  },
  {
    id: 22,
    cim: "Akác utca 8/B",
    kerulet: "Törökbálint, Torbágy",
    ar: "93 500 000 Ft",
    tipus: "ikerház",
    alapterulet: 135,
    szobak: 4,
    emelet: "földszint + emelet",
    tajolas: "dél-nyugat",
    allapot: "újépítésű",
    leiras: "Prémium újépítésű ikerház fele Törökbálinton, 280 m²-es kerttel. Négy szoba, három fürdőszoba, garázs kettő autónak. Okosotthon rendszer, napelem, padlófűtés az egész házban. Tágas terasz, fedett pergola. Zöld, csendes környezet, kitűnő levegő. M1 autópálya 5 percre - Budapest 20 perc. Prémium kivitelezés, kiváló minőség.",
    tags: ["újépítésű","kert","kétállásos garázs","napelem","okosotthon","padlófűtés","prémium"],
  },
  {
    id: 23,
    cim: "Móricz Zsigmond utca 31/A",
    kerulet: "Fót, Centrum",
    ar: "61 000 000 Ft",
    tipus: "ikerház",
    alapterulet: 100,
    szobak: 3,
    emelet: "földszint + tetőtér",
    tajolas: "dél",
    allapot: "felújított",
    leiras: "Felújított ikerház fele Fóton, 220 m²-es saját kerttel és garázzsal. Három szoba, két fürdőszoba, tetőtéri dolgozó. Új tető, nyílászárók, konyha, fürdőszoba. Csendes, fás utca. Iskola, óvoda, bolt közelben. Vasútállomás 10 percre - Budapest Keleti 35 perc. Kutyásoknak, gyermekes családoknak kiváló választás.",
    tags: ["kert","garázs","felújított","csendes","kisállat ok","vasútközel","home office"],
  },
  {
    id: 24,
    cim: "Hunyadi utca 5/B",
    kerulet: "Üllő, Belváros",
    ar: "44 000 000 Ft",
    tipus: "ikerház",
    alapterulet: 88,
    szobak: 3,
    emelet: "földszint",
    tajolas: "kelet",
    allapot: "közepes",
    leiras: "Belköltözhető ikerház fele Üllőn, 180 m²-es kerttel. Három szoba, fürdőszoba, garázs. Közepes állapot, kisebb festési munkálatokat igényel. Nagy kert, gyümölcsfák. Ferihegy repülőtér 10 percre - reptér melletti munkakörben dolgozóknak tökéletes. Busz és vasút elérhető közelségben. Ára alapján kivételes lehetőség.",
    tags: ["kert","garázs","belköltözhető","olcsó","repülőtér-közel","gyümölcsös"],
  },
  {
    id: 25,
    cim: "Szabadság tér 2/A",
    kerulet: "Gödöllő, Belváros",
    ar: "72 500 000 Ft",
    tipus: "ikerház",
    alapterulet: 118,
    szobak: 4,
    emelet: "földszint + emelet",
    tajolas: "dél",
    allapot: "jó állapotú",
    leiras: "Szép állapotú ikerház fele Gödöllő belvárosában, a kastély közelében. 250 m²-es gondozott kerttel, garázzsal. Négy szoba, két fürdőszoba, tágas nappali. Déli terasz, pergola. Gödöllő kulturális élete, éttermei, piaca sétatávolságra. HÉV megálló 8 percre - Budapest Keleti 45 perc. Kiváló levegő, természetközeliség.",
    tags: ["kert","garázs","kastély-közel","HÉV-közel","csendes","déli tájolás","4 szoba"],
  },
];

const IRODA_ID = 'demo';

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function PropCard({ prop, match, isTop }) {
  return (
    <div style={{
      background: '#fff',
      border: isTop ? '1.5px solid rgba(201,150,58,0.5)' : '0.5px solid rgba(28,43,58,0.12)',
      borderRadius: 12,
      padding: '12px 14px',
      marginTop: 6,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1C2B3A' }}>{prop.cim}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#C9963A', whiteSpace: 'nowrap' }}>{prop.ar}</div>
      </div>
      {isTop && (
        <div style={{
          display: 'inline-block', marginBottom: 4,
          fontSize: 10, fontWeight: 500,
          background: '#f5ead8', color: '#7a4e10',
          padding: '2px 8px', borderRadius: 20,
          border: '0.5px solid rgba(201,150,58,0.3)'
        }}>⭐ Legjobb találat</div>
      )}
      <div style={{ fontSize: 11.5, color: '#5a6b7a', marginBottom: 6 }}>
        {prop.kerulet} · {prop.alapterulet} m² · {prop.szobak} szoba · {prop.emelet}. em. · {prop.tajolas}
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
        {(match.egyezesek || []).map((e, i) => (
          <span key={i} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: '#e8f5e9', color: '#2e7d32', border: '0.5px solid #a5d6a7' }}>✓ {e}</span>
        ))}
        {(match.elteresek || []).map((e, i) => (
          <span key={i} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: '#fff8e1', color: '#e65100', border: '0.5px solid #ffcc80' }}>⚠ {e}</span>
        ))}
      </div>
      {match.ai_megjegyzes && (
        <div style={{ fontSize: 12, color: '#2e4a63', background: '#e8eff6', borderRadius: 7, padding: '7px 10px', lineHeight: 1.5, borderLeft: '2px solid #2e4a63' }}>
          {match.ai_megjegyzes}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [lastProperty, setLastProperty] = useState(null);
  const [dbProperties, setDbProperties] = useState(null);

  useEffect(() => {
    if (IRODA_ID !== 'demo') {
      fetch('/api/get-iroda-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iroda_id: IRODA_ID, tabla: 'ingatlanok' })
      })
      .then(r => r.json())
      .then(json => { if (json.data?.length > 0) setDbProperties(json.data); })
      .catch(() => {});
    }
  }, []);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeProperties = dbProperties || PROPERTIES;
  const dbJson = JSON.stringify(activeProperties.map(p => ({
    id: p.id, cim: p.cim, kerulet: p.kerulet, ar: p.ar,
    alapterulet: p.alapterulet + ' m²', szobak: p.szobak,
    emelet: p.emelet, tajolas: p.tajolas, allapot: p.allapot,
    leiras: p.leiras, tags: p.tags.join(', ')
  })), null, 2);

  const systemPrompt = `Te ennek az ingatlanirodiának a kizárólagos AI asszisztense vagy. Kizárólag az iroda érdekében dolgozol.
${leadCaptured ? 'FONTOS: Ez az érdeklődő már megadta az elérhetőségét. Kollégánk fel fogja hívni. NE kérd el újra az elérhetőségét, NE állítsd a lead_capture mezőt TRUE-ra.' : ''}
Az alábbi ingatlan-adatbázissal dolgozol:

${dbJson}

FELADATOD:
1. Értsd meg a felhasználó szándékát természetes, szabadszavas leírásból.
2. Keresd végig az összes ingatlan LEÍRÁSÁBAN, TAGJEIN és ADATAIN.
3. Adj vissza 1-3 legjobban illeszkedő ingatlant, magyarázd el MIÉRT illenek.
4. Ha valamit a felhasználó tévesen feltételez, finoman javítsd ki.
5. Ha nincs tökéletes találat, ajánlj alternatívát a saját kínálatból.
6. Vedd figyelembe az élethelyzetet (gyerek, állat, home office, befektetés stb.).

SZIGORÚ SZABÁLYOK - EZEKET SOHA NE SZEGD MEG:
- SOHA ne ajánlj más irodát, portált vagy versenytársat (Otthon Centrum, Century21, Duna House, ingatlan.com, stb.)
- SOHA ne mondd hogy "keress fel más irodát" vagy "nézz más portálon"
- Ha valaki meg akar nézni egy ingatlant, mindig azt mondd: "Kollégánk szívesen egyeztet időpontot - hagyja meg elérhetőségét!"
- Ha nincs megfelelő ingatlan a kínálatban, mondd: "Jelenleg nincs ilyen a kínálatunkban, de kollégánk tud segíteni - hagyja meg elérhetőségét!"
- Te ennek az irodának dolgozol - az érdeklődőt mindig az iroda felé tereld

VÁLASZ FORMÁTUM (csak JSON, semmi más, nincs markdown keret):
{
  "bevezeto": "rövid, empatikus bevezető (1-2 mondat)",
  "talalatok": [
    {
      "id": 1,
      "egyezesek": ["miben illik"],
      "elteresek": ["miben tér el"],
      "ai_megjegyzes": "személyes megjegyzés"
    }
  ],
  "alternativa": "alternatíva szöveg vagy null",
  "zaro": "rövid záró üzenet",
  "lead_capture": false
}

A "lead_capture" mezőt állítsd TRUE-ra ha MIND a három teljesül:
1. Ez legalább a 4. üzenetváltás
2. A felhasználó konkrét ingatlanról kérdez részleteket (mikor nézhető meg, mekkora a telek, mi az ár, stb.)
3. Egyértelmu vásárlási szándék látszik (megnézné, érdekli, ajánlatot tenne)
Ha TRUE, a "zaro" mezőbe NE írj lead capture felkérést - azt a rendszer automatikusan kezeli.
SOHA ne kérj nevet, telefonszámot, emailt vagy elérhetőséget a szövegben - ezt a rendszer automatikusan kezeli.
SOHA ne ajánlj megtekintést, időpontot vagy visszahívást szövegesen - sem a "zaro" mezőben, sem a "bevezeto"-ban, sem az "ai_megjegyzes"-ben. Ez TILOS.
Az első 4 üzenetváltásban csak kérdezz, segíts, ajánlj ingatlanokat. Ha a látogató érdeklődik, kérdezz vissza: "Mit tart a legfontosabbnak?" vagy "Van más elvárása?" - ne siess a megtekintéssel.

FONTOS SZABÁLYOK:
- Csak a fenti adatbázisban szereplő ingatlanok ID-jait használd (1-25).
- MINDIG keresd végig AZ ÖSSZES ingatlant - beleértve a Pest megyei városokat is (Érd, Budaörs, Szigetszentmiklós, Dunakeszi, Vecsés, Göd, Gyál, Törökbálint, Fót, Üllő, Gödöllő).
- Ha valaki Pest megyét, agglomerációt vagy konkrét várost kér, nézd meg a "kerulet" mezőt minden ingatlannál.
- Ha nincs pontos egyezés, ajánlj hasonlót és magyarázd el miért.

NYELV - KÖTELEZŐ SZABÁLY:
Mindig azon a nyelven válaszolj amin a felhasználó ír. Ha magyarul kérdez → magyarul. Ha angolul → angolul. Ha franciául → franciául. Ha arabul → arabul. Bármilyen nyelven → azon a nyelven. SOHA ne kérd hogy más nyelven írjon.
A JSON mezők nevei mindig magyarul maradjanak.

MAGYAR NYELVHELYESSÉG - NAGYON FONTOS:
- Helyes igekötő-használat: "Végignéztem" (NEM: "Néztem végig"), "Megtaláltam" (NEM: "Találtam meg"), "Kiválasztottam" (NEM: "Választottam ki")
- Természetes, folyékony magyar mondatok - SOHA ne fordíts angolból szóról szóra
- Kerüld: "Az Ön által keresett", "A következő ingatlanokat találtam", "minden szín és íz", "megbízod rá"
- Használj természetes fordulatokat: "Végignéztem a kínálatunkat", "Úgy látom", "Szerintem ez lehet a jó választás"
- Konkrét példák a HELYES fogalmazásra:
  ROSSZ: "megbízod rá az elérhetőségedet" → JÓ: "megadod az elérhetőségedet"
  ROSSZ: "ott garantáltan van minden szín és íz" → JÓ: "ott garantáltan van mindenféle étterem és kávézó"
  ROSSZ: "Ha ezt jobban szeretnéd, azt is megnézhetnéd" → JÓ: "Ha ez jobban illik, ezt is érdemes megnézni"
  ROSSZ: "Akarod hagyni az elérhetőséged?" → NE ÍRD - ezt a rendszer kezeli automatikusan
- Olyan legyen a hangnem mintha egy tapasztalt magyar ingatlanközvetítő mondaná élőben
- SOHA ne kérj elérhetőséget, nevet, telefonszámot a szövegben - azt a rendszer kezeli
- Rövid, érthető mondatok - ne tömj bele mindent egy mondatba`;

  async function send(text) {
    if (!text.trim() || busy) return;
    setShowSuggestions(false);
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBusy(true);

    const newHistory = [...history, { role: 'user', content: text }];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          iroda_id: IRODA_ID,
          model: 'claude-sonnet-4-6',
          max_tokens: 2000,
          system: systemPrompt,
          messages: newHistory
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'API hiba');

      const rawText = (data.content || []).map(c => c.text || '').join('');
      
      let result;
      try {
        const clean = rawText.replace(/```json|```/g, '').trim();
        result = JSON.parse(clean);
      } catch(parseErr) {
        try {
          const m = rawText.indexOf('{');
          const n = rawText.lastIndexOf('}');
          if (m !== -1 && n !== -1) {
            result = JSON.parse(rawText.slice(m, n + 1));
          } else {
            result = { bevezeto: rawText, talalatok: [], alternativa: null, zaro: null };
          }
        } catch(e2) {
          result = { bevezeto: rawText, talalatok: [], alternativa: null, zaro: null };
        }
      }

      const newTurn = turnCount + 1;
      setTurnCount(newTurn);
      setHistory([...newHistory, { role: 'assistant', content: rawText }]);
      setMessages(prev => [...prev, { role: 'ai', result }]);
      // Track last viewed property
      if (result.talalatok && result.talalatok.length > 0) {
        const prop = activeProperties.find(p => p.id === result.talalatok[0].id);
        if (prop) setLastProperty(prop);
      }
      
      // Show lead form if AI signals it and not already captured
      if (result.lead_capture && !leadCaptured && newTurn >= 4) {
        setTimeout(() => setShowLeadForm(true), 800);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', error: err.message }]);
    }
    setBusy(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  const suggestions = [
    'Kisgyermekes család vagyunk, kert kellene',
    'Home office-hoz keresek lakást',
    'Befektetésnek keresek olcsóbbat',
    'Dunára néző, teraszos lakás'
  ];

  return (
    <>
      <Head>
        <title>IngatlanAI – Szabadszavas Kereső</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#f0f3f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ width: '100%', maxWidth: 680 }}>

          {/* Header label */}
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#96a7b5', marginBottom: 12, paddingLeft: 4 }}>
            Beágyazható widget - ingatlaniroda honlapjára
          </div>

          {/* Chat widget */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 40px rgba(28,43,58,0.12), 0 2px 8px rgba(28,43,58,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: 680,
            border: '0.5px solid rgba(28,43,58,0.18)'
          }}>

            {/* Header */}
            <div style={{ background: '#1C2B3A', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(201,150,58,0.18)', border: '0.5px solid rgba(201,150,58,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏠</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: '#fff', letterSpacing: -0.3 }}>IngatlanAI</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Írja le szabadon, mit keres - mindent megértünk</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 2px rgba(74,222,128,0.25)' }}></div>
                Online
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Welcome */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1C2B3A', color: '#C9963A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: "'DM Serif Display', serif", flexShrink: 0 }}>AI</div>
                <div style={{ maxWidth: '80%' }}>
                  <div style={{ background: '#f7f8fa', border: '0.5px solid rgba(28,43,58,0.10)', borderRadius: '4px 18px 18px 18px', padding: '11px 15px', fontSize: 14, lineHeight: 1.6, color: '#1C2B3A' }}>
                    Üdvözlöm! Írja le szabadon, milyen ingatlant keres. Nem kell formanyomtatvány - meséljen az igényeiről természetesen.
                  </div>
                </div>
              </div>

              {/* Messages */}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'user' ? '#C9963A' : '#1C2B3A',
                    color: msg.role === 'user' ? '#fff' : '#C9963A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: msg.role === 'user' ? 12 : 13,
                    fontFamily: msg.role === 'ai' ? "'DM Serif Display', serif" : 'inherit'
                  }}>
                    {msg.role === 'user' ? '👤' : 'AI'}
                  </div>
                  <div style={{ maxWidth: '82%' }}>
                    {msg.role === 'user' ? (
                      <div style={{ background: '#1C2B3A', color: '#fff', borderRadius: '18px 4px 18px 18px', padding: '11px 15px', fontSize: 14, lineHeight: 1.6 }}>
                        {msg.text}
                      </div>
                    ) : msg.error ? (
                      <div style={{ background: '#fff3f3', border: '0.5px solid #ffcccc', borderRadius: '4px 18px 18px 18px', padding: '11px 15px', fontSize: 13, color: '#c0392b' }}>
                        Hiba: {msg.error}
                      </div>
                    ) : (
                      <div style={{ background: '#f7f8fa', border: '0.5px solid rgba(28,43,58,0.10)', borderRadius: '4px 18px 18px 18px', padding: '12px 15px', fontSize: 14, lineHeight: 1.6, color: '#1C2B3A' }}>
                        {msg.result.bevezeto && <p style={{ marginBottom: 8 }}>{msg.result.bevezeto}</p>}
                        {(msg.result.talalatok || []).map((t, ti) => {
                          const prop = activeProperties.find(p => p.id === t.id);
                          if (!prop) return null;
                          return <PropCard key={ti} prop={prop} match={t} isTop={ti === 0} />;
                        })}
                        {msg.result.alternativa && (
                          <div style={{ marginTop: 10, background: '#e8eff6', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#2e4a63', lineHeight: 1.5 }}>
                            💡 {msg.result.alternativa}
                          </div>
                        )}
                        {msg.result.zaro && (
                          <p style={{ marginTop: 10, fontSize: 12.5, color: '#5a6b7a' }}>{msg.result.zaro}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {busy && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1C2B3A', color: '#C9963A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: "'DM Serif Display', serif", flexShrink: 0 }}>AI</div>
                  <div style={{ background: '#f7f8fa', border: '0.5px solid rgba(28,43,58,0.10)', borderRadius: '4px 18px 18px 18px', padding: '13px 16px', display: 'flex', gap: 5 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#96a7b5', animation: `blink 1.3s ${i * 0.18}s infinite` }}></div>
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div style={{ padding: '8px 20px 0', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => send(s)} style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 20,
                    border: '0.5px solid rgba(28,43,58,0.18)', background: '#fff',
                    color: '#5a6b7a', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all .15s'
                  }}>{s}</button>
                ))}
              </div>
            )}

            {/* Lead capture form */}
            {showLeadForm && !leadCaptured && (
              <div style={{
                margin: '0 16px 12px', padding: '16px',
                background: 'linear-gradient(135deg, #1C2B3A 0%, #2e4a63 100%)',
                borderRadius: 12, flexShrink: 0
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#C9963A', marginBottom: 4 }}>
                  Szeretné személyesen is megnézni?
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 12, lineHeight: 1.5 }}>
                  Hagyja meg az adatait — kollégánk 24 órán belül felveszi a kapcsolatot!
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    placeholder="Neve"
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif", outline: 'none'
                    }}
                  />
                  <input
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    placeholder="Telefonszáma"
                    style={{
                      flex: 1, padding: '8px 12px', borderRadius: 8, border: '0.5px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif", outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={async () => {
                      if (!leadName.trim() || !leadPhone.trim()) return;
                      // Save lead to Supabase via API
                      await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          iroda_id: IRODA_ID,
                          lead: { nev: leadName, telefon: leadPhone },
                          model: 'claude-sonnet-4-6',
                          max_tokens: 10,
                          system: 'Csak annyit mondj: ok',
                          messages: [{ role: 'user', content: 'lead mentve' }]
                        })
                      }).catch(() => {});
                      // Send email notification
                      await fetch('/api/send-lead-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          nev: leadName,
                          telefon: leadPhone,
                          iroda_email: 'lenard.csaba74@gmail.com',
                          iroda_nev: 'Demo Iroda',
                          ingatlan: lastProperty ? lastProperty.cim + ' — ' + lastProperty.ar : null
                        })
                      }).catch(() => {});
                      setLeadCaptured(true);
                      setShowLeadForm(false);
                      setMessages(prev => [...prev, {
                        role: 'ai',
                        result: {
                          bevezeto: 'Köszönöm! Kollégánk hamarosan felveszi a kapcsolatot. Addig is szívesen válaszolok további kérdésekre!',
                          talalatok: [], alternativa: null, zaro: null, lead_capture: false
                        }
                      }]);
                    }}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 8, border: 'none',
                      background: '#C9963A', color: '#fff', fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                    }}
                  >
                    Visszahívást kérek
                  </button>
                  <button
                    onClick={() => setShowLeadForm(false)}
                    style={{
                      padding: '9px 14px', borderRadius: 8,
                      border: '0.5px solid rgba(255,255,255,0.2)',
                      background: 'transparent', color: 'rgba(255,255,255,0.5)',
                      fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                    }}
                  >
                    Később
                  </button>
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 8, textAlign: 'center' }}>
                  Adatait bizalmasan kezeljük, harmadik félnek nem adjuk át.
                </div>
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '0.5px solid rgba(28,43,58,0.10)', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
              <div style={{ flex: 1, background: '#f7f8fa', border: '0.5px solid rgba(28,43,58,0.18)', borderRadius: 24, padding: '10px 16px', display: 'flex', alignItems: 'flex-end' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'; }}
                  onKeyDown={handleKey}
                  placeholder="Pl. csendes utca, 2 gyereknek is elférünk, kutyánk van..."
                  rows={1}
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1C2B3A',
                    resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: 96
                  }}
                />
              </div>
              <button onClick={() => send(input)} disabled={busy || !input.trim()} style={{
                width: 38, height: 38, borderRadius: '50%', background: busy || !input.trim() ? '#96a7b5' : '#1C2B3A',
                border: 'none', color: '#C9963A', cursor: busy || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, transition: 'background .15s'
              }}>↑</button>
            </div>
            <div style={{ fontSize: 11, color: '#96a7b5', textAlign: 'center', padding: '0 16px 10px', flexShrink: 0 }}>
              Az AI az ingatlanok teljes leírásában keres - próbálja természetes mondatokkal
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,70%,100%{transform:scale(0.7);opacity:0.4} 35%{transform:scale(1);opacity:1} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea::placeholder { color: #96a7b5; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(28,43,58,0.18); border-radius: 2px; }
      `}</style>
    </>
  );
}
