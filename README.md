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
  `
})
export class AppComponent {
  self = this;

  template = `
  <div>
    <p>Dynamic Component</p>
  </div>`;
}

@NgModule({
  providers: [
    provideComponentOutletModule({
      imports: [CommonModule]
    })
  ],
  declarations: [ComponentOutlet]
})
class AppModule {}
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

## Notes

- `ComponentOutlet` needs `RuntimeCompiler` provided by `platform-browser-dynamic`. You cannot use `platformBrowser` instead of `platformBrowserDynamic`.
  - For AoT compilation, you can use `platformBrowserDynamic().bootstrapModuleFactory()`.
