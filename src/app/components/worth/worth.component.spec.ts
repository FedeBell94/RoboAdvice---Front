/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WorthComponent } from './worth.component';

describe('WorthComponent', () => {
  let component: WorthComponent;
  let fixture: ComponentFixture<WorthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
