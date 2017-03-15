import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultStrategiesComponent } from './default-strategies.component';

describe('DefaultStrategiesComponent', () => {
  let component: DefaultStrategiesComponent;
  let fixture: ComponentFixture<DefaultStrategiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultStrategiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultStrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
});
