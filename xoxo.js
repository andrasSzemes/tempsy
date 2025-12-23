// pouvoir, devoir, ... + verbe
// negation?
// pronom enplacement?




const negation = false;

const temps_mode = [
  'Présent de l’indicatif',
  'Passé composé',
  'Imparfait',
  'Plus-que-parfait',
  'Conditionnel présent',
  'Futur proche',
  'Futur simple',
  'Impératif'
];
// 'Subjonctif présent',
// 'Subjonctif passé',
// 'Conditionnel passé',
// 'Futur antérieur',

const conjugaison = {
  parler: {
    "Présent de l’indicatif": {
      "je": "parle",
      "tu": "parles",
      "il": "parle",
      "elle": "parle",
      "on": "parle",
      "nous": "parlons",
      "vous": "parlez",
      "ils": "parlent",
      "elles": "parlent"
    },
    "Passé composé": {
      "je": "ai parlé",
      "tu": "as parlé",
      "il": "a parlé",
      "elle": "a parlé",
      "on": "a parlé",
      "nous": "avons parlé",
      "vous": "avez parlé",
      "ils": "ont parlé",
      "elles": "ont parlé"
    },
    "Imparfait": {
      "je": "parlais",
      "tu": "parlais",
      "il": "parlait",
      "elle": "parlait",
      "on": "parlait",
      "nous": "parlions",
      "vous": "parliez",
      "ils": "parlaient",
      "elles": "parlaient"
    },
    "Plus-que-parfait": {
      "je": "avais parlé",
      "tu": "avais parlé",
      "il": "avait parlé",
      "elle": "avait parlé",
      "on": "avait parlé",
      "nous": "avions parlé",
      "vous": "aviez parlé",
      "ils": "avaient parlé",
      "elles": "avaient parlé"
    },
    "Conditionnel présent": {
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
    "Futur proche": {
      "je": "vais parler",
      "tu": "vas parler",
      "il": "va parler",
      "elle": "va parler",
      "on": "va parler",
      "nous": "allons parler",
      "vous": "allez parler",
      "ils": "vont parler",
      "elles": "vont parler"
    },
    "Futur simple": {
      "je": "parlerai",
      "tu": "parleras",
      "il": "parlera",
      "elle": "parlera",
      "on": "parlera",
      "nous": "parlerons",
      "vous": "parlerez",
      "ils": "parleront",
      "elles": "parleront"
    },
    // "Subjonctif présent": {
    //   "que je": "parle",
    //   "que tu": "parles",
    //   "qu’il": "parle",
    //   "qu’elle": "parle",
    //   "qu’on": "parle",
    //   "que nous": "parlions",
    //   "que vous": "parliez",
    //   "qu’ils": "parlent",
    //   "qu’elles": "parlent"
    // },
    // "Subjonctif passé": {
    //   "que j’": "aie parlé",
    //   "que tu": "aies parlé",
    //   "qu’il": "ait parlé",
    //   "qu’elle": "ait parlé",
    //   "qu’on": "ait parlé",
    //   "que nous": "ayons parlé",
    //   "que vous": "ayez parlé",
    //   "qu’ils": "aient parlé",
    //   "qu’elles": "aient parlé"
    // },
    "Impératif": {
      "tu": "parle",
      "nous": "parlons",
      "vous": "parlez"
    }
  }
}



const possessif = {
  Je: {
    "masculine singulier": "mon",
    "masculine pluriel": "mes",
    "féminine singulier": "ma",
    "féminine pluriel": "mes"
  },
  Tu: {
    "masculine singulier": "ton",
    "masculine pluriel": "tes",
    "féminine singulier": "ta",
    "féminine pluriel": "tes"
  },
  Il: {
    "masculine singulier": "son",
    "masculine pluriel": "ses",
    "féminine singulier": "sa",
    "féminine pluriel": "ses"
  },
  Elle: {
    "masculine singulier": "son",
    "masculine pluriel": "ses",
    "féminine singulier": "sa",
    "féminine pluriel": "ses"
  },
  On: {
    "masculine singulier": "son",
    "masculine pluriel": "ses",
    "féminine singulier": "sa",
    "féminine pluriel": "ses"
  },
  Nous: {
    "masculine singulier": "notre",
    "masculine pluriel": "nos",
    "féminine singulier": "notre",
    "féminine pluriel": "nos"
  },
  Vous: {
    "masculine singulier": "votre",
    "masculine pluriel": "vos",
    "féminine singulier": "votre",
    "féminine pluriel": "vos"
  },
  Ils: {
    "masculine singulier": "leur",
    "masculine pluriel": "leurs",
    "féminine singulier": "leur",
    "féminine pluriel": "leurs"
  },
  Elles: {
    "masculine singulier": "leur",
    "masculine pluriel": "leurs",
    "féminine singulier": "leur",
    "féminine pluriel": "leurs"
  }
};



const verbes = {
    'Présent de l’indicatif': [
        'parler', 'manger', 'commencer', 'appeler', 'préférer',
        'finir', 'réussir', 'choisir',
        'partir', 'dormir', 'servir',
        'attendre', 'répondre', 'entendre',
        'se lever', 's\'appeler', 'se souvenir',
        'payer', 'essayer', 'nager', 'placer',
        'boire', 'prendre', 'venir', 'tenir', 'voir', 'croire', 'mettre',
        'avoir', 'être', 'faire', 'aller', 'dire', 'savoir', 'pouvoir', 'vouloir', 'falloir'
    ],
    'Passé composé': [
        // Verbes avec "avoir" (réguliers et irréguliers)
        'parler', 'finir', 'attendre',
        'mettre', 'prendre', 'lire', 'écrire', 'dire', 'voir', 'faire', 'boire', 'ouvrir', 'offrir', 'croire', 'connaître',

        // Verbes pronominaux (toujours avec être)
        'se lever', 's\'appeler', 'se souvenir', 'se coucher', 'se promener',

        // Verbes de mouvement avec "être"
        'aller', 'venir', 'arriver', 'partir', 'entrer', 'sortir', 'monter', 'descendre', 'rester', 'retourner', 'tomber', 'naître', 'mourir', 'passer'

        // ⚠️ Verbes qui peuvent utiliser avoir ou être selon le cas
        // Ex. monter, descendre, sortir, passer (avoir si COD)
    ],
    'Imparfait': [
        // Verbes réguliers (1er, 2e, 3e groupe)
        'parler', 'finir', 'répondre',

        // Verbes avec modification orthographique
        'manger', 'commencer', 'placer', 'nager',

        // Verbes avec radical irrégulier
        'être', 'avoir', 'aller', 'faire', 'dire', 'voir', 'pouvoir', 'vouloir', 'savoir',

        // Verbes en -ir du 3e groupe
        'dormir', 'partir', 'servir',

        // Verbes pronominaux
        'se lever', 'se coucher', 'se souvenir', 's’appeler', 'se promener',

        // Verbes de mouvement
        'venir', 'sortir', 'arriver', 'entrer', 'retourner', 'tomber'
    ],
    'Plus-que-parfait': [
        // Verbes courants avec "avoir"
        'parler', 'finir', 'répondre', 'voir', 'faire', 'mettre', 'prendre', 'écrire', 'dire', 'lire',

        // Verbes avec "être" (mouvement)
        'aller', 'venir', 'arriver', 'partir', 'monter', 'descendre', 'entrer', 'sortir', 'retourner', 'tomber', 'naître', 'mourir', 'rester',

        // Verbes pronominaux
        'se lever', 'se souvenir', 's’appeler', 'se coucher', 'se promener', 'se blesser',

        // Verbes avec accord dépendant du COD
        'voir', 'envoyer', 'donner', 'montrer'  // pour créer : "la lettre que j'avais envoyée", etc.
    ],
    'Conditionnel présent': [
        // Verbes réguliers (-er / -ir / -re)
        'parler', 'finir', 'attendre',

        // Verbes avec changements orthographiques
        'acheter', 'appeler', 'jeter', 'préférer', 'essayer',

        // Verbes pronominaux
        'se lever', 's’appeler', 'se souvenir', 'se promener',

        // Verbes à radical irrégulier
        'être', 'avoir', 'aller', 'faire', 'pouvoir', 'vouloir', 'savoir', 'voir', 'envoyer', 'devoir', 'venir', 'tenir', 'falloir', 'pleuvoir', 'courir', 'mourir'
    ],
    // 'Conditionnel passé': [],
    'Futur proche': [
        // Verbes réguliers -er / -ir / -re
        'parler', 'finir', 'vendre',

        // Verbes fréquents à 2 pronoms
        'donner', 'montrer', 'expliquer', 'dire', 'envoyer', 'poser', 'prêter', 'apporter', 'raconter', 'offrir',

        // Verbes en -yer ou irréguliers
        'payer', 'essayer', 'voir', 'prendre', 'mettre', 'faire', 'lire', 'écrire',

        // Verbes pronominaux
        'se lever', 's’appeler', 'se coucher', 'se souvenir', 'se préparer', 'se tromper'
    ],
    'Futur simple': [
        // Verbes réguliers (infinitif + terminaisons)
        'parler', 'finir', 'attendre',

        // Verbes fréquents pour constructions à pronoms
        'donner', 'expliquer', 'montrer', 'dire', 'envoyer', 'offrir', 'rendre', 'poser',

        // Verbes à radical irrégulier
        'être', 'avoir', 'aller', 'faire', 'pouvoir', 'vouloir', 'savoir', 'voir', 'devoir',
        'venir', 'tenir', 'envoyer', 'mourir', 'pleuvoir', 'falloir', 'recevoir',

        // Verbes pronominaux
        'se lever', 's’appeler', 'se souvenir', 'se coucher', 'se tromper'
    ],
    // 'Futur antérieur': [],
    'Subjonctif présent': [
        // Verbes réguliers (modèle)
        'parler', 'finir', 'répondre',

        // Verbes avec changement de radical ou orthographe
        'venir', 'prendre', 'boire', 'voir', 'croire', 'devoir', 'mourir',
        'payer', 'acheter', 'espérer', 'appeler', 'jeter',

        // Verbes irréguliers très fréquents
        'être', 'avoir', 'aller', 'faire', 'pouvoir', 'savoir', 'vouloir', 'valoir', 'falloir',

        // Verbes pronominaux
        'se lever', 'se souvenir', 's’appeler', 'se tromper', 'se plaindre'
    ],
    'Subjonctif passé': [
        // Verbes avec l’auxiliaire **avoir**
        'faire', 'voir', 'lire', 'écrire', 'dire', 'prendre', 'mettre', 'offrir', 'ouvrir', 'croire',

        // Verbes avec l’auxiliaire **être** (mouvement ou état)
        'aller', 'venir', 'partir', 'arriver', 'monter', 'descendre', 'entrer', 'sortir', 
        'tomber', 'rester', 'retourner', 'naître', 'mourir',

        // Verbes **pronominaux**
        'se lever', 's’appeler', 'se souvenir', 'se promener', 'se tromper', 'se fâcher',

        // Verbes utiles pour **accords complexes**
        'donner', 'montrer', 'envoyer', 'rendre', 'dire' //(COD avant ou pas)
    ],
    'Impératif': [
        // Verbes très fréquents pour l'impératif
        'donner', 'montrer', 'expliquer', 'dire', 'raconter', 'lire', 'écrire', 'envoyer', 'faire', 'laisser', 'mettre',

        // Verbes pronominaux
        'se lever', 'se dépêcher', 'se coucher', 'se taire', 'se souvenir', 's’en aller',

        // Verbes à complément "y" ou "en"
        'aller', 'penser', 'croire', 'revenir', 'partir', 'manger', 'boire', 'acheter'
    ]
}

// Tu peux me donner 20 phrases avec le verbe "manger" qui ont autant de complements possible en avant un sense réel?
const complements = {
  "parler": [
    {
      "phrase": "à (possessif) frère avec patience tous les soirs dans le salon.",
      "COI": {
        "value": "à (possessif) frère",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": null,
      "compléments_circonstanciels": {
        "manière": "avec patience",
        "temps": "tous les soirs",
        "lieu": "dans le salon"
      }
    },
    {
      "phrase": "de (possessif) projet au responsable en visioconférence depuis (possessif) bureau.",
      "COI": {
        "value": "au responsable",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": null,
      "compléments_circonstanciels": {
        "moyen": "en visioconférence",
        "lieu": {
          "value": "depuis (possessif) bureau",
          "genre": "masculine",
          "pronom": "y"
        }
      }
    },
    {
      "phrase": "à (possessif) collègues du nouveau règlement pendant la réunion avec clarté.",
      "COI": {
        "value": "à (possessif) collègues",
        "genre": "masculine pluriel",
        "pronom": "leur"
      },
      "COD": {
        "value": "du nouveau règlement",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "temps": "pendant la réunion",
        "manière": "avec clarté"
      }
    },
    {
      "phrase": "à (possessif) mère de (possessif) voyage en marchant le long du canal.",
      "COI": {
        "value": "à (possessif) mère",
        "genre": "féminine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "de (possessif) voyage",
        "genre": "masculine singulier",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "manière": "en marchant",
        "lieu": "le long du canal"
      }
    },
    {
      "phrase": "au professeur du comportement des élèves chaque matin dans la salle des profs.",
      "COI": {
        "value": "au professeur",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "du comportement des élèves",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "temps": "chaque matin",
        "lieu": "dans la salle des profs"
      }
    },
    {
      "phrase": "au téléphone avec (possessif) cousin de (possessif) stage en souriant.",
      "COI": {
        "value": "au téléphone",
        "genre": "unknown",
        "pronom": "leur"
      },
      "COD": {
        "value": "de (possessif) stage",
        "genre": "masculine singulier",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "accompagnement": {
          "value": "avec (possessif) cousin",
          "genre": "masculine singulier"
        },
        "manière": "en souriant"
      }
    },
    {
      "phrase": "à (possessif) élèves de l’environnement avec passion chaque vendredi.",
      "COI": {
        "value": "à (possessif) élèves",
        "genre": "féminine pluriel",
        "pronom": "leur"
      },
      "COD": {
        "value": "de l’environnement",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "manière": "avec passion",
        "temps": "chaque vendredi"
      }
    },
    {
      "phrase": "au directeur du budget pendant la pause déjeuner dans la cafétéria.",
      "COI": {
        "value": "au directeur",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "du budget",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "temps": "pendant la pause déjeuner",
        "lieu": "dans la cafétéria"
      }
    },
    {
      "phrase": "à (possessif) fille des dangers d’Internet calmement le soir dans (possessif) chambre.",
      "COI": {
        "value": "à (possessif) fille",
        "genre": "féminine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "des dangers d’Internet",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "manière": "calmement",
        "temps": "le soir",
        "lieu": {
          "value": "dans (possessif) chambre",
          "genre": "feminine",
          "pronom": "y"
        }
      }
    },
    {
      "phrase": "aux touristes de l’histoire de la ville devant la cathédrale avec enthousiasme.",
      "COI": {
        "value": "aux touristes",
        "genre": "masculine pluriel",
        "pronom": "leur"
      },
      "COD": {
        "value": "de l’histoire de la ville",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "lieu": "devant la cathédrale",
        "manière": "avec enthousiasme"
      }
    },
    {
      "phrase": "entre eux de la situation actuelle en privé au fond de la salle.",
      "COI": {
        "value": "entre eux",
        "genre": "unknown",
        "pronom": "leur"
      },
      "COD": {
        "value": "de la situation actuelle",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "manière": "en privé",
        "lieu": "au fond de la salle"
      }
    },
    {
      "phrase": "à l’assemblée des prochaines étapes en visioconférence depuis Paris.",
      "COI": {
        "value": "à l’assemblée",
        "genre": "féminine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "des prochaines étapes",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "moyen": "en visioconférence",
        "lieu": "depuis Paris"
      }
    },
    {
      "phrase": "au médecin de (possessif) douleurs avec inquiétude dans la salle d’attente.",
      "COI": {
        "value": "au médecin",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "de (possessif) douleurs",
        "genre": "féminine singulier",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "manière": "avec inquiétude",
        "lieu": "dans la salle d’attente"
      }
    },
    {
      "phrase": "au client du contrat avec fermeté pendant l’entretien.",
      "COI": {
        "value": "au client",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "du contrat",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "manière": "avec fermeté",
        "temps": "pendant l’entretien"
      }
    },
    {
      "phrase": "à l’enfant du danger dans la rue avec douceur.",
      "COI": {
        "value": "à l’enfant",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "du danger",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "lieu": "dans la rue",
        "manière": "avec douceur"
      }
    },
    {
      "phrase": "à (possessif) équipe des objectifs du mois avec un PowerPoint chaque lundi.",
      "COI": {
        "value": "à (possessif) équipe",
        "genre": "féminine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "des objectifs du mois",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "moyen": "avec un PowerPoint",
        "temps": "chaque lundi"
      }
    },
    {
      "phrase": "à la presse de leur expérience sur le terrain avec émotion.",
      "COI": {
        "value": "à la presse",
        "genre": "féminine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "de leur expérience",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "lieu": "sur le terrain",
        "manière": "avec émotion"
      }
    },
    {
      "phrase": "à l’accueil de (possessif) réservation pour demain soir avec politesse.",
      "COI": {
        "value": "à l’accueil",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "de (possessif) réservation",
        "genre": "féminine singulier",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "temps": "pour demain soir",
        "manière": "avec politesse"
      }
    },
    {
      "phrase": "à (possessif) coach de (possessif) progrès durant l’entraînement au gymnase.",
      "COI": {
        "value": "à (possessif) coach",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "de (possessif) progrès",
        "genre": "masculine singulier",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "temps": "durant l’entraînement",
        "lieu": "au gymnase"
      }
    },
    {
      "phrase": "au responsable du planning pour organiser les horaires le matin avant l’ouverture.",
      "COI": {
        "value": "au responsable",
        "genre": "masculine singulier",
        "pronom": "lui"
      },
      "COD": {
        "value": "du planning",
        "genre": "unknown",
        "pronom": "en"
      },
      "compléments_circonstanciels": {
        "but": "pour organiser les horaires",
        "temps": "le matin",
        "temps_2": "avant l’ouverture"
      }
    }
  ],
//   "manger": [
//     {
//       "phrase":"une pomme tous les matins dans la cuisine avec les mains.",
//       "COI":null,
//       "COD":"une pomme",
//       "compléments_circonstanciels":{
//         "temps":"tous les matins",
//         "lieu":"dans la cuisine",
//         "manière":"avec les mains"
//       }
//     },
//     {
//       "phrase":"un sandwich sur le banc en regardant les passants avec appétit.",
//       "COI":null,
//       "COD":"un sandwich",
//       "compléments_circonstanciels":{
//         "lieu":"sur le banc",
//         "manière":"en regardant les passants",
//         "manière_2":"avec appétit"
//       }
//     },
//     {
//       "phrase":"des légumes vapeur le soir pour rester en forme chez nous.",
//       "COI":null,
//       "COD":"des légumes vapeur",
//       "compléments_circonstanciels":{
//         "temps":"le soir",
//         "but":"pour rester en forme",
//         "lieu":"chez nous"
//       }
//     },
//     {
//       "phrase":"du chocolat en cachette dans (possessif) chambre par gourmandise.",
//       "COI":null,
//       "COD":"du chocolat",
//       "compléments_circonstanciels":{
//         "manière":"en cachette",
//         "lieu":"dans (possessif) chambre",
//         "cause":"par gourmandise"
//       }
//     },
//     {
//       "phrase":"une pizza avec des amis devant la télévision le vendredi soir.",
//       "COI":null,
//       "COD":"une pizza",
//       "compléments_circonstanciels":{
//         "accompagnement":"avec des amis",
//         "lieu":"devant la télévision",
//         "temps":"le vendredi soir"
//       }
//     },
//     {
//       "phrase":"un bol de riz avec des baguettes dans un restaurant japonais à midi.",
//       "COI":null,
//       "COD":"un bol de riz",
//       "compléments_circonstanciels":{
//         "moyen":"avec des baguettes",
//         "lieu":"dans un restaurant japonais",
//         "temps":"à midi"
//       }
//     },
//     {
//       "phrase":"des fruits secs pendant la réunion discrètement pour ne pas déranger.",
//       "COI":null,
//       "COD":"des fruits secs",
//       "compléments_circonstanciels":{
//         "temps":"pendant la réunion",
//         "manière":"discrètement",
//         "but":"pour ne pas déranger"
//       }
//     },
//     {
//       "phrase":"des crêpes avec du sirop d’érable le dimanche matin en famille.",
//       "COI":null,
//       "COD":"des crêpes",
//       "compléments_circonstanciels":{
//         "moyen":"avec du sirop d’érable",
//         "temps":"le dimanche matin",
//         "accompagnement":"en famille"
//       }
//     },
//     {
//       "phrase":"du fromage après le repas avec du pain par tradition.",
//       "COI":null,
//       "COD":"du fromage",
//       "compléments_circonstanciels":{
//         "temps":"après le repas",
//         "moyen":"avec du pain",
//         "cause":"par tradition"
//       }
//     },
//     {
//       "phrase":"des céréales au petit-déjeuner en lisant le journal dans la véranda.",
//       "COI":null,
//       "COD":"des céréales",
//       "compléments_circonstanciels":{
//         "temps":"au petit-déjeuner",
//         "manière":"en lisant le journal",
//         "lieu":"dans la véranda"
//       }
//     },
//     {
//       "phrase":"un repas chaud offert par l’association sous la tente en hiver.",
//       "COI":null,
//       "COD":"un repas chaud",
//       "compléments_circonstanciels":{
//         "cause":"offert par l’association",
//         "lieu":"sous la tente",
//         "temps":"en hiver"
//       }
//     },
//     {
//       "phrase":"du poisson grillé avec du citron dans un petit restaurant au bord de la mer.",
//       "COI":null,
//       "COD":"du poisson grillé",
//       "compléments_circonstanciels":{
//         "moyen":"avec du citron",
//         "lieu":"dans un petit restaurant au bord de la mer"
//       }
//     },
//     {
//       "phrase":"un plat végétarien par choix personnel chez des amis le week-end.",
//       "COI":null,
//       "COD":"un plat végétarien",
//       "compléments_circonstanciels":{
//         "cause":"par choix personnel",
//         "lieu":"chez des amis",
//         "temps":"le week-end"
//       }
//     },
//     {
//       "phrase":"un gâteau au chocolat avec de la crème pour l’anniversaire à la maison.",
//       "COI":null,
//       "COD":"un gâteau au chocolat",
//       "compléments_circonstanciels":{
//         "moyen":"avec de la crème",
//         "but":"pour l’anniversaire",
//         "lieu":"à la maison"
//       }
//     },
//     {
//       "phrase":"une soupe au coin du feu en écoutant la radio le soir.",
//       "COI":null,
//       "COD":"une soupe",
//       "compléments_circonstanciels":{
//         "lieu":"au coin du feu",
//         "manière":"en écoutant la radio",
//         "temps":"le soir"
//       }
//     },
//     {
//       "phrase":"un morceau de pain avec du fromage de chèvre en pique-nique dans les montagnes.",
//       "COI":null,
//       "COD":"un morceau de pain",
//       "compléments_circonstanciels":{
//         "moyen":"avec du fromage de chèvre",
//         "lieu":"en pique-nique dans les montagnes"
//       }
//     },
//     {
//       "phrase":"un plat épicé en riant avec des collègues dans un resto indien.",
//       "COI":null,
//       "COD":"un plat épicé",
//       "compléments_circonstanciels":{
//         "manière":"en riant",
//         "accompagnement":"avec des collègues",
//         "lieu":"dans un resto indien"
//       }
//     },
//     {
//       "phrase":"des pâtes fraîches faites maison à la lumière des bougies avec (possessif) compagnon.",
//       "COI":null,
//       "COD":"des pâtes fraîches",
//       "compléments_circonstanciels":{
//         "manière":"faites maison",
//         "lieu":"à la lumière des bougies",
//         "accompagnement":"avec (possessif) compagnon"
//       }
//     },
//     {
//       "phrase":"une banane avant l’entraînement dans les vestiaires par habitude.",
//       "COI":null,
//       "COD":"une banane",
//       "compléments_circonstanciels":{
//         "temps":"avant l’entraînement",
//         "lieu":"dans les vestiaires",
//         "cause":"par habitude"
//       }
//     },
//     {
//       "phrase":"un repas complet avec entrée, plat et dessert pour fêter l’obtention du diplôme au restaurant.",
//       "COI":null,
//       "COD":"un repas complet",
//       "compléments_circonstanciels":{
//         "moyen":"avec entrée, plat et dessert",
//         "but":"pour fêter l’obtention du diplôme",
//         "lieu":"au restaurant"
//       }
//     }
//   ],
//   "commencer": [
//     ["la leçon", "pour lui", "dans la salle"],
//     ["un dossier important", "pour l’équipe", "à la maison"],
//     ["le nettoyage", "pour elle", "chez nous"],
//     ["la rédaction du rapport", "pour l’équipe", "au coworking"],
//     ["un nouveau travail", "pour mon frère", "à la maison"],
//     ["un dossier important", "pour elle", "dans le garage"],
//     ["la leçon", "pour toi", "chez nous"],
//     ["une mission", "pour toi", "à la maison"],
//     ["la leçon", "pour lui", "dans la cuisine"],
//     ["la rédaction du rapport", "pour mon frère", "au coworking"],
//     ["le nettoyage", "pour toi", "dans la salle"],
//     ["le nettoyage", "pour elle", "à l’université"],
//     ["un projet", "pour l’équipe", "au bureau"],
//     ["un nouveau travail", "pour eux", "au coworking"],
//     ["une mission", "pour l’équipe", "chez nous"],
//     ["un projet", "pour l’équipe", "au coworking"],
//     ["le nettoyage", "pour l’équipe", "au coworking"],
//     ["un projet", "pour elle", "dans la cuisine"],
//     ["un nouveau travail", "pour lui", "dans la cuisine"],
//     ["la rédaction du rapport", "pour l’équipe", "au bureau"],
//     ["à travailler", "dans ce bureau"],
//     ["à parler de cette idée", "à son collègue"],
//     ["à écrire la lettre pour elle", "dans le salon"],
//     ["à cuisiner pour sa famille", "dans la cuisine"],
//     ["à réfléchir au problème", "dans le jardin"],
//     ["à se plaindre de son patron", "chez eux"],
//     ["à s’énerver contre eux au bureau", None],
//     ["à préparer les documents", "à la maison"],
//     ["à lire ce livre difficile", "dans la chambre"],
//     ["à répondre aux questions", "en classe"]
// ],
//   "appeler":[
//     ["le docteur", "pour des explications", "de chez lui"],
//     ["le docteur", "au sujet d’un problème", "de son bureau"],
//     ["les collègues", "pour confirmer sa venue", "de chez lui"],
//     ["le docteur", "pour des explications", "de la maison"],
//     ["son frère", "pour un rendez-vous", "de chez lui"],
//     ["le docteur", "à propos du contrat", "de chez lui"],
//     ["le responsable", "au sujet du rapport", "de son bureau"],
//     ["la voisine", "au sujet d’un problème", "du train"],
//     ["le client", "à propos du contrat", "depuis le bureau"],
//     ["ses parents", "pour confirmer sa venue", "du travail"],
//     ["ses parents", "pour une urgence", "de la maison"],
//     ["son frère", "pour des explications", "du salon"],
//     ["la secrétaire", "pour une urgence", "de l’hôpital"],
//     ["le responsable", "concernant la réunion", "de l’école"],
//     ["la voisine", "au sujet d’un problème", "du travail"],
//     ["le directeur", "à propos du contrat", "de son bureau"],
//     ["la voisine", "concernant la réunion", "depuis le bureau"],
//     ["le responsable", "pour un rendez-vous", "du train"],
//     ["le responsable", "pour un rendez-vous", "de l’école"],
//     ["la secrétaire", "au sujet d’un problème", "de son bureau"]
// ],
//   "préférer": [
//     ["le thé au café", "le matin"],
//     ["le train à la voiture", "pour les longs trajets"],
//     ["le silence au bruit", "à la maison"],
//     ["la plage à la montagne", "pendant les vacances"],
//     ["le travail en équipe au travail individuel", "dans ce projet"],
//     ["la lecture à la télévision", "le soir"],
//     ["le rouge au bleu", "pour les vêtements"],
//     ["le vélo à la trottinette", "en ville"],
//     ["les emails aux appels", "au bureau"],
//     ["la cuisine maison aux plats préparés", "en semaine"]
// ],
//   "finir": [
//     ["la vaisselle", "pour ses collègues", "dans la classe"],
//     ["le dossier", "pour l’équipe", "dans l’atelier"],
//     ["le dossier", "pour l’équipe", "dans la cuisine"],
//     ["les devoirs", "pour toi", "dans le jardin"],
//     ["la peinture", "pour moi", "dans la salle"],
//     ["la peinture", "pour eux", "dans la salle"],
//     ["la vaisselle", "pour moi", "dans la salle"],
//     ["la préparation du cours", "pour l’équipe", "au bureau"],
//     ["la préparation du cours", "pour toi", "dans la classe"],
//     ["la vaisselle", "pour moi", "au bureau"],
//     ["la rédaction", "pour l’équipe", "au bureau"],
//     ["la vaisselle", "pour elle", "au bureau"],
//     ["les devoirs", "pour son frère", "dans la classe"],
//     ["les devoirs", "pour eux", "à la maison"],
//     ["le rapport", "pour l’équipe", "au bureau"],
//     ["la rédaction", "pour moi", "dans la salle"],
//     ["la peinture", "pour son frère", "à la maison"],
//     ["le rapport", "pour l’équipe", "dans la chambre"],
//     ["la rédaction", "pour elle", "au bureau"],
//     ["le dossier", "pour moi", "dans la classe"]
// ],
//   "réussir": [
//     ["le test", "pour moi", "dans l’entreprise"],
//     ["l’objectif", "pour elle", "au travail"],
//     ["le projet", "pour notre équipe", "en classe"],
//     ["le test", "pour son patron", "sur le terrain"],
//     ["le projet", "pour son collègue", "dans la salle"],
//     ["l’entretien", "pour moi", "dans l’entreprise"],
//     ["l’objectif", "pour son patron", "à la maison"],
//     ["le concours", "pour ses parents", "dans la salle"],
//     ["le concours", "pour ses parents", "à la maison"],
//     ["l’objectif", "pour son collègue", "à la maison"],
//     ["l’entretien", "pour elle", "en classe"],
//     ["l’objectif", "pour toi", "en classe"],
//     ["l’entretien", "pour notre équipe", "au travail"],
//     ["le projet", "pour son patron", "sur le terrain"],
//     ["l’objectif", "pour elle", "dans la salle"],
//     ["la mission", "pour son patron", "dans la salle"],
//     ["la présentation", "pour son patron", "sur le terrain"],
//     ["le concours", "pour son collègue", "à la maison"],
//     ["l’entretien", "pour ses parents", "en classe"],
//     ["la présentation", "pour eux", "au travail"]
// ],
//   "choisir": [
//     ["un livre", "pour mes parents", "à la bibliothèque"],
//     ["une robe", "pour un ami", "au restaurant"],
//     ["un cadeau", "pour ma sœur", "en ligne"],
//     ["une robe", "pour eux", "chez moi"],
//     ["une destination", "pour eux", "en ligne"],
//     ["une robe", "pour un ami", "dans le catalogue"],
//     ["un cadeau", "pour un ami", "à la bibliothèque"],
//     ["un appartement", "pour mes parents", "chez moi"],
//     ["un cadeau", "pour toi", "dans la vitrine"],
//     ["une robe", "pour lui", "au magasin"],
//     ["une robe", "pour toi", "dans la boutique"],
//     ["un appartement", "pour mes parents", "dans la vitrine"],
//     ["une destination", "pour eux", "dans la vitrine"],
//     ["une robe", "pour toi", "en ligne"],
//     ["une robe", "pour un ami", "chez moi"],
//     ["un appartement", "pour mon frère", "dans la boutique"],
//     ["une option", "pour elle", "chez moi"],
//     ["un film", "pour ma sœur", "au magasin"],
//     ["un plat", "pour mes parents", "dans le catalogue"],
//     ["un cadeau", "pour toi", "chez moi"]
// ],
//   "partir": [
//     "à Paris",
//     "en voyage",
//     "le matin",
//     "à l'étranger",
//     "le problème à l’équipe",
//     "la situation actuelle",
//     "des vêtements pour l’hiver",
//     "le dossier médical"
//   ],
//   "dormir": [
//     "dans ce lit",
//     "chez ses amis",
//     "dans la chambre",
//     "sur le canapé",
//     "de cette décision",
//     "les documents à moi",
//     "le projet à l’équipe",
//     "le colis chez elle"
//   ],
//   "servir": [
//     "le repas",
//     "du café à elle",
//     "le dîner",
//     "un apéritif",
//     "une solution à cette situation",
//     "un message à son frère",
//     "l’information aux élèves",
//     "des vêtements pour l’hiver"
//   ],
//   "attendre": [
//     "le bus",
//     "la réponse de lui",
//     "quelqu’un",
//     "le signal",
//     "la tâche avant midi",
//     "le trajet en train",
//     "le colis chez elle",
//     "le projet à l’équipe"
//   ],
//   "répondre": [
//     "à la question",
//     "à moi",
//     "à son message",
//     "aux élèves",
//     "la tâche avant midi",
//     "les documents à moi",
//     "le dossier médical",
//     "des vêtements pour l’hiver"
//   ],
//   "entendre": [
//     "le bruit",
//     "les enfants dans la rue",
//     "un cri",
//     "la musique",
//     "les documents à moi",
//     "un message à son frère",
//     "le dossier médical",
//     "le colis chez elle"
//   ],
//   "se lever": [
//     "à 7 heures",
//     "pour aller à l’école",
//     "tôt",
//     "sans bruit",
//     "le rendez-vous demain",
//     "de cette décision",
//     "le colis chez elle",
//     "ce message à mes parents"
//   ],
//   "s'appeler": [
//     "Paul",
//     "Marie",
//     "Jacques",
//     "Julie",
//     "le problème à l’équipe",
//     "un message à son frère",
//     "le colis chez elle",
//     "des vêtements pour l’hiver"
//   ],
//   "se souvenir": [
//     "de ce moment",
//     "de cette personne",
//     "de notre promesse",
//     "de cette phrase",
//     "le rendez-vous demain",
//     "la tâche avant midi",
//     "le dossier médical",
//     "ce message à mes parents"
//   ],
//   "payer": [
//     "le ticket",
//     "quelque chose à eux",
//     "le repas",
//     "la facture",
//     "le trajet en train",
//     "les documents à moi",
//     "le dossier médical",
//     "le colis chez elle"
//   ],
//   "essayer": [
//     "cette robe",
//     "de leur expliquer le problème",
//     "une nouvelle méthode",
//     "de le convaincre",
//     "de cette décision",
//     "une solution à cette situation",
//     "cette nouvelle à ta sœur",
//     "ce message à mes parents"
//   ],
//   "nager": [
//     "dans la mer",
//     "dans la piscine",
//     "tous les matins",
//     "longtemps",
//     "les documents à moi",
//     "de cette erreur",
//     "l’information aux élèves",
//     "le dossier médical"
//   ],
//   "placer": [
//     "les livres sur la table",
//     "les dossiers dans le tiroir",
//     "les objets dans la boîte",
//     "les papiers sur l’étagère",
//     "le rendez-vous demain",
//     "le trajet en train",
//     "le colis chez elle",
//     "le dossier médical"
//   ],
//   "boire": [
//     "du thé",
//     "un café avec elle",
//     "de l’eau",
//     "un jus d’orange",
//     "la situation actuelle",
//     "le rendez-vous demain",
//     "cette nouvelle à ta sœur",
//     "le projet à l’équipe"
//   ],
//   "prendre": [
//     "le train",
//     "ce livre pour toi",
//     "la décision",
//     "des notes",
//     "un message à son frère",
//     "de cette décision",
//     "cette nouvelle à ta sœur",
//     "le projet à l’équipe"
//   ],
//   "venir": [
//     "à la maison",
//     "chez eux",
//     "au travail",
//     "à la fête",
//     "une solution à cette situation",
//     "de cette décision",
//     "une note à la fin",
//     "le colis chez elle"
//   ],
//   "tenir": [
//     "la porte",
//     "le sac pour moi",
//     "le bébé",
//     "le parapluie",
//     "une solution à cette situation",
//     "de cette erreur",
//     "le dossier médical",
//     "ce message à mes parents"
//   ],
//   "voir": [
//     "le film",
//     "les enfants",
//     "le problème",
//     "la solution",
//     "le trajet en train",
//     "la tâche avant midi",
//     "le dossier médical",
//     "ce message à mes parents"
//   ],
//   "croire": [
//     "à cette histoire",
//     "en elle",
//     "aux miracles",
//     "ce qu’il dit",
//     "la tâche avant midi",
//     "le plat préféré",
//     "une note à la fin",
//     "ce message à mes parents"
//   ],
//   "mettre": [
//     "les clés sur la table",
//     "le dossier dans le tiroir",
//     "le livre dans le sac",
//     "la lettre sur le bureau",
//     "la situation actuelle",
//     "le plat préféré",
//     "des vêtements pour l’hiver",
//     "ce message à mes parents"
//   ],
//   "avoir": [
//     "une idée",
//     "du courage",
//     "un problème",
//     "de la chance",
//     "les documents à moi",
//     "le problème à l’équipe",
//     "le projet à l’équipe",
//     "une note à la fin"
//   ],
//   "être": [
//     "content de toi",
//     "prêt pour la réunion",
//     "en colère",
//     "fatigué",
//     "le trajet en train",
//     "le problème à l’équipe",
//     "le dossier médical",
//     "le colis chez elle"
//   ],
//   "faire": [
//     "les devoirs",
//     "un gâteau pour eux",
//     "du bruit",
//     "le ménage",
//     "un cadeau à leur amie",
//     "les documents à moi",
//     "ce message à mes parents",
//     "le projet à l’équipe"
//   ],
//   "aller": [
//     "à l’école",
//     "chez le médecin",
//     "au cinéma",
//     "à la plage",
//     "un message à son frère",
//     "de cette erreur",
//     "le projet à l’équipe",
//     "des vêtements pour l’hiver"
//   ],
//   "dire": [
//     "la vérité à elle",
//     "quelque chose à toi",
//     "un secret",
//     "le mot juste",
//     "le trajet en train",
//     "de cette décision",
//     "le dossier médical",
//     "des vêtements pour l’hiver"
//   ],
//   "savoir": [
//     "la réponse",
//     "comment lui parler",
//     "quoi faire",
//     "la vérité",
//     "le rendez-vous demain",
//     "un cadeau à leur amie",
//     "le dossier médical",
//     "l’information aux élèves"
//   ],
//   "pouvoir": [
//     "faire ça",
//     "aider mes parents",
//     "réussir",
//     "réagir vite",
//     "de cette décision",
//     "le rendez-vous demain",
//     "une note à la fin",
//     "des vêtements pour l’hiver"
//   ],
//   "vouloir": [
//     "ce livre",
//     "lui parler maintenant",
//     "venir avec nous",
//     "faire plaisir",
//     "une solution à cette situation",
//     "un cadeau à leur amie",
//     "cette nouvelle à ta sœur",
//     "le projet à l’équipe"
//   ],
//   "falloir": [
//     "faire attention",
//     "lui expliquer calmement",
//     "partir tôt",
//     "réviser ce point",
//     "le plat préféré",
//     "de cette décision",
//     "des vêtements pour l’hiver",
//     "une note à la fin"
//   ],
//     "lire": [
//     "un plat délicieux",
//     "une boîte au grenier",
//     "un mot gentil",
//     "de la pluie sur la route",
//     "un vêtement dans le placard",
//     "le rêve de sa vie",
//     "le projet de groupe",
//     "une image marquante"
//   ],
//   "écrire": [
//     "le dossier confidentiel",
//     "un mot gentil",
//     "de la pluie sur la route",
//     "des fleurs à sa mère",
//     "le rêve de sa vie",
//     "le sac dans la voiture",
//     "les papiers sur le bureau",
//     "un message vocal"
//   ],
//   "ouvrir": [
//     "un conseil utile",
//     "un message important",
//     "le bruit dans la rue",
//     "le chemin de l'école",
//     "une histoire drôle",
//     "un devoir difficile",
//     "une image marquante",
//     "le cadeau pour son anniversaire"
//   ],
//   "offrir": [
//     "des fleurs à sa mère",
//     "le rêve de sa vie",
//     "la vérité à ses amis",
//     "un souvenir d'enfance",
//     "le sac dans la voiture",
//     "un mot gentil",
//     "une image marquante",
//     "le cadeau pour son anniversaire"
//   ],
//   "connaître": [
//     "un conseil utile",
//     "le rêve de sa vie",
//     "un colis au bureau",
//     "les escaliers du bâtiment",
//     "une histoire drôle",
//     "la réponse attendue",
//     "le rapport final",
//     "la décision à prendre"
//   ],
//   "se coucher": [
//     "un mot gentil",
//     "une lettre à son amie",
//     "de la pluie sur la route",
//     "le problème à résoudre",
//     "le dossier confidentiel",
//     "le secret de famille",
//     "les papiers sur le bureau",
//     "une chanson connue"
//   ],
//   "se promener": [
//     "les escaliers du bâtiment",
//     "le problème à résoudre",
//     "un souvenir d'enfance",
//     "le secret de famille",
//     "la porte de la maison",
//     "le dossier confidentiel",
//     "une image marquante",
//     "le rapport final"
//   ],
//   "arriver": [
//     "un plat délicieux",
//     "une boîte au grenier",
//     "un souvenir d'enfance",
//     "un devoir difficile",
//     "la porte de la maison",
//     "une promesse oubliée",
//     "la vérité à ses parents",
//     "une image marquante"
//   ],
//   "entrer": [
//     "un message important",
//     "un conseil utile",
//     "une histoire drôle",
//     "le dossier confidentiel",
//     "le bruit dans la rue",
//     "le rêve de sa vie",
//     "une chanson connue",
//     "la décision à prendre"
//   ],
//   "sortir": [
//     "un souvenir d'enfance",
//     "un devoir difficile",
//     "la vérité à ses amis",
//     "une lettre à son amie",
//     "un livre à mon frère",
//     "une histoire drôle",
//     "un rendez-vous important",
//     "le rapport final"
//   ],
//   "monter": [
//     "le secret de famille",
//     "des fleurs à sa mère",
//     "un vêtement dans le placard",
//     "un devoir difficile",
//     "un colis au bureau",
//     "le problème à résoudre",
//     "une image marquante",
//     "un rendez-vous important"
//   ],
//   "descendre": [
//     "la réponse attendue",
//     "le chemin de l'école",
//     "des fleurs à sa mère",
//     "un conseil utile",
//     "un plat délicieux",
//     "une promesse oubliée",
//     "une chanson connue",
//     "le cadeau pour son anniversaire"
//   ],
//   "rester": [
//     "la réponse attendue",
//     "un plat délicieux",
//     "le bruit dans la rue",
//     "un vêtement dans le placard",
//     "une promesse oubliée",
//     "le cri de l'enfant",
//     "le cadeau pour son anniversaire",
//     "la vérité à ses parents"
//   ],
//   "retourner": [
//     "une lettre à son amie",
//     "un colis au bureau",
//     "un bijou précieux",
//     "la vérité à ses amis",
//     "des nouvelles intéressantes",
//     "les escaliers du bâtiment",
//     "le cadeau pour son anniversaire",
//     "la vérité à ses parents"
//   ],
//   "tomber": [
//     "un mot gentil",
//     "des fleurs à sa mère",
//     "le chemin de l'école",
//     "une promesse oubliée",
//     "une boîte au grenier",
//     "le sac dans la voiture",
//     "la décision à prendre",
//     "le rapport final"
//   ],
//   "naître": [
//     "des fleurs à sa mère",
//     "un mot gentil",
//     "un plat délicieux",
//     "le secret de famille",
//     "une lettre à son amie",
//     "la porte de la maison",
//     "le projet de groupe",
//     "les papiers sur le bureau"
//   ],
//   "mourir": [
//     "de la pluie sur la route",
//     "une lettre à son amie",
//     "un vêtement dans le placard",
//     "les escaliers du bâtiment",
//     "un mot gentil",
//     "un devoir difficile",
//     "la décision à prendre",
//     "une image marquante"
//   ],
//   "passer": [
//     "un conseil utile",
//     "les escaliers du bâtiment",
//     "une promesse oubliée",
//     "la réponse attendue",
//     "une boîte au grenier",
//     "une lettre à son amie",
//     "le cadeau pour son anniversaire",
//     "la décision à prendre"
//   ],
//   "s’appeler": [
//     "le chemin de l'école",
//     "un devoir difficile",
//     "le silence de la nuit",
//     "une promesse oubliée",
//     "le cri de l'enfant",
//     "une boîte au grenier",
//     "le cadeau pour son anniversaire",
//     "le projet de groupe"
//   ],
//   "se blesser": [
//     "une boîte au grenier",
//     "la vérité à ses amis",
//     "le sac dans la voiture",
//     "le dossier confidentiel",
//     "le chemin de l'école",
//     "le rêve de sa vie",
//     "le rapport final",
//     "un message vocal"
//   ],
//   "envoyer": [
//     "le dossier confidentiel",
//     "les escaliers du bâtiment",
//     "la réponse attendue",
//     "un message important",
//     "une lettre à son amie",
//     "le silence de la nuit",
//     "un rendez-vous important",
//     "les papiers sur le bureau"
//   ],
//   "donner": [
//     "le sac dans la voiture",
//     "un conseil utile",
//     "la réponse attendue",
//     "le chemin de l'école",
//     "le bruit dans la rue",
//     "le secret de famille",
//     "la vérité à ses parents",
//     "un message vocal"
//   ],
//   "montrer": [
//     "un souvenir d'enfance",
//     "des fleurs à sa mère",
//     "une histoire drôle",
//     "le sac dans la voiture",
//     "de la pluie sur la route",
//     "la réponse attendue",
//     "un message vocal",
//     "le rapport final"
//   ],
//   "acheter": [
//     "le silence de la nuit",
//     "un colis au bureau",
//     "le cri de l'enfant",
//     "une promesse oubliée",
//     "le dossier confidentiel",
//     "les escaliers du bâtiment",
//     "une image marquante",
//     "la vérité à ses parents"
//   ],
//   "jeter": [
//     "une lettre à son amie",
//     "un devoir difficile",
//     "un bijou précieux",
//     "un message important",
//     "une promesse oubliée",
//     "la porte de la maison",
//     "la décision à prendre",
//     "la vérité à ses parents"
//   ],
//   "devoir": [
//     "une promesse oubliée",
//     "un livre à mon frère",
//     "un bijou précieux",
//     "la vérité à ses amis",
//     "le secret de famille",
//     "un mot gentil",
//     "une chanson connue",
//     "un message vocal"
//   ],
//   "pleuvoir": [
//     "un conseil utile",
//     "des fleurs à sa mère",
//     "un bijou précieux",
//     "la vérité à ses amis",
//     "une promesse oubliée",
//     "un colis au bureau",
//     "la décision à prendre",
//     "une chanson connue"
//   ],
//   "courir": [
//     "un message important",
//     "le silence de la nuit",
//     "une promesse oubliée",
//     "des fleurs à sa mère",
//     "le secret de famille",
//     "une histoire drôle",
//     "le cadeau pour son anniversaire",
//     "la vérité à ses parents"
//   ],
//   "vendre": [
//     "un plat délicieux",
//     "le problème à résoudre",
//     "des nouvelles intéressantes",
//     "le silence de la nuit",
//     "un bijou précieux",
//     "un souvenir d'enfance",
//     "la vérité à ses parents",
//     "une chanson connue"
//   ],
//   "expliquer": [
//     "le secret de famille",
//     "le dossier confidentiel",
//     "un vêtement dans le placard",
//     "un devoir difficile",
//     "de la pluie sur la route",
//     "un colis au bureau",
//     "le rapport final",
//     "le projet de groupe"
//   ],
//   "poser": [
//     "la vérité à ses amis",
//     "le bruit dans la rue",
//     "le silence de la nuit",
//     "le cri de l'enfant",
//     "un colis au bureau",
//     "un souvenir d'enfance",
//     "une image marquante",
//     "le rapport final"
//   ],
//   "prêter": [
//     "une boîte au grenier",
//     "la porte de la maison",
//     "le chemin de l'école",
//     "un conseil utile",
//     "un devoir difficile",
//     "des nouvelles intéressantes",
//     "le projet de groupe",
//     "le rapport final"
//   ],
//   "apporter": [
//     "un souvenir d'enfance",
//     "le bruit dans la rue",
//     "de la pluie sur la route",
//     "les escaliers du bâtiment",
//     "le secret de famille",
//     "un livre à mon frère",
//     "le rapport final",
//     "un message vocal"
//   ],
//   "raconter": [
//     "un mot gentil",
//     "le rêve de sa vie",
//     "la vérité à ses amis",
//     "un livre à mon frère",
//     "la réponse attendue",
//     "un conseil utile",
//     "un rendez-vous important",
//     "la décision à prendre"
//   ],
//   "se préparer": [
//     "le rêve de sa vie",
//     "de la pluie sur la route",
//     "un message important",
//     "des fleurs à sa mère",
//     "un vêtement dans le placard",
//     "un colis au bureau",
//     "le rapport final",
//     "le cadeau pour son anniversaire"
//   ],
//   "se tromper": [
//     "un livre à mon frère",
//     "un souvenir d'enfance",
//     "un devoir difficile",
//     "les escaliers du bâtiment",
//     "un message important",
//     "le bruit dans la rue",
//     "le rapport final",
//     "une image marquante"
//   ],
//   "rendre": [
//     "un message important",
//     "le silence de la nuit",
//     "une histoire drôle",
//     "un bijou précieux",
//     "le secret de famille",
//     "un devoir difficile",
//     "la vérité à ses parents",
//     "le cadeau pour son anniversaire"
//   ],
//   "recevoir": [
//     "un souvenir d'enfance",
//     "une promesse oubliée",
//     "le silence de la nuit",
//     "un bijou précieux",
//     "un vêtement dans le placard",
//     "un livre à mon frère",
//     "le rapport final",
//     "la vérité à ses parents"
//   ],
//   "espérer": [
//     "des nouvelles intéressantes",
//     "la réponse attendue",
//     "un vêtement dans le placard",
//     "la vérité à ses amis",
//     "un mot gentil",
//     "une promesse oubliée",
//     "le rapport final",
//     "le projet de groupe"
//   ],
//   "valoir": [
//     "un livre à mon frère",
//     "le bruit dans la rue",
//     "le secret de famille",
//     "le rêve de sa vie",
//     "le problème à résoudre",
//     "un bijou précieux",
//     "les papiers sur le bureau",
//     "le rapport final"
//   ],
//   "se plaindre": [
//     "des nouvelles intéressantes",
//     "un colis au bureau",
//     "une lettre à son amie",
//     "la vérité à ses amis",
//     "la réponse attendue",
//     "un conseil utile",
//     "une image marquante",
//     "les papiers sur le bureau"
//   ],
//   "se fâcher": [
//     "une boîte au grenier",
//     "le chemin de l'école",
//     "les escaliers du bâtiment",
//     "un conseil utile",
//     "un colis au bureau",
//     "une lettre à son amie",
//     "la décision à prendre",
//     "les papiers sur le bureau"
//   ],
//   "laisser": [
//     "les escaliers du bâtiment",
//     "le rêve de sa vie",
//     "un devoir difficile",
//     "le sac dans la voiture",
//     "un livre à mon frère",
//     "un vêtement dans le placard",
//     "une chanson connue",
//     "les papiers sur le bureau"
//   ],
//   "se dépêcher": [
//     "un message important",
//     "le sac dans la voiture",
//     "la vérité à ses amis",
//     "une lettre à son amie",
//     "un colis au bureau",
//     "un devoir difficile",
//     "les papiers sur le bureau",
//     "un message vocal"
//   ],
//   "se taire": [
//     "un message important",
//     "un mot gentil",
//     "un devoir difficile",
//     "un souvenir d'enfance",
//     "des fleurs à sa mère",
//     "la réponse attendue",
//     "un rendez-vous important",
//     "la vérité à ses parents"
//   ],
//   "s’en aller": [
//     "une histoire drôle",
//     "un vêtement dans le placard",
//     "des fleurs à sa mère",
//     "le bruit dans la rue",
//     "le problème à résoudre",
//     "la porte de la maison",
//     "la décision à prendre",
//     "une chanson connue"
//   ],
//   "penser": [
//     "une boîte au grenier",
//     "le rêve de sa vie",
//     "le sac dans la voiture",
//     "des fleurs à sa mère",
//     "la porte de la maison",
//     "le problème à résoudre",
//     "la vérité à ses parents",
//     "les papiers sur le bureau"
//   ],
//   "revenir": [
//     "un vêtement dans le placard",
//     "le chemin de l'école",
//     "le silence de la nuit",
//     "le dossier confidentiel",
//     "de la pluie sur la route",
//     "la porte de la maison",
//     "les papiers sur le bureau",
//     "la décision à prendre"
//   ]
}