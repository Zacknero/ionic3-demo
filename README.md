
# Template Ionic 2


## Requisiti

`npm`, `ionic`, `cordova`, `typescript`,  `tslint`

## Linee guida Angular 5

Per evitare stili di scrittura diversi è fortemente consigliata la lettura delle linee guida sullo stile presentate da Angular 5 al link [https://angular.io/guide/styleguide](https://angular.io/guide/styleguide). Nella guida è riportato lo stile suggerito per quanto concerne naming and coding convention, scrittura dei componenti e servizi, utilizzo dei moduli e molto altro.

## IDE

Qualsiasi IDE che supporti typescript va benissimo per sviluppare il progetto e le future applicazioni, ma si consiglia l'utilizzo di Visual Studio Code e l'installazione delle seguenti estensioni:

 * Ionic Extension Pack
 * Angular Essentials
 * Add jsdoc comments
 * Beautify
 * Sass

I primi due sono dei pack che includono una serie di estensioni che possono esssere installate anche singolarmente.
Se si vuole rimuovere una estensione del pack occorrerà prima rimuovere il pack stesso (solo il pack senza le sue "dipendenze").

### Estensioni VSCode

L'estensione TypeScript Hero in particolare ha la possibilità di rielaborare il codice in fase di salvataggio del file: ad esempio è in grado di riordinare gli import in maniera più pulita. Si consiglia l'attivazione di questa funzionalità impostando nelle proprie preferenze utente

    "typescriptHero.imports.organizeOnSave": true


Questo permetterà di allineare il codice degli sviluppatori per una maggiore facilità di lettura in fase di diff GIT.

Altra impostazione che si consiglia di attivare è l'autofix per tslint in fase di salvataggio. Questo permette di risolvere automaticamente una serie di piccoli problemi indentificati dal tslint, evitando di mostrarne l'errore. Per attivarla impostare nelle preferenze utente

    "tslint.autoFixOnSave": true

## Sviluppo

Invece di lanciare il comando `ionic serve` si consiglia di utilizzare il comando `npm run serve:<env>` dove `<env>` rappresenta l'environment da utilizzare all'interno dell'app. Al momento sono disponibili tre environment: `dev`, `mocks` e `prod` (che è il default nel caso in cui non venga specificato). Gli environment sono configurabili attraverso i relativi file `/src/environments/environment.<env>.ts`.

Per creare un environment è sufficiente aggiungere il relativo file nella directory `src/environments` e un nuovo script nel `package.json`.

Ad esempio, per aggiungere l'environment test occorrerà creare il file `src/environments/environment.test.ts` definendone tutte le variabili e specificare il nuovo script `serve:test: "ENV=test ionic-app-scripts serve"` nel `package.json`. Ora lanciando il comando `npm run serve:test` si avvierà una nuova istanza del progetto con l'environment appena definito.

## Alias

Nel file `tsconfig.json` e nel file `webpack.config.js` è possibile definire una serie di alias per manterene il codice più pulito nelle sezioni di import, senza però abusarne: gli alias, infatti, dovrebbero essere creati per macro aree del progetto e non per singoli moduli. Ogni modulo deve essere inserito in una sua cartella con tutti i propri servizi e modelli, che però dovrebbe includere con path relativo e senza l'utilizzo degli alias.

Il `DeviceService` ad esempio viene importato dall'esterno utilizzando il path `@core/device/device.service`, ma dall'interno della cartella `device`, ad esempio dal `DeviceModule`, deve essere importato attraverso il path relativo `./device.service`. Questo rende il modulo trasportabile a prescindere dall'alias utilizzato nel progetto.

## Server Mocks

Attraverso il comando `npm run start-mocks` è possibile lanciare un web server interno contattabile alla url `http://127.0.0.1:9001` e che punta alla disrectory `mocks` del progetto.

Il file mock di configurazione presente in `/mocks/config/config.json` sarà, ad esempio fruibile all'app, contattando la url `http://127.0.0.1:9001/config./config.json`.
