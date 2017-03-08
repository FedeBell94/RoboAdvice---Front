/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PieChart3dComponent } from './pie-chart-3d.component';

describe('PieChart3dComponent', () => {
  let component: PieChart3dComponent;
  let fixture: ComponentFixture<PieChart3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChart3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChart3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
