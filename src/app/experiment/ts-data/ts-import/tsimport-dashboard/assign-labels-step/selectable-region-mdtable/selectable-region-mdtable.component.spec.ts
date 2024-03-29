import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SelectableRegionMDTableComponent} from './selectable-region-mdtable.component';
import {MaterialsModule} from '../../../../../../shared/materials.module';

describe('SelectableRegionMDTableComponent', () => {
  let component: SelectableRegionMDTableComponent;
  let fixture: ComponentFixture<SelectableRegionMDTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectableRegionMDTableComponent ],
      imports: [MaterialsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectableRegionMDTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
