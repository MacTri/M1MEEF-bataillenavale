// run `node index.js` in the terminal
console.log(`Hello Node.js v${process.versions.node}!`);
import { createServer } from 'http';
import { createPartie, ProduireGrille } from './data';
//import { CréerInterfaceEtat } from './interface';

//create a server object:
createServer((req, res) => {
  console.log('operation', req.method, 'on', req.url);
  if (req.url != '/') {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write(
      `Les ressources autres que / ne sont pas supportées ! (error 404)`
    );
    res.end();
  } else {
    switch (req.method) {
      case 'GET':
        res.write(`
            <html>
              <head>
                <meta charset="UTF-8">
              </head>
              <body>
                Bonjour ami, héhé!<br/>
                ${new Date(Date.now()).toLocaleString('fr-FR')}
              </body>
            </html>
        `); //write a response to the client
        res.end(); //end the response
        break;
      case 'POST':
        req.setEncoding("utf8");
        let body = '';
        req.on('data', data => body += data);
        req.on("end", () => {
          res.statusCode = 200;
          res.write( `body was "${body}"` );
          res.end();
        });
        break;
      default:
        res.statusCode = 405;
        res.end();
    }
  }
})
  .listen(8080); //the server object listens on port 8080
  
  /*let grille = createPartie("Liam","Paul");
  let grilleUI = CréerInterfaceEtat(grille);
  document.body.appendChild(grilleUI.table);*/
