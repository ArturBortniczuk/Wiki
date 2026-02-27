export interface Trait {
  n: string;
  d: string;
  words: string[];
  m: {
    hp?: number;
    atk?: number;
    arm?: number;
    spd?: number;
    crit?: number;
    eva?: number;
  };
}

export interface Fighter {
  id: string;
  title: string;
  img: string | null;
  hp: number;
  maxHp: number;
  atk: number;
  arm: number;
  spd: number;
  crit: number;
  eva: number;
  traits: Trait[];
  raw: number;
  imgCount: number;
  revCount: number;
  linkCount: number;
  langCount: number;
  isProtected: boolean;
  tooltips: Record<string, string>;
}

export const traitPool: Trait[] = [
  { n: 'SZAŁ', d: 'Atak++ Szybkość+', words: ['wojna', 'bitwa', 'atak', 'armia', 'żołnierz', 'front', 'militarny', 'miecz', 'batalia', 'ofensywa', 'agresja'], m: { atk: 1.5, spd: 1.2 } },
  { n: 'TWIERDZA', d: 'Obrona++ HP+', words: ['zamek', 'fortyfikacja', 'mury', 'beton', 'skała', 'stal', 'żelazo', 'kamień', 'schron', 'bunkier', 'tarcza'], m: { arm: 1.6, hp: 1.3 } },
  { n: 'MAJESTAT', d: 'HP++ Atak+', words: ['król', 'cesarz', 'prezydent', 'tron', 'korona', 'władza', 'pałac', 'imperium', 'rząd', 'dynastia', 'monarcha'], m: { hp: 1.5, atk: 1.2 } },
  { n: 'MISTYCYZM', d: 'Krytyk++ HP+', words: ['bóg', 'religia', 'kościół', 'święty', 'anioł', 'diabeł', 'wiara', 'duch', 'magia', 'rytuał', 'klątwa'], m: { crit: 25, hp: 1.2 } },
  { n: 'INTELEKT', d: 'Atak+ Krytyk+ Szybkość-', words: ['nauka', 'uniwersytet', 'teoria', 'fizyka', 'chemia', 'biologia', 'matematyka', 'badania', 'profesor', 'logika', 'filozofia'], m: { atk: 1.3, crit: 20, spd: 0.8 } },
  { n: 'GIGANT', d: 'HP+++ Szybkość--', words: ['góra', 'ocean', 'planeta', 'kosmos', 'galaktyka', 'gwiazda', 'słońce', 'księżyc', 'wszechświat', 'gigantyczny', 'kontynent'], m: { hp: 1.8, spd: 0.6 } },
  { n: 'ZWINNOŚĆ', d: 'Unik++ Szybkość+', words: ['sport', 'piłka', 'bieg', 'zwinny', 'szybki', 'rower', 'pływanie', 'skok', 'taniec', 'akrobatyka', 'olimpiada'], m: { eva: 25, spd: 1.3 } },
  { n: 'TECHNOLOGIA', d: 'Atak++ Obrona+', words: ['komputer', 'internet', 'telefon', 'maszyna', 'robot', 'elektronika', 'procesor', 'oprogramowanie', 'sieć', 'laser', 'energia'], m: { atk: 1.4, arm: 1.2 } },
  { n: 'DZIKOŚĆ', d: 'Atak+ Unik+', words: ['zwierzę', 'lew', 'tygrys', 'wilk', 'ptak', 'las', 'dżungla', 'natura', 'ssak', 'gad', 'owad', 'drapieżnik'], m: { atk: 1.2, eva: 15 } },
  { n: 'KULTURA', d: 'HP+ Unik+', words: ['film', 'aktor', 'muzyka', 'zespół', 'koncert', 'sztuka', 'obraz', 'malarz', 'książka', 'teatr', 'kino'], m: { hp: 1.2, eva: 10 } },
  { n: 'TRANSPORT', d: 'Szybkość++ Obrona+', words: ['samochód', 'pociąg', 'samolot', 'statek', 'droga', 'most', 'silnik', 'transport', 'podróż', 'kolej', 'lotnisko'], m: { spd: 1.4, arm: 1.2 } },
  { n: 'ZABÓJCA', d: 'Krytyk+++ HP--', words: ['śmierć', 'morderstwo', 'zabójca', 'trucizna', 'krew', 'ofiara', 'egzekucja', 'zamach', 'sztylet', 'cień', 'kat'], m: { crit: 40, hp: 0.6, atk: 1.3 } },
  { n: 'DYPLOMACJA', d: 'Obrona+ HP+ Atak-', words: ['prawo', 'traktat', 'sąd', 'polityka', 'senat', 'ustawa', 'kodeks', 'konstytucja', 'parlament', 'ambasador', 'negocjacje'], m: { arm: 1.3, hp: 1.2, atk: 0.8 } },
  { n: 'FLORA', d: 'HP++ Obrona+', words: ['kwiat', 'drzewo', 'roślina', 'ogród', 'botanika', 'liść', 'puszcza', 'flora', 'park', 'sad', 'ekosystem'], m: { hp: 1.4, arm: 1.2 } },
  { n: 'GEOGRAFIA', d: 'Obrona++ Szybkość-', words: ['mapa', 'kraj', 'państwo', 'region', 'prowincja', 'granica', 'terytorium', 'geografia', 'atlas', 'wyspa', 'półwysep'], m: { arm: 1.4, spd: 0.9 } },
  { n: 'KULINARIA', d: 'HP++ Szybkość-', words: ['kuchnia', 'jedzenie', 'gotowanie', 'potrawa', 'restauracja', 'chleb', 'wino', 'cukier', 'mięso', 'warzywo', 'smak'], m: { hp: 1.4, spd: 0.9 } },
  { n: 'MEDYCYNA', d: 'HP+++ Atak-', words: ['lekarz', 'szpital', 'medycyna', 'pacjent', 'choroba', 'leczenie', 'lek', 'anatomia', 'zdrowie', 'operacja', 'klinika'], m: { hp: 1.6, atk: 0.7 } },
  { n: 'HANDEL', d: 'Obrona+ Szybkość+', words: ['pieniądze', 'bank', 'handel', 'giełda', 'waluta', 'biznes', 'firma', 'rynek', 'eksport', 'podatek', 'finanse'], m: { arm: 1.2, spd: 1.2 } },
  { n: 'MUZEUM', d: 'HP++ Krytyk-', words: ['historia', 'zabytek', 'archeologia', 'wykopaliska', 'muzeum', 'antyku', 'przeszłość', 'kronika', 'dziedzictwo', 'eksponat', 'era'], m: { hp: 1.4, crit: -10 } },
  { n: 'DOMATOR', d: 'Obrona+ HP+', words: ['dom', 'budynek', 'mieszkanie', 'rodzina', 'dziecko', 'ulica', 'dzielnica', 'architektura', 'osiedle', 'wnętrze', 'komfort'], m: { arm: 1.2, hp: 1.2 } }
];

import { redis } from '../lib/redis';

export async function fetchFighter(): Promise<Fighter> {
  const result = await redis.srandmember('wiki:fighters');

  if (!result) {
    throw new Error('No fighters available in the database. Please run the seeder script first.');
  }

  return JSON.parse(result) as Fighter;
}
