export const examples = {
    situationsHypothetiques: [
        {
            "sentence": "(si-SUJET1-avoir) plus de temps, (SUJET1-lire) davantage.",
            "sujet1": ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"]
        },
        {
            "sentence": "(SUJET1-aider) avec plaisir (si-SUJET1-savoir) comment faire.",
            "sujet1": ["je", "il", "elle", "on", "nous", "vous", "ils", "elles"]
        },
        {
            "sentence": "(SUJET1-voyager) en Asie (si-SUJET1-avoir) les moyens.",
            "sujet1": ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"]
        },
        {
            "sentence": "(SUJET1-acheter) cette maison (si-SUJET2-être) moins chère.",
            "sujet1": ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"],
            "sujet2": ["elle"]
        },
        {
            "sentence": "(SUJET1-être) plus en forme (si-SUJET1-faire) du sport régulièrement.",
            "sujet1": ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"]
        }
    ]
}

// [
//         // Verbes réguliers (-er / -ir / -re)
//         'parler', 'finir', 'attendre',

//         // Verbes avec changements orthographiques
//         'acheter', 'appeler', 'jeter', 'préférer', 'essayer',

//         // Verbes pronominaux
//         'se lever', 's’appeler', 'se souvenir', 'se promener',

//         // Verbes à radical irrégulier
//         'être', 'avoir', 'aller', 'faire', 'pouvoir', 'vouloir', 'savoir', 'voir', 'envoyer', 'devoir', 'venir', 'tenir', 'falloir', 'pleuvoir', 'courir', 'mourir'
//     ]

