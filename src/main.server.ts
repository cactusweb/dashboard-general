import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
import { AppModule } from 'app/app.module';

export { AppServerModule } from './app/app.server.module';

const bootstrap = () => bootstrapApplication(AppModule);

export default bootstrap;
