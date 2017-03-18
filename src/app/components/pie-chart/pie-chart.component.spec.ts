/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PieChartComponent } from './pie-chart.component';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
      expect(component).toBeTruthy();
  });

  it('#rePaint must not crash', ()=> {
      component.rePaint();
      component.changeValues([0, 0, 0, 40]);  //testing the cases with 0-values and total < 100
      component.rePaint();
  });

  it('#setValues must work properly', ()=>{
    component.changeValues([1, 12, 13, 11]);
    expect(component.values[0]).toBe(1);
    expect(component.values[1]).toBe(12);
    expect(component.values[2]).toBe(13);
    expect(component.values[3]).toBe(11);
  });
});
