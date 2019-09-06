import {NgModule} from '@angular/core';


import {TSPlotComponent} from './ts-plot.component';
import {TSPlotsComponent} from './ts-plots-component';
import {TSDisplayParamsRFormComponent} from './tsdisplay-params-rform/tsdisplay-params-rform.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  declarations: [
    TSPlotComponent,
    TSPlotsComponent,
    TSDisplayParamsRFormComponent
  ],
  exports: [
    TSPlotComponent,
    TSPlotsComponent,
    TSDisplayParamsRFormComponent
  ],
  providers: []
})
export class TSPlotModule {

}