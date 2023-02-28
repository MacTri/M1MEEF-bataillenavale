import { createPartie, GRILLE, PARTIE, ProduireGrille } from "./data";


  function* gen(nb: number) {
    for (let i = 0; i < nb; i++) {
      yield i;
    }
  }

  interface GrilleUI {
    grille: GRILLE;
    table: HTMLTableElement;
  }

  export function CréerInterfaceEtat(grille: GRILLE): GrilleUI {
    // création d'une tablea HTML pour rprster la grille + s'abonner aux évènements pour jouer
    const table = document.createElement('table');
    const str = `
      <thead>
          <td colspan="7">Au tour du joueur 1 </td>
      </thead>
      <tbody>
        ${grille
          .map(
            (ligne) => `
        <tr>
          ${grille
            .map(
              (col) => `
            <td class = "C${col}">
              <div></div>
            </td>
          `
            )
            .join('')}
        </tr>`
          )
          .join('')}
      </tbody>
      <caption>
        <button> Recommencer une partie </button>
      </caption>
    `;
  
    table.innerHTML = str;
    const grilleUI: GrilleUI= { grille, table };
  
    return grilleUI;
  }