import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RhythmicityDashboardComponent} from './rhythmicity-dashboard/rhythmicity-dashboard.component';
import {RhythmicityRoutingModule} from './rhythmicity-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StaticContentModule} from '../../documents/static-content/static-content.module';
import {RhythmicityStartFormComponent} from './rhythmicity-start-form/rhythmicity-start-form.component';
// tslint:disable-next-line:max-line-length
import {RhythmicityjobParamsRformComponent} from './rhythmicity-start-form/rhythmicityjob-params-rform/rhythmicityjob-params-rform.component';
import {TSPlotModule} from '../../tsdata/plots/ts-plot.module';
import {RhythmicityJobPaneComponent} from './rhythmicity-dashboard/rhythmicity-job-pane/rhythmicity-job-pane.component';
import {PValueFormComponent} from './rhythmicity-dashboard/rhythmicity-job-pane/pvalue-form/pvalue-form.component';
// tslint:disable-next-line:max-line-length
import {RhythmicityResultsMDTableComponent} from './rhythmicity-dashboard/rhythmicity-job-pane/rhythmicity-results-mdtable/rhythmicity-results-mdtable.component';
import {MaterialsModule} from '../../shared/materials.module';
// tslint:disable-next-line:max-line-length
import {StatTestOptionsWidgetComponent} from './rhythmicity-dashboard/rhythmicity-job-pane/stat-test-options-widget/stat-test-options-widget.component';

@NgModule({
  declarations: [RhythmicityDashboardComponent, RhythmicityStartFormComponent, RhythmicityjobParamsRformComponent,
    RhythmicityJobPaneComponent,
    PValueFormComponent,
    RhythmicityResultsMDTableComponent,
    StatTestOptionsWidgetComponent
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StaticContentModule,
    TSPlotModule,

    MaterialsModule,
    RhythmicityRoutingModule
  ]
})
export class RhythmicityModule {
}
