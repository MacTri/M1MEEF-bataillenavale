import { CréerInterfaceEtat } from "./interface";
console.log("Coucou le script formulaire est bien chargé");
const btCommencer = document.querySelector("#commencer");
btCommencer.onclick = async () => {
    const url = new URLSearchParams();
    url.set("joueur1", "bob");
    url.set("joueur2", "jo");
    const R = await fetch("bataille/create", { method: "POST", body: url });
    if (R.ok) {
        const partie = await R.json();
        let grilleUiJoueur1 = CréerInterfaceEtat(partie.Joueur1.grille);
        let grilleUiJoueur2 = CréerInterfaceEtat(partie.Joueur2.grille);
        document.body.appendChild(grilleUiJoueur1.table);
        document.body.appendChild(grilleUiJoueur2.table);
    }
    else {
        R.text().then(err => console.error(R.status, err));
    }
    const Rbatailles = await fetch("/batailles");
    console.log("Les batailles:", await Rbatailles.json());
};
