import { NgModule, Component, ComponentFactory, ComponentMetadata, NgModuleMetadataType,
	Directive, Input, ViewContainerRef, Compiler, ReflectiveInjector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
 *   `,
 *   directives: [ComponentOutlet]
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

 	constructor(private vcRef: ViewContainerRef, private compiler: Compiler) {

 	}

 	private _createDynamicComponent() {
 		const metadata = new ComponentMetadata({
 			selector: this.selector,
 			template: this.template,
 		});

 		const cmpClass = class _ { };
 		cmpClass.prototype = this.context;

 		let component = Component(metadata)(cmpClass);

 		const mdClass = class _ { };
 		mdClass.prototype = {};
 		return NgModule({
 			imports: [BrowserModule, FormsModule],
 			declarations: [component],
 			exports: [component],
 			providers: []
 		})(mdClass);
 	}

 	ngOnChanges() {
 		if (!this.template) return;
 		this.compiler.compileModuleAndAllComponentsAsync(this._createDynamicComponent())
 		.then(factory => {
 			const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
 			this.vcRef.createComponent(factory.componentFactories[0], 0, injector);
 		});
 	}
 }
