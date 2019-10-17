import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataTableDependentStep} from '../data-table-dependent-step';
import {DataTableService} from '../data-table.service';
import {FeedbackService} from '../../../../feedback/feedback.service';
import {CellSelection, DataTableSlice} from '../data-table-dom';

@Component({
  selector: 'bd2-select-data-start-step',
  templateUrl: './select-data-start-step.component.html',
  styles: [],
  providers: [ DataTableService],
  // tslint:disable-next-line:no-inputs-metadata-property
  inputs: ['importDetails']
})
export class SelectDataStartStepComponent extends DataTableDependentStep implements OnInit, OnDestroy {

  constructor(dataService: DataTableService, feedback: FeedbackService) {
    super(dataService, feedback);
  }


  setDataSlice(dataSlice: DataTableSlice) {
    super.setDataSlice(dataSlice);

    if (this.firstTimeCell) {
      this.selectFirstTime(this.reselect(this.firstTimeCell));
    }

    if (this.labelsSelection) {
      this.selectLabels(this.reselect(this.labelsSelection));
    }

    if (this.dataStart) {
      this.selectDataStart(this.reselect(this.dataStart));
    } else {
      // let set data to the next row col after time
      if (this.firstTimeCell) {
        this.selectDataStart(this.reselect(
          new CellSelection(
            this.firstTimeCell.colIx + 1, undefined, undefined,
            this.firstTimeCell.rowIx + 1, undefined, undefined, undefined
          )));
      }
    }
  }

}
