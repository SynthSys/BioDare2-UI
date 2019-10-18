import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TSImportDashboardComponent } from './tsimport-dashboard.component';
import {MaterialsModule} from '../../../shared/materials.module';
import {AlertModule} from 'ngx-bootstrap';
import {FileAssetModule} from '../../../file-asset/file-asset.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {UploadDataFileStepComponent} from './upload-data-file-step/upload-data-file-step.component';
import {ExperimentsTestToolModule} from '../../experiment_test_tool.spec';
import {ImportDetailsSummaryComponent} from './import-details-summary/import-details-summary.component';
import {DefineTimeStepComponent} from './define-time-step/define-time-step.component';
import {ImportLabelsStepComponent} from './import-labels-step/import-labels-step.component';
import {DataSheetMDTableComponent} from './data-sheet-mdtable/data-sheet-mdtable.component';
import {SelectDataStartStepComponent} from './select-data-start-step/select-data-start-step.component';
import {TSFileService} from './ts-file.service';
import {ImportStepsComponent} from './import-steps/import-steps.component';

describe('TSImportDashboardComponent', () => {
  let component: TSImportDashboardComponent;
  let fixture: ComponentFixture<TSImportDashboardComponent>;

  beforeEach(async(() => {
    /*  let tsFileService = jasmine.createSpyObj('TSFileService', [
      'getTableSlice'
    ]); */
    TestBed.configureTestingModule({
      declarations: [ TSImportDashboardComponent, ImportStepsComponent, UploadDataFileStepComponent, ImportDetailsSummaryComponent,
      DefineTimeStepComponent, ImportLabelsStepComponent, DataSheetMDTableComponent, SelectDataStartStepComponent],
      imports: [MaterialsModule, AlertModule.forRoot(), FileAssetModule, NoopAnimationsModule,
        ExperimentsTestToolModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TSImportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});