import { NgModule, Component, ComponentFactory, ComponentMetadata, NgModuleMetadataType,
	Directive, Input, ViewContainerRef, Compiler, ReflectiveInjector } from '@angular/core';
import { CommonModule } from '@angular/common';
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
	@Input('componentOutletImports') private imports: any[] = [CommonModule, FormsModule];

	constructor(private vcRef: ViewContainerRef, private compiler: Compiler) {}

	private _createDynamicComponent() {
		const metadata = new ComponentMetadata({
			selector: this.selector,
			template: this.template,
		});

		// have the new component class effectively inherit from this component
		let ctx = this.context;
		let cmpClass = class _ {
			prototype:any = ctx;
		 };
		let component = Component(metadata)(cmpClass);

		// make a module that does not inherit from anything except Object
		let mdClass = class _ {
		  prototype: any= {}
		 };

		return NgModule({
			imports: this.imports,
			declarations: [component],
			exports: [component],
			providers: []
		})(mdClass);
	}

	ngOnChanges() {
		let self = this;

		if (!self.template) return;
		console.log(self.template);
		let selfDyn = self._createDynamicComponent();
		console.log(selfDyn);
		self.compiler.compileModuleAndAllComponentsAsync(selfDyn)
		.then(factory => {
			self.vcRef.clear(); // to remove any previously loaded template, if this template is re-created dynamically from the parent
			const injector = ReflectiveInjector.fromResolvedProviders([], self.vcRef.parentInjector);

			let component:any;
			for (let i = factory.componentFactories.length-1; i >= 0; i--) {
				if (factory.componentFactories[i].selector === self.selector) {
					component = factory.componentFactories[i];
					break;
				}
			}

			this.vcRef.createComponent(component, 0, injector);
		});
	}
}
