import {Component} from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div *componentOutlet="template; context: self; selector:'my-component'"></div>
  `
})
export class AppComponent {
  self = this;

  template = `
  <div>
    <p>Dynamic Component</p>
  </div>`;
}