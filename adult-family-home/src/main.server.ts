import { AppServerModule } from './app/app.server.module';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';

export default {
  bootstrap: () => bootstrapApplication(AppServerModule, {
    providers: [provideServerRendering()]
  })
};
