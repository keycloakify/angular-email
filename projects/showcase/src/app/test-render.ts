import '@angular/compiler';

import { render } from 'angular-email';
import { AppComponent } from './app.component';

render({ component: AppComponent, selector: 'app-root', options: { pretty: true } }).then((html) => {
  console.log(html);
});
