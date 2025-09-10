/**
 * parseTrustPMEReport
 * Transforme un rapport texte Trust PME (FR) en JSON exploitable.
 * Accepte soit un objet { output: "..." } soit directement une chaîne.
 */
function parseTrustPMEReport(input) {
  const raw = typeof input === 'string' ? input : (input && input.output) || '';
  if (!raw || typeof raw !== 'string') return { ok: false, error: 'Texte vide ou invalide' };

  // Helpers -------------------------------------------------------------
  const norm = raw
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')         // trim fin de ligne
    .replace(/\n{3,}/g, '\n\n')         // compresser lignes vides
    .trim();

  const get = (re, grp = 1) => {
    const m = norm.match(re);
    return m ? (m[grp] || '').trim() : null;
  };

  const section = (labelRe, stopRe) => {
    const start = norm.search(labelRe);
    if (start === -1) return null;
    const sub = norm.slice(start);
    const endIdx = stopRe ? sub.search(stopRe) : -1;
    return (endIdx > 0 ? sub.slice(0, endIdx) : sub).trim();
  };

  const listFromLines = (txt) => {
    if (!txt) return [];
    return txt
      .split('\n')
      .map(l => l.trim())
      .filter(l => /^[-•\d]+\s/.test(l) || /^[-•]\s*/.test(l) || /^- /.test(l))
      .map(l => l.replace(/^[-•]\s*/, '').replace(/^\d+[.)]\s*/, '').trim())
      .filter(Boolean);
  };

  const bulletsAfterLabel = (block, labelRegex) => {
    if (!block) return [];
    const m = block.match(labelRegex);
    if (!m) return [];
    const after = block.slice(m.index + m[0].length);
    // Prendre jusqu’à un double saut de ligne ou une nouvelle rubrique en MAJ
    const cut = after.split(/\n\n(?=[A-ZÉÈÀÂÇÏÔÛ].{3,}|[A-D]\)|\d+\.)/)[0];
    return listFromLines(cut);
  };

  const parseDimension = (idLetter, titleKey) => {
    // Exemple d’en-tête :
    // A) DIMENSION FINANCIÈRE (40%) - Note : B+ (87.5%)
    const reHeader = new RegExp(
      `${idLetter}\\)\\s*DIMENSION[\\s\\S]*?\\((\\d+)%\\)\\s*-\\s*Note\\s*:\\s*([A-E]\\+?)\\s*\\(([\\d.,]+)%\\)`,
      'i'
    );
    const block = section(new RegExp(`\\n${idLetter}\\)\\s*DIMENSION[\\s\\S]*?\\n`, 'i'),
                          new RegExp(`\\n(?:${String.fromCharCode(idLetter.charCodeAt(0)+1)}\\)|3\\.|===|$)`));
    const headerMatch = norm.match(reHeader);
    const poids = headerMatch ? Number(headerMatch[1]) : null;
    const note = headerMatch ? headerMatch[2] : null;
    const scorePct = headerMatch ? Number(headerMatch[3].replace(',', '.')) : null;

    return {
      id: idLetter,
      title: titleKey,
      poids,
      note,
      scorePct,
      indicateurs: bulletsAfterLabel(block, /Indicateurs clés.*?:\s*\n/i),
      forces: bulletsAfterLabel(block, /Forces.*?:\s*\n/i),
      faiblesses: bulletsAfterLabel(block, /(Faiblesses.*?|Faiblesses et risques)\s*:\s*\n/i),
      recommandations: bulletsAfterLabel(block, /Recommandations.*?:\s*\n/i),
    };
  };

  // En-tête / synthèse --------------------------------------------------
  const syntheseSec = section(/1\.\s*SYNTH[ÈE]SE/i, /\n2\.\s*ANALYSE/i);
  const identite = get(/Identit[éè]\s*entreprise\s*:\s*([^\n]+)$/im);
  const scoreGlobal = get(/Score\s*global\s*:\s*([\d.,]+)%/i);
  const noteGlobale = get(/Note\s*:\s*([A-E]\+?)/i);

  // Notation composite : FOHI [Financier: B+ | Opérationnel: C | Humain: A | Impact: B]
  const compositeStr = get(/Notation\s*composite\s*:\s*([^\n]+)/i);
  const gradeFrom = (dim) => {
    const m = (compositeStr || '').match(new RegExp(`${dim}\\s*:\\s*([A-E]\\+?)`, 'i'));
    return m ? m[1] : null;
    };
  
  const notationComposite = {
    brut: compositeStr,
    financier: gradeFrom('Financier'),
    operationnel: gradeFrom('Op[ée]rationnel'),
    humain: gradeFrom('Humain'),
    impact: gradeFrom('Impact'),
  };

  // Sections principales ------------------------------------------------
  const dimA = parseDimension('A', 'Financière');
  const dimB = parseDimension('B', 'Opérationnelle & Stratégique');
  const dimC = parseDimension('C', 'Humaine & Gouvernance');
  const dimD = parseDimension('D', 'Impact Social & Environnemental');

  // Diagnostic transversal
  const diagBlock = section(/3\.\s*DIAGNOSTIC/i, /\n4\.\s*PLAN/i);
  const diagnostic = {
    pattern: get(/Pattern\s*de\s*performance\s*:\s*([^\n]+)/i),
    forces: bulletsAfterLabel(diagBlock, /3\s*forces.*?:\s*\n/i),
    defis: bulletsAfterLabel(diagBlock, /3\s*d[ée]fis.*?:\s*\n/i),
  };

  // Risques
  const riskGlobal = get(/[ÉE]valuation du risque global\s*:\s*([A-ZÉÈA-Z ]+)/i);
  const riskFin = get(/Risque\s*financier\s*:\s*([A-ZÉÈA-Z]+)\b/i);
  const riskOp = get(/Risque\s*op[ée]rationnel\s*:\s*([A-ZÉÈA-Z]+)\b/i);
  const riskHum = get(/Risque\s*humain\s*:\s*([A-ZÉÈA-Z]+)\b/i);
  const riskImpact = get(/Risque\s*d'?impact\s*:\s*([A-ZÉÈA-Z]+)\b/i);

  // Plan d’action
  const planBlock = section(/4\.\s*PLAN D'?ACTION/i, /\n5\.\s*ANNEXES/i);
  const priorites = (() => {
    if (!planBlock) return [];
    const priBlk = planBlock.match(/priorit[ée]s.*?\(0-6\s*mois\)\s*:\s*\n([\s\S]+?)\n\n/i);
    const items = priBlk ? priBlk[1] : '';
    // Ne retenir que les 1., 2., 3. (ignorer les sous-puces « - »)
    return items
      .split('\n')
      .map(l => l.trim())
      .filter(l => /^\d+\.\s+/.test(l))
      .map(l => l.replace(/^\d+\.\s+/, '').trim());
  })();

  const objectifs = (() => {
    if (!planBlock) return [];
    const objBlk = planBlock.match(/objectifs.*?\(6-18\s*mois\)\s*:\s*\n([\s\S]+?)\n\n/i);
    const items = objBlk ? objBlk[1] : '';
    return items
      .split('\n')
      .map(l => l.trim())
      .filter(l => /^\d+\.\s+/.test(l))
      .map(l => l.replace(/^\d+\.\s+/, '').trim());
  })();

  const recommandationsAccompagnement = bulletsAfterLabel(planBlock, /Recommandations d'?accompagnement\s*:\s*\n/i);
  const financements = bulletsAfterLabel(planBlock, /Opportunit[ée]s de financement.*?:\s*\n/i);

  // Annexes (méthodologie / pondérations / références)
  const annexesBlock = section(/5\.\s*ANNEXES/i, /===\s*FIN/i);
  const methodologie = bulletsAfterLabel(annexesBlock, /M[ée]thodologie.*?:\s*\n/i);
  const ponderations = get(/Pond[ée]rations\s*:\s*([^\n]+)/i);
  const references = bulletsAfterLabel(annexesBlock, /R[ée]f[ée]rences.*?:\s*\n/i);

  // Sortie structurée ---------------------------------------------------
  const result = {
    ok: true,
    meta: {
      titre: get(/RAPPORT TRUST PME.*?ÉVALUATION ENTREPRISE/i) ? 'Rapport Trust PME - Évaluation Entreprise' : null,
      source: 'TrustPME v2024',
    },
    synthese: {
      identite: identite,
      resume: syntheseSec ? syntheseSec.split('\n').map(s => s.trim()).filter(Boolean) : null,
      conclusion: get(/Conclusion synth[ée]tique\s*:\s*([^\n]+)/i),
      scoreGlobal: scoreGlobal ? Number(scoreGlobal.replace(',', '.')) : null,
      noteGlobale,
      notationComposite,
    },
    dimensions: [dimA, dimB, dimC, dimD],
    diagnostic,
    risques: {
      global: riskGlobal && riskGlobal.trim(),
      financier: riskFin,
      operationnel: riskOp,
      humain: riskHum,
      impact: riskImpact,
    },
    planAction: {
      prioritesImmediates: priorites,
      objectifsMoyenTerme: objectifs,
      recommandationsAccompagnement,
      financements,
    },
    annexes: {
      methodologie,
      ponderations,
      references,
    }
  };

  return result;
}

// ----- Exemple d’utilisation -----
// const inputObj = { output: `... ton long texte ...` };
// const parsed = parseTrustPMEReport(inputObj);
// console.log(parsed);
// // Si tu dois sérialiser :
// console.log(JSON.stringify(parsed, null, 2));


// {
//   "dashboard": {
//     "finance": {
//       "tresorerieVsEndettement": {
//         "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//         "datasets": [
//           {
//             "label": "Trésorerie",
//             "data": [12000, 13500, 15000, 14800, 16000, 17000],
//             "borderColor": "#10B981",
//             "backgroundColor": "rgba(16,185,129,0.2)"
//           },
//           {
//             "label": "Endettement",
//             "data": [8000, 9000, 9500, 9700, 9900, 10000],
//             "borderColor": "#EF4444",
//             "backgroundColor": "rgba(239,68,68,0.2)"
//           }
//         ]
//       },
//       "rentabiliteVsSecteur": {
//         "labels": ["PME", "Secteur"],
//         "datasets": [
//           {
//             "label": "Marge (%)",
//             "data": [18, 12],
//             "backgroundColor": ["#3B82F6", "#F59E0B"]
//           }
//         ]
//       },
//       "evolutionFinanciere12Mois": {
//         "labels": [
//           "Sep", "Oct", "Nov", "Dec",
//           "Jan", "Feb", "Mar", "Apr",
//           "May", "Jun", "Jul", "Aug"
//         ],
//         "datasets": [
//           {
//             "label": "Chiffre d’Affaires",
//             "data": [10000, 12000, 11500, 13000, 14500, 16000, 17500, 17000, 16500, 18000, 19500, 20000],
//             "borderColor": "#2563EB",
//             "backgroundColor": "rgba(37,99,235,0.2)"
//           }
//         ]
//       }
//     },
//     "risques": {
//       "heatmap": [
//         { "risque": "Endettement élevé", "impact": 5, "probabilite": 4 },
//         { "risque": "Dépendance clients", "impact": 4, "probabilite": 3 },
//         { "risque": "Retards fournisseurs", "impact": 3, "probabilite": 2 }
//       ]
//     },
//     "alertes": [
//       { "type": "critique", "message": "Endettement supérieur à 80% du CA" },
//       { "type": "moyenne", "message": "40% du chiffre d’affaires dépend de 2 clients" }
//     ]
//   }
// }

