import {TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ComponentOutlet, provideComponentOutletModule} from '../index';

@Component({
    template: `<div *componentOutlet="template; context: context; selector:'my-component'"></div>`
})
class TestComponent {
    context = {
        flag: true,
        text: 'Dynamic'
    };
    template = `<div><p *ngIf="flag">{{text}}</p></div>`;
}

describe('ComponentOutlet', () => {

    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, ComponentOutlet],
            providers: [
                provideComponentOutletModule({
                    imports: [CommonModule]
                })
            ]
        });
        TestBed.compileComponents().then(() => done());
    });

    it('simple', (done) => {
        const fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        fixture.ngZone.onStable.subscribe(() => {
            const dynamicCmp = fixture.debugElement.query(el => el.name === 'my-component')
            console.log(dynamicCmp.nativeElement.innerHTML);
            expect(dynamicCmp.nativeElement.textContent).toBe('Dynamic');
            done();
        });
    });
});