import { NgModule, inject, InjectionToken } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';


export const SSR_BUSINESS_ID = new InjectionToken<string>('SSR_BUSINESS_ID', {
  factory: () => inject(Symbol.for('SSR_BUSINESS_ID') as any),
});

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppServerModule {}
