import {
  Component,
  ComponentMetadata,
  ComponentFactoryResolver,
  ComponentRef,
  Compiler,
  Directive,
  Inject,
  Input,
  NgModule,
  NgModuleMetadataType,
  Type,
  ViewContainerRef,
  ReflectiveInjector
} from '@angular/core';

import {COMPONENT_OUTLET_MODULE} from './provider';

/**
 * ComponentOutlet is a directive to create dynamic component.
 * 
 * Example: 
 * 
 * ```ts
 * @Component({
 *   selector: 'my-app',
 *   template: `
 *     <div *componentOutlet="template; context: self; selector:'my-component'"></div>
 *   `
 * })
 * export class AppComponent {
 *   self = this;
 * 
 *   template = `
 *   <div>
 *     <p>Dynamic Component</p>
 *   </div>`;
 * }
 * ```
 * 
 * Result: 
 * 
 * ```html
 * <my-component>
 *    <div>
 *      <p>Dynamic Component</p>
 *    </div>
 * </my-component>
 * ```
 * 
 */
@Directive({
  selector: '[componentOutlet]',
})
export class ComponentOutlet {
  @Input('componentOutlet') private template: string;
  @Input('componentOutletSelector') private selector: string;
  @Input('componentOutletContext') private context: Object;

  component: ComponentRef<any>;

  constructor(
    @Inject(COMPONENT_OUTLET_MODULE) private moduleMeta: NgModuleMetadataType,
    private vcRef: ViewContainerRef,
    private compiler: Compiler
  ) { }

  private _createDynamicComponent(): Type<any> {
    this.context = this.context || {};

    const metadata = new ComponentMetadata({
      selector: this.selector,
      template: this.template,
    });

    const cmpClass = class _ { };
    cmpClass.prototype = this.context;
    return Component(metadata)(cmpClass);
  }

  private _createDynamicModule(componentType: Type<any>) {
    const declarations = this.moduleMeta.declarations || [];
    declarations.push(componentType);
    this.moduleMeta.declarations = declarations;
    return NgModule(this.moduleMeta)(class _ { })
  }

  ngOnChanges() {
    if (!this.template) return;
    const cmpType = this._createDynamicComponent();
    const moduleType = this._createDynamicModule(cmpType);
    const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
    this.compiler.compileModuleAndAllComponentsAsync<any>(moduleType)
      .then(factory => {
        let cmpFactory: any;
        for (let i = factory.componentFactories.length - 1; i >= 0; i--) {
          if (factory.componentFactories[i].selector === this.selector) {
            cmpFactory = factory.componentFactories[i];
            break;
          }
        }
        return cmpFactory;
      })
      .then(cmpFactory => {
        if (cmpFactory) {
          this.vcRef.clear();
          this.component = this.vcRef.createComponent(cmpFactory, 0, injector);
          this.component.changeDetectorRef.detectChanges();
        }
      });
  }
}
