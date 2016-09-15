import {NgModule} from '@angular/core';
import {ComponentOutlet, provideComponentOutletModule} from '../index';
import {AppComponent} from './app.component';

@NgModule({
  providers: [
    provideComponentOutletModule({
    })
  ],
  declarations: [ComponentOutlet, AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}