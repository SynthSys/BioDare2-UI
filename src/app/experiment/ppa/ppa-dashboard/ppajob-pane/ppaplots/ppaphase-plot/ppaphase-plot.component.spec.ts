import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PPAPhasePlotComponent} from './ppaphase-plot.component';
import {PolarPlotModule} from 'bd2-ngx-polarplot';

describe('PPAPhasePlotComponent', () => {
  let component: PPAPhasePlotComponent;
  let fixture: ComponentFixture<PPAPhasePlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PolarPlotModule],
      declarations: [ PPAPhasePlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPAPhasePlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
