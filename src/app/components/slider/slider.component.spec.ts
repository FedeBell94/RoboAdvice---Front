/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', ()=> {
    expect(component).toBeTruthy();
  });

  it('#rePaint must not crash', ()=> {
    component.repaint();
  });

  it('#computeValue must not crash with limit values', ()=> {
      component['computeValue']({clientX: 100, clientY: 100});
      component['computeValue']({clientX: -1, clientY: 100});
      component['computeValue']({clientX: 100, clientY: -100});
      component['computeValue']({clientX: 100, clientY: 0});
      component['computeValue']({clientX: 100, clientY: 100000});
  });

  it('#setManually should set values properly', ()=> {
      let testCases = [
        {
          config: {max: 10, maxAllowed: 10, value: 0, step: 1},
          expected: {max: 10, maxAllowed: 10, value: 0, step: 1}
        },
        {
          config: {max: 10, maxAllowed: 11, value: 0, step: 1},
          expected: {max: 10, maxAllowed: 10, value: 0, step: 1}
        },
        {
          config: {max: 10, maxAllowed: 10, value: 11, step: 1},
          expected: {max: 10, maxAllowed: 10, value: 10, step: 1}
        },
        {
          config: {max: 10, maxAllowed: 6, value: 7, step: 1},
          expected: {max: 10, maxAllowed: 6, value: 6, step: 1}
        },
        {
          config: {max: 10, maxAllowed: 10, value: 0, step: 1},
          expected: {max: 10, maxAllowed: 10, value: 0, step: 1}
        },
        {
          config: {max: 10, maxAllowed: 10, value: 0, step: 1},
          expected: {max: 10, maxAllowed: 10, value: 0, step: 1}
        },
        {
          config: {max: 10, maxAllowed: 10, value: 0, step: 1},
          expected: {max: 10, maxAllowed: 10, value: 0, step: 1}
        }
      ];
      
      for (let i = 0; i < testCases.length; i++) {
        component.setManually(testCases[i].config);
        for (let j in testCases[i].expected) expect(component[j]).toEqual(testCases[i].expected[j]);
      }
  });
  
});
