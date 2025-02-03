import '@angular/compiler';

import { render } from 'angular-email';
import { writeFileSync } from 'node:fs';
import { AppComponent } from './app.component';

render({ component: AppComponent, selector: 'app-root', options: { pretty: true } }).then((html) => {
  writeFileSync('projects/showcase/src/app/test.html', html);
});
