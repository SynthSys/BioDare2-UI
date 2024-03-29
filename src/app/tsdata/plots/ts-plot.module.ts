import {NgModule} from '@angular/core';


import {TSPlotComponent} from './ts-plot.component';
import {TSPlotsComponent} from './ts-plots-component';
import {TSDisplayParamsRFormComponent} from './tsdisplay-params-rform/tsdisplay-params-rform.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgChartsModule} from 'ng2-charts';
import {MaterialsModule} from '../../shared/materials.module';
import {TSSortParamsRFormComponent} from './tssort-params-rform/tssort-params-rform.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MaterialsModule
  ],
  declarations: [
    TSPlotComponent,
    TSPlotsComponent,
    TSDisplayParamsRFormComponent,
    TSSortParamsRFormComponent
  ],
  exports: [
    TSPlotComponent,
    TSPlotsComponent,
    TSDisplayParamsRFormComponent,
    TSSortParamsRFormComponent
  ],
  providers: []
})
export class TSPlotModule {

}
