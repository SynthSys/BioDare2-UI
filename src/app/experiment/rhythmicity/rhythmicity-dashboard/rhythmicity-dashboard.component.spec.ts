import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RhythmicityDashboardComponent} from './rhythmicity-dashboard.component';
import {ExperimentsTestToolModule} from '../../experiment_test_tool.spec';
import {RhythmicityJobPaneComponent} from './rhythmicity-job-pane/rhythmicity-job-pane.component';
import {PValueFormComponent} from './rhythmicity-job-pane/pvalue-form/pvalue-form.component';
import {RhythmicityResultsTableComponent} from './rhythmicity-job-pane/rhythmicity-results-table/rhythmicity-results-table.component';
import {RhythmicityResultsMDTableComponent} from "./rhythmicity-job-pane/rhythmicity-results-mdtable/rhythmicity-results-mdtable.component";
import {MatFormFieldModule, MatPaginatorModule, MatRadioModule, MatSortModule, MatTableModule} from "@angular/material";

describe('RhythmicityDashboardComponent', () => {
  let component: RhythmicityDashboardComponent;
  let fixture: ComponentFixture<RhythmicityDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RhythmicityDashboardComponent, RhythmicityJobPaneComponent, PValueFormComponent,
        RhythmicityResultsTableComponent, RhythmicityResultsMDTableComponent],
      imports: [ExperimentsTestToolModule,
        MatRadioModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhythmicityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
