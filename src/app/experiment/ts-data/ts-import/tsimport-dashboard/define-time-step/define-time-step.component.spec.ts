import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DefineTimeStepComponent} from './define-time-step.component';
import {MaterialsModule} from '../../../../../shared/materials.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {DataSheetMDTableComponent} from '../data-sheet-mdtable/data-sheet-mdtable.component';
import {TSFileService} from '../ts-file.service';
import {DataTableService} from '../data-table.service';

describe('DefineTimeStepComponent', () => {
  let component: DefineTimeStepComponent;
  let fixture: ComponentFixture<DefineTimeStepComponent>;
  let tsFileService;
  beforeEach(waitForAsync(() => {

    tsFileService = jasmine.createSpyObj('TSFileService', [
      'getTableSlice'
    ]);

    TestBed.configureTestingModule({
      declarations: [ DefineTimeStepComponent, DataSheetMDTableComponent ],
      imports: [MaterialsModule, NoopAnimationsModule, FormsModule],
      providers: [{provide: TSFileService, useValue: tsFileService}, DataTableService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineTimeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
