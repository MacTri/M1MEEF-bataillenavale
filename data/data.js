function* gen(nb) {
    for (let i = 0; i < nb; i++) {
        yield i;
    }
}
export function ProduireGrille(L) {
    //création de la grille vide
    const T = [...gen(10)];
    const G = T.map(() => T.map(() => ({
        type: 'water',
        touchée: false
    })));
    //On place les bateaux
    for (let element of L) {
        for (let i = element.CoinHautGauche.ligne; i <= element.CoinBasDroit.ligne; i++) {
            for (let j = element.CoinHautGauche.colonne; j <= element.CoinBasDroit.colonne; j++) {
                if (G[i]?.[j] === undefined) { // cas où on place un bateau hors de la grille
                    return { error: "Bateau Hors Grille" };
                }
                if (G[i][j].type !== 'water') { // cas où on superpose deux bateaux
                    return { error: "Chevauchement de bateaux" };
                }
                else { //cas général
                    G[i][j].type = element;
                }
            }
        }
    }
    return { error: undefined, grille: G };
}
;
export function Tirer(g, c) {
    if (g[c.ligne]?.[c.colonne] === undefined) {
        return { error: "Tir hors grille" };
    }
    if (g[c.ligne][c.colonne].touchée === true) {
        return { error: "Tir déjà effectué à cet endroit" };
    }
    g[c.ligne][c.colonne].touchée = true;
    if (g[c.ligne][c.colonne].type === 'water') {
        return { error: undefined, grille: g, manqué: true };
    }
    return { error: undefined, grille: g, touché: 1, coulé: VerifCouler(g, c) };
}
;
function VerifCouler(g, c) {
    let b = g[c.ligne][c.colonne].type; // comme on arrive ici, on suppose que c'est forcément un bateau et pas de l'eau
    if (b !== "water") {
        for (let i = b.CoinHautGauche.ligne; i <= b.CoinBasDroit.ligne; i++) {
            for (let j = b.CoinHautGauche.colonne; j <= b.CoinBasDroit.colonne; j++) {
                if (g[i][j].touchée === false) {
                    return false;
                }
            }
        }
    }
    return true;
}
export function createPartie(joueur1, joueur2) {
    const L = [5, 4, 3, 3, 2];
    const directions = [
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, 0]
    ];
    const LG = [];
    do {
        const rand = (n) => Math.floor(n * Math.random());
        const LB = L.map(taille => {
            const c1 = { ligne: rand(10), colonne: rand(10) };
            const [dx, dy] = directions[rand(4)];
            const c2 = {
                colonne: c1.colonne + taille * dx,
                ligne: c1.ligne + taille * dy
            };
            return {
                CoinBasDroit: {
                    ligne: c2.ligne,
                    colonne: c2.colonne
                },
                CoinHautGauche: {
                    ligne: c1.ligne,
                    colonne: c1.colonne
                }
            };
        });
        const res = ProduireGrille(LB);
        if (res.error == undefined) {
            LG.push(res.grille);
        }
    } while (LG.length < 2);
    return {
        tour: "joueur1",
        Joueur1: {
            nom: joueur1,
            grille: LG[0]
        },
        Joueur2: {
            nom: joueur2,
            grille: LG[1]
        }
    };
}
