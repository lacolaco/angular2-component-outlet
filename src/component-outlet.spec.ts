import {TestBed, async} from '@angular/core/testing';
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ComponentOutlet, provideComponentOutletModule} from '../index';

@Component({
    template: `<div *componentOutlet="template; context: context; selector:'my-component'"></div>`
})
class TestCmp {
    context = {
        flag: true,
        text: 'Dynamic'
    };
    template = `<div><p *ngIf="flag">{{text}}</p></div>`;
}

@Component({
    template: `
    <ng-container *ngFor="let cmp of list">
        <div *componentOutlet="cmp.template; context: cmp.context; selector:cmp.selector"></div>
    </ng-container>
    `
})
class MultipleCmp {
    list = [
        {
            template: `<div>{{text}}</div>`,
            context: {
                text: 'Dynamic-1'
            },
            selector: 'my-component'
        },
        {
            template: `<div>{{text}}</div>`,
            context: {
                text: 'Dynamic-2'
            },
            selector: 'my-component'
        }
    ]
}

describe('ComponentOutlet', () => {

    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [ComponentOutlet, MultipleCmp, TestCmp],
            providers: [
                provideComponentOutletModule({
                    imports: [CommonModule]
                })
            ]
        });
        TestBed.compileComponents().then(() => done());
    });

    it('simple', async(() => {
        const fixture = TestBed.createComponent(TestCmp);
        fixture.detectChanges();
        fixture.ngZone.onStable.subscribe(() => {
            const dynamicCmp = fixture.debugElement.query(el => el.name === 'my-component')
            console.log(dynamicCmp.nativeElement.innerHTML);
            expect(dynamicCmp.nativeElement.textContent).toBe('Dynamic');
        });
    }));

    it('multiple', async(() => {
        const fixture = TestBed.createComponent(MultipleCmp);
        fixture.detectChanges();
        fixture.ngZone.onStable.subscribe(() => {
            const dynamicCmps = fixture.debugElement.queryAll(el => el.name === 'my-component');
            expect(dynamicCmps.length).toBe(2);
            dynamicCmps.forEach((dynamicCmp, index) => {
                console.log(dynamicCmp.nativeElement.innerHTML);
                expect(dynamicCmp.nativeElement.textContent).toBe(`Dynamic-${index + 1}`);
            });
        });
    }));
});