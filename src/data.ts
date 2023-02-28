export type JOUEUR = {
    nom : string;
    grille : GRILLE;
}

export interface PARTIE{
    tour : "joueur1" | "joueur2";
    Joueur1 : JOUEUR;
    Joueur2 : JOUEUR;
}

export interface COORD{
    readonly ligne : number;
    readonly colonne : number;
}

export interface BATEAU{
    readonly CoinHautGauche : COORD;
    readonly CoinBasDroit : COORD;
}

export type CaseGrille = {
    type : 'water'|BATEAU;
    touchée : boolean;
}

export type CaseLigne = CaseGrille[];
export type GRILLE = CaseLigne[];

function* gen(nb:number){
    for (let i=0;i<nb;i++){
        yield i;
    }
}

export type ProduireGrilleResp = {error:undefined, grille:GRILLE}
                                | {error: "Bateau Hors Grille"}
                                | {error: "Chevauchement de bateaux"};

export function ProduireGrille(L:readonly BATEAU[]): ProduireGrilleResp {
    //création de la grille vide
    const T = [...gen(10)];
    const G:GRILLE = T.map( () => T.map( () =>({
        type : 'water',
        touchée : false
    })));

    //On place les bateaux
    for (let element of L){
        for (let i=element.CoinHautGauche.ligne;i<=element.CoinBasDroit.ligne;i++){
            for (let j=element.CoinHautGauche.colonne;j<=element.CoinBasDroit.colonne;j++){
                if (G[i]?.[j] === undefined) { // cas où on place un bateau hors de la grille
                    return {error:"Bateau Hors Grille"};
                }
                if(G[i][j].type !== 'water'){ // cas où on superpose deux bateaux
                    return {error:"Chevauchement de bateaux"};
                }
                else{ //cas général
                    G[i][j].type = element;
                }
            }
        }
    }
    return {error:undefined,grille:G}
    
};

export function Tirer(g:GRILLE,c:COORD):({error:undefined, grille:GRILLE, manqué:true}
                                        | {error:undefined,grille:GRILLE,touché:number,coulé:Boolean} 
                                        | {error:"Tir hors grille"}
                                        | {error:"Tir déjà effectué à cet endroit"}){
        if (g[c.ligne]?.[c.colonne] === undefined){
            return {error:"Tir hors grille"};
        }
        if (g[c.ligne][c.colonne].touchée === true){
            return {error:"Tir déjà effectué à cet endroit"};
        }
        g[c.ligne][c.colonne].touchée = true;
        if (g[c.ligne][c.colonne].type === 'water'){
            return {error:undefined, grille:g, manqué:true};
        }
        return {error:undefined,grille:g,touché:1,coulé:VerifCouler(g,c)}
};

function VerifCouler(g:GRILLE,c:COORD):boolean{
    let b = g[c.ligne][c.colonne].type; // comme on arrive ici, on suppose que c'est forcément un bateau et pas de l'eau
    if (b !== "water"){
        for(let i=b.CoinHautGauche.ligne;i<=b.CoinBasDroit.ligne;i++){
            for(let j=b.CoinHautGauche.colonne;j<=b.CoinBasDroit.colonne;j++){
                if(g[i][j].touchée === false){
                    return false;
                }
            }
        }
    }
    return true; 
}

export function createPartie(joueur1:string,joueur2:string): PARTIE {
    const L = [5,4,3,3,2];
    const directions = [
        [1,0],
        [0,-1],
        [0,1],
        [-1,0]
    ];
    const LG : GRILLE[] = [];
    do {    
        const rand = (n:number) => Math.floor(n*Math.random());
        const LB : BATEAU[] = L.map(taille => {
            const c1:COORD = {ligne:rand(10),colonne:rand(10)};
            const[dx,dy] = directions[rand(4)];
            const c2:COORD = {
                colonne : c1.colonne + taille*dx,
                ligne : c1.ligne + taille*dy
        };
        return {
            CoinBasDroit:{
                ligne : c2.ligne,
                colonne : c2.colonne
            },
            CoinHautGauche:{
                ligne : c1.ligne,
                colonne : c1.colonne 
            }
        }
        });
        const res = ProduireGrille(LB);
        if (res.error == undefined){
            LG.push(res.grille);
        }
    } while (LG.length<2);

    return {
        tour:"joueur1",
        Joueur1: {
            nom:joueur1,
            grille: LG[0]
        },
        Joueur2:{
            nom:joueur2,
            grille:LG[1]
        }
    }
}