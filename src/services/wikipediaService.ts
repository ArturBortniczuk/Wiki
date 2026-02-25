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

export async function fetchFighter(): Promise<Fighter> {
  let res: Fighter | null = null;
  while (!res) {
    try {
      const rnd = await fetch('https://pl.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&rnnamespace=0&format=json&origin=*', { cache: 'no-store' });
      const rndD = await rnd.json();
      const title = rndD.query.random[0].title;

      const stat = await fetch(`https://pl.wikipedia.org/w/api.php?action=query&prop=info|images|revisions|links|langlinks|extlinks|categories&inprop=protection&pllimit=max&lllimit=max&ellimit=max&cllimit=max&titles=${encodeURIComponent(title)}&format=json&origin=*`, { cache: 'no-store' });
      const statD = await stat.json();
      const page = Object.values(statD.query.pages)[0] as any;

      if (page.length && page.length > 5000 && page.images && page.images.length > 0) {
        const imgReq = await fetch(`https://pl.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, { cache: 'no-store' });
        const imgD = await imgReq.json();

        if (!imgD.thumbnail || !imgD.thumbnail.source) {
          continue;
        }

        const text = (imgD.extract || "").toLowerCase();

        const baseHp = page.length / 5;
        const baseAtk = Math.max(40, (page.images ? page.images.length * 15 : 40));
        const revs = page.revisions ? page.revisions.length : 1;
        const links = page.links ? page.links.length : 0;
        const langs = page.langlinks ? page.langlinks.length : 0;
        const extLinksCount = page.extlinks ? page.extlinks.length : 0;
        const catCount = page.categories ? page.categories.length : 0;
        const isProtected = page.protection && page.protection.length > 0;

        const baseArm = 5 + Math.min(40, (extLinksCount * 0.5));
        const baseSpd = 1.0 + (langs * 0.05);
        const baseCrit = Math.min(60, links * 0.2);
        const baseEva = 50 * Math.pow(0.95, catCount);

        let f: any = {
          id: Math.random().toString(36).substring(7),
          title: title,
          img: imgD.thumbnail ? imgD.thumbnail.source : null,
          hp: baseHp,
          atk: baseAtk,
          arm: baseArm,
          spd: baseSpd,
          crit: baseCrit,
          eva: baseEva,
          traits: [],
          raw: page.length,
          imgCount: page.images ? page.images.length : 0,
          revCount: revs,
          linkCount: links,
          langCount: langs,
          isProtected: isProtected,
          tooltips: {
            hp: `Długość tekstu (${page.length} znaków) / 5`,
            atk: `Baza 40 + (Liczba obrazów: ${page.images ? page.images.length : 0} * 15)`,
            arm: `Baza 5% + 0.5% za każdy link zewnętrzny (${extLinksCount} - Max 40%)`,
            spd: `Baza 1.0 + 5% za każdy przetłumaczony język obiektu (${langs})`,
            crit: `0.2% za każdy link wewnętrzny na stronie wpisu (${links} - Max 60%)`,
            eva: `Zwinność bazowa 50%, każda kategoria zmniejsza obecną wartość o 5% (Kategorii: ${catCount})`
          }
        };

        traitPool.forEach(t => {
          const hasWord = t.words.some(word =>
            text.includes(word) || title.toLowerCase().includes(word)
          );

          if (hasWord) {
            f.traits.push(t);
            if (t.m.hp) f.hp *= t.m.hp;
            if (t.m.atk) f.atk *= t.m.atk;
            if (t.m.arm) f.arm *= t.m.arm;
            if (t.m.spd) f.spd *= t.m.spd;
            if (t.m.crit) f.crit += t.m.crit;
            if (t.m.eva) f.eva += t.m.eva;
          }
        });

        f.maxHp = Math.max(1, Math.floor(f.hp));
        f.hp = f.maxHp;
        f.arm = Math.max(0, Math.min(85, Math.floor(f.arm)));
        f.atk = Math.max(1, Math.floor(f.atk));
        f.spd = Math.max(0.1, f.spd);
        f.crit = Math.round(Math.max(0, Math.min(75, f.crit)) * 100) / 100;
        f.eva = Math.max(0, Math.round(Math.min(60, f.eva)));
        res = f as Fighter;
      }
    } catch (e) {
      console.error("Error fetching fighter, retrying...", e);
    }
  }
  return res;
}
