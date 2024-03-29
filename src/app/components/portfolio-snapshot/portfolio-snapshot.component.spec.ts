/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PortfolioSnapshotComponent } from './portfolio-snapshot.component';

describe('PortfolioSnapshotComponent', () => {
  let component: PortfolioSnapshotComponent;
  let fixture: ComponentFixture<PortfolioSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioSnapshotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
});
