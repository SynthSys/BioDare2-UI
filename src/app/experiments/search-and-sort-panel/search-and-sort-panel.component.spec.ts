import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchAndSortPanelComponent} from './search-and-sort-panel.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialsModule} from '../../shared/materials.module';
import {SortSwitchComponent} from './sort-switch/sort-switch.component';

describe('SearchAndSortPanelComponent', () => {
  let component: SearchAndSortPanelComponent;
  let fixture: ComponentFixture<SearchAndSortPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAndSortPanelComponent, SortSwitchComponent ],
      imports: [ReactiveFormsModule, MaterialsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAndSortPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
