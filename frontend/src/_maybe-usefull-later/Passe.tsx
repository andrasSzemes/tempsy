import { useEffect, useRef, useState } from 'react';
import '../App.css'

function getRandomItem<T>(array: T[]): T | null {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function capitalizeStart(sentence: string): string {
  if (!sentence) return '';
  return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
}

function Passe() {


  return (
    <>
        <div style={{display:'flex', flexDirection:'row', width: '100vw', height: '100vh'}}>
            <div style={{flex:1}}>

            </div>
            <div style={{flex:1, textAlign:'left', fontSize:12}}>
1. Le passé composé<br />
➤ Usage :<br />
– Action terminée, ponctuelle, ou brève dans le passé<br />
– Ce qu’il s’est passé<br />
➤ Formation :<br />
Avoir/Être au présent + Participe passé<br />
• J’ai mangé<br />
• Elle est partie<br />
⚠️ Verbes avec être : verbes de mouvement (aller, venir, entrer…), et tous les verbes pronominaux<br />
⚠️ Accord du participe passé avec être ou avec avoir quand le COD est placé avant

<br />
<br />
<br />

2. L’imparfait<br />
<br />
➤ Usage :<br />
– Description dans le passé<br />
– Action habituelle ou répétée<br />
– Contexte, décor, sentiments<br />
<br />
➤ Formation :<br />
Radical de “nous” au présent + terminaisons imparfait<br />
<br />
Terminaisons<br />
-ais, -ais, -ait, -ions, -iez, -aient<br />
<br />
• Nous parlions<br />
• Il faisait froid<br />
• Quand j’étais petit, je jouais dans le jardin


<br />
<br />
<br />

3. Le plus-que-parfait<br />
<br />
➤ Usage :<br />
<br />
– Action antérieure à une autre action passée<br />
– Comme en anglais : “had done”<br />
<br />
➤ Formation :<br />
<br />
Avoir/Être à l’imparfait + Participe passé<br />
• J’avais mangé avant de sortir<br />
• Elle était déjà partie quand je suis arrivé<br />
<br />
⚠️ Les règles d’accord sont les mêmes qu’au passé composé


            </div>
        </div>
    </>
  );
}

export default Passe
