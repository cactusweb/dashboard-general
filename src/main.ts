import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import * as smoothscroll from 'smoothscroll-polyfill';
import { Buffer } from 'buffer';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

smoothscroll.polyfill();

(window as any).global = window;

global.Buffer = global.Buffer || Buffer;
