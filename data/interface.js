function* gen(nb) {
    for (let i = 0; i < nb; i++) {
        yield i;
    }
}
export function CréerInterfaceEtat(grille) {
    // création d'une tablea HTML pour rprster la grille + s'abonner aux évènements pour jouer
    const table = document.createElement('table');
    const str = `
      <thead>
          <td colspan="7">Au tour du joueur 1 </td>
      </thead>
      <tbody>
        ${grille
        .map((ligne) => `
        <tr>
          ${grille
        .map((col) => `
            <td class = "C${col}">
              <div></div>
            </td>
          `)
        .join('')}
        </tr>`)
        .join('')}
      </tbody>
      <caption>
        <button> Recommencer une partie </button>
      </caption>
    `;
    table.innerHTML = str;
    const grilleUI = { grille, table };
    return grilleUI;
}
