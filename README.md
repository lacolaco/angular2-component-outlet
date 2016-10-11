# angular2-component-outlet

[![npm version](https://badge.fury.io/js/angular2-component-outlet.svg)](https://badge.fury.io/js/angular2-component-outlet)
[![CircleCI](https://circleci.com/gh/laco0416/angular2-component-outlet/tree/master.svg?style=svg)](https://circleci.com/gh/laco0416/angular2-component-outlet/tree/master)

```
$ npm install --save angular2-component-outlet
```

Current Angular Version: **2.0.2**

**Live Demo**: [Plunker](https://plnkr.co/edit/dhRQ3U?p=preview)

---

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
