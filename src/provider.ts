import {OpaqueToken, NgModuleMetadataType} from '@angular/core';

/**
 * @internal
 */
export const COMPONENT_OUTLET_MODULE = new OpaqueToken('COMPONENT_OUTLET_MODULE');

/**
 * Setup for ComponentOutlet
 * 
 * ```ts
 * @NgModule({
 *   providers: [
 *     provideComponentOutletModule({
 *       imports: [CommonModule]
 *     })
 *   ],
 *   declarations: [ComponentOutlet]
 * })
 * class AppModule {}
 * ```
 */
export function provideComponentOutletModule(metadata: NgModuleMetadataType): any[] {
    return [
        { provide: COMPONENT_OUTLET_MODULE, useValue: metadata }
    ];
}