export const conjugaison: {[verb: string]: {[sujet: string]: string}} = {
  "parler": {
    "je": "parlerais",
    "tu": "parlerais",
    "il": "parlerait",
    "elle": "parlerait",
    "on": "parlerait",
    "nous": "parlerions",
    "vous": "parleriez",
    "ils": "parleraient",
    "elles": "parleraient"
  },
  "finir": {
    "je": "finirais",
    "tu": "finirais",
    "il": "finirait",
    "elle": "finirait",
    "on": "finirait",
    "nous": "finirions",
    "vous": "finiriez",
    "ils": "finiraient",
    "elles": "finiraient"
  },
  "attendre": {
    "je": "attendrais",
    "tu": "attendrais",
    "il": "attendrait",
    "elle": "attendrait",
    "on": "attendrait",
    "nous": "attendrions",
    "vous": "attendriez",
    "ils": "attendraient",
    "elles": "attendraient"
  },
  "acheter": {
    "je": "achèterais",
    "tu": "achèterais",
    "il": "achèterait",
    "elle": "achèterait",
    "on": "achèterait",
    "nous": "achèterions",
    "vous": "achèteriez",
    "ils": "achèteraient",
    "elles": "achèteraient"
  },
  "appeler": {
    "je": "appellerais",
    "tu": "appellerais",
    "il": "appellerait",
    "elle": "appellerait",
    "on": "appellerait",
    "nous": "appellerions",
    "vous": "appelleriez",
    "ils": "appelleraient",
    "elles": "appelleraient"
  },
  "jeter": {
    "je": "jetterais",
    "tu": "jetterais",
    "il": "jetterait",
    "elle": "jetterait",
    "on": "jetterait",
    "nous": "jetterions",
    "vous": "jetteriez",
    "ils": "jetteraient",
    "elles": "jetteraient"
  },
  "préférer": {
    "je": "préférerais",
    "tu": "préférerais",
    "il": "préférerait",
    "elle": "préférerait",
    "on": "préférerait",
    "nous": "préférerions",
    "vous": "préféreriez",
    "ils": "préféreraient",
    "elles": "préféreraient"
  },
  "essayer": {
    "je": "essaierais",
    "tu": "essaierais",
    "il": "essaierait",
    "elle": "essaierait",
    "on": "essaierait",
    "nous": "essaierions",
    "vous": "essaieriez",
    "ils": "essaieraient",
    "elles": "essaieraient"
  },
  "se lever": {
    "je": "me lèverais",
    "tu": "te lèverais",
    "il": "se lèverait",
    "elle": "se lèverait",
    "on": "se lèverait",
    "nous": "nous lèverions",
    "vous": "vous lèveriez",
    "ils": "se lèveraient",
    "elles": "se lèveraient"
  },
  "s’appeler": {
    "je": "m’appellerais",
    "tu": "t’appellerais",
    "il": "s’appellerait",
    "elle": "s’appellerait",
    "on": "s’appellerait",
    "nous": "nous appellerions",
    "vous": "vous appelleriez",
    "ils": "s’appelleraient",
    "elles": "s’appelleraient"
  },
  "se souvenir": {
    "je": "me souviendrais",
    "tu": "te souviendrais",
    "il": "se souviendrait",
    "elle": "se souviendrait",
    "on": "se souviendrait",
    "nous": "nous souviendrions",
    "vous": "vous souviendriez",
    "ils": "se souviendraient",
    "elles": "se souviendraient"
  },
  "se promener": {
    "je": "me promènerais",
    "tu": "te promènerais",
    "il": "se promènerait",
    "elle": "se promènerait",
    "on": "se promènerait",
    "nous": "nous promènerions",
    "vous": "vous promèneriez",
    "ils": "se promèneraient",
    "elles": "se promèneraient"
  },
  "être": {
    "je": "serais",
    "tu": "serais",
    "il": "serait",
    "elle": "serait",
    "on": "serait",
    "nous": "serions",
    "vous": "seriez",
    "ils": "seraient",
    "elles": "seraient"
  },
  "avoir": {
    "je": "aurais",
    "tu": "aurais",
    "il": "aurait",
    "elle": "aurait",
    "on": "aurait",
    "nous": "aurions",
    "vous": "auriez",
    "ils": "auraient",
    "elles": "auraient"
  },
  "aller": {
    "je": "irais",
    "tu": "irais",
    "il": "irait",
    "elle": "irait",
    "on": "irait",
    "nous": "irions",
    "vous": "iriez",
    "ils": "iraient",
    "elles": "iraient"
  },
  "faire": {
    "je": "ferais",
    "tu": "ferais",
    "il": "ferait",
    "elle": "ferait",
    "on": "ferait",
    "nous": "ferions",
    "vous": "feriez",
    "ils": "feraient",
    "elles": "feraient"
  },
  "pouvoir": {
    "je": "pourrais",
    "tu": "pourrais",
    "il": "pourrait",
    "elle": "pourrait",
    "on": "pourrait",
    "nous": "pourrions",
    "vous": "pourriez",
    "ils": "pourraient",
    "elles": "pourraient"
  },
  "vouloir": {
    "je": "voudrais",
    "tu": "voudrais",
    "il": "voudrait",
    "elle": "voudrait",
    "on": "voudrait",
    "nous": "voudrions",
    "vous": "voudriez",
    "ils": "voudraient",
    "elles": "voudraient"
  },
  "savoir": {
    "je": "saurais",
    "tu": "saurais",
    "il": "saurait",
    "elle": "saurait",
    "on": "saurait",
    "nous": "saurions",
    "vous": "sauriez",
    "ils": "sauraient",
    "elles": "sauraient"
  },
  "voir": {
    "je": "verrais",
    "tu": "verrais",
    "il": "verrait",
    "elle": "verrait",
    "on": "verrait",
    "nous": "verrions",
    "vous": "verriez",
    "ils": "verraient",
    "elles": "verraient"
  },
  "envoyer": {
    "je": "enverrais",
    "tu": "enverrais",
    "il": "enverrait",
    "elle": "enverrait",
    "on": "enverrait",
    "nous": "enverrions",
    "vous": "enverriez",
    "ils": "enverraient",
    "elles": "enverraient"
  },
  "devoir": {
    "je": "devrais",
    "tu": "devrais",
    "il": "devrait",
    "elle": "devrait",
    "on": "devrait",
    "nous": "devrions",
    "vous": "devriez",
    "ils": "devraient",
    "elles": "devraient"
  },
  "venir": {
    "je": "viendrais",
    "tu": "viendrais",
    "il": "viendrait",
    "elle": "viendrait",
    "on": "viendrait",
    "nous": "viendrions",
    "vous": "viendriez",
    "ils": "viendraient",
    "elles": "viendraient"
  },
  "tenir": {
    "je": "tiendrais",
    "tu": "tiendrais",
    "il": "tiendrait",
    "elle": "tiendrait",
    "on": "tiendrait",
    "nous": "tiendrions",
    "vous": "tiendriez",
    "ils": "tiendraient",
    "elles": "tiendraient"
  },
  "falloir": {
    "je": "faudrait",
    "tu": "faudrait",
    "il": "faudrait",
    "elle": "faudrait",
    "on": "faudrait",
    "nous": "faudrait",
    "vous": "faudrait",
    "ils": "faudrait",
    "elles": "faudrait"
  },
  "pleuvoir": {
    "je": "pleuvrait",
    "tu": "pleuvrait",
    "il": "pleuvrait",
    "elle": "pleuvrait",
    "on": "pleuvrait",
    "nous": "pleuvrait",
    "vous": "pleuvrait",
    "ils": "pleuvrait",
    "elles": "pleuvrait"
  },
  "courir": {
    "je": "courrais",
    "tu": "courrais",
    "il": "courrait",
    "elle": "courrait",
    "on": "courrait",
    "nous": "courrions",
    "vous": "courriez",
    "ils": "courraient",
    "elles": "courraient"
  },
  "mourir": {
    "je": "mourrais",
    "tu": "mourrais",
    "il": "mourrait",
    "elle": "mourrait",
    "on": "mourrait",
    "nous": "mourrions",
    "vous": "mourriez",
    "ils": "mourraient",
    "elles": "mourraient"
  },
  "aider": {
  "je": "aiderais",
  "tu": "aiderais",
  "il": "aiderait",
  "elle": "aiderait",
  "on": "aiderait",
  "nous": "aiderions",
  "vous": "aideriez",
  "ils": "aideraient",
  "elles": "aideraient"
},
"lire": {
  "je": "lirais",
  "tu": "lirais",
  "il": "lirait",
  "elle": "lirait",
  "on": "lirait",
  "nous": "lirions",
  "vous": "liriez",
  "ils": "liraient",
  "elles": "liraient"
},
"voyager": {
  "je": "voyagerais",
  "tu": "voyagerais",
  "il": "voyagerait",
  "elle": "voyagerait",
  "on": "voyagerait",
  "nous": "voyagerions",
  "vous": "voyageriez",
  "ils": "voyageraient",
  "elles": "voyageraient"
}
}