# angular2-component-outlet

```
$ npm install --save angular2-component-outlet
```

`ComponentOutlet` is a directive to create dynamic component.

Example: 

```ts
@Component({
  selector: 'my-app',
  template: `
    <div *componentOutlet="template; context: self; selector:'my-component'"></div>
  `,
  directives: [ComponentOutlet]
})
export class AppComponent {
  self = this;

  template = `
  <div>
    <p>Dynamic Component</p>
  </div>`;
}
```

Result: 

```html
<my-app>
    <my-component>
        <div>
            <p>Dynamic Component</p>
        </div>
    </my-component>
</my-app>
```
