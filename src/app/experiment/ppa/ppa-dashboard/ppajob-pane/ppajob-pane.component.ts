import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ExperimentalAssayView} from '../../../../dom/repo/exp/experimental-assay-view';
import {PPAJobSummary} from '../../ppa-dom';
import {PhaseParams} from './phases-options-widget.component';
import {PPAService} from '../../ppa.service';
import {FeedbackService} from '../../../../feedback/feedback.service';
// a explanation how to save files https://nils-mehlhorn.de/posts/angular-file-download-progress
// in case I want to remove filesaver
//import * as FileSaver from 'file-saver';

import {  fileSave } from 'browser-fs-access';
import {PPAJobFetcherService} from './services/ppajob-fetcher.service';
import {Reloadable} from './reloadable';
import {PPADialogsService} from '../../ppa-dialogs/ppadialogs.service';
import {shortUUID} from '../../../../shared/collections-util';
import {LocalDateTime} from '../../../../dom/repo/shared/dates';

@Component({
  selector: 'bd2-ppajob-pane',
  templateUrl: './ppajob-pane.component.html',
  styles: [`
    div label {
      margin-bottom: 1em;
    }

    div.btn-wrap {
      display: inline-block;
      margin-bottom: 1em;
    }

    div.btn-wrap label {
      margin-bottom: 4px;
    }

    label.wide {
      min-width: 52px;
    }

  `],
  providers: [PPAJobFetcherService]
})
export class PPAJobPaneComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('ppaStats')
  ppaStatsComponent: Reloadable;
  @ViewChild('ppaResults')
  ppaResultsComponent: Reloadable;
  @ViewChild('ppaPlots')
  ppaPlotsComponent: Reloadable;


  @Input()
  jobId: string;

  @Input()
  assay: ExperimentalAssayView;

  /*
  @Input()
  phaseType = 'ByFit';
  @Input()
  relativeTo = 'zero';
  @Input()
  phaseUnit = 'circ';*/


  @Output()
  deleted = new EventEmitter<PPAJobSummary>();
  @Output()
  finished = this.ppaJobFetcher.finishedJob$; // new EventEmitter<PPAJobSummary>();

  job: PPAJobSummary;



  phaseParams = new PhaseParams('ByFit', 'zero', 'circ');

  // expandedToogleStream = new BehaviorSubject<boolean>(false);

  constructor(private ppaService: PPAService,
              public ppaJobFetcher: PPAJobFetcherService,
              private feedback: FeedbackService,
              private dialogs: PPADialogsService) {

    // console.log("JobPane created");

    this.ppaJobFetcher.on(true);
  }

  // tslint:disable-next-line:variable-name
  private _periodsOn = false;

  get periodsOn(): boolean {
    return this._periodsOn;
  }

  // @Input()
  set periodsOn(val: boolean) {
    this._periodsOn = val;
    // this.periodsToogleStream.next(val);
  }

  // tslint:disable-next-line:variable-name
  private _phasesOn = false;

  get phasesOn(): boolean {
    return this._phasesOn;
  }

  // @Input()
  set phasesOn(val: boolean) {
    this._phasesOn = val;
    // this.phasesToogleStream.next(val);
  }

  // tslint:disable-next-line:variable-name
  private _expanded = false;

  get expanded(): boolean {
    return this._expanded;
  }

  @Input()
  set expanded(val: boolean) {
    this._expanded = val;
    // this.expandedToogleStream.next(val);
  }

  // tslint:disable-next-line:variable-name
  private _statsOn = false;

  get statsOn(): boolean {
    return this._statsOn;
  }

  // resultsToogleStream: Observable<boolean>;// = new BehaviorSubject<boolean>(false);

  // @Input()
  set statsOn(val: boolean) {
    this._statsOn = val;
    // this.statsToogleStream.next(val);
  }


  ngOnInit() {
    this.initSubscriptions();

  }

  ngOnDestroy() {
    this.ppaJobFetcher.close();
  }

  ngOnChanges(changes: SimpleChanges) {

    // console.log("Changes", changes);

    if (changes['jobId'] || changes['assay']) {
      if (this.jobId && this.assay) {
        // this.loadJob(this.jobId, this.assay.id);
        this.ppaJobFetcher.assayJobId([this.assay.id, this.jobId]);
      }
    }

  }

  phaseOptions(params: PhaseParams) {
    // console.log("Ph"+this.jobId, params);
    // this.phaseParamsStream.next(params);
    this.phaseParams = params;
  }

  export() {

    this.dialogs.exportJob(this.phaseParams.phaseType).subscribe(
      resp => {
        if (resp) {
          // console.log("Exporting...");
          this.ppaService.downloadPPAJob(this.assay.id, this.jobId, resp)
            .then(blob => {
              // console.log("ER", ans);
              // let blob = new Blob([ans], {type: 'text/csv'});
              // let blob = ans.blob();
              // console.log("B", blob);
              this.saveJobBlob(blob, this.assay.id, this.jobId);
            });
        } else {
          // console.log("Cancelled");
        }
      }
    );
    /*
    this.exportDialog.show(this.phaseParams.phaseType)
      .then(resp => {
        if (resp) {
          // console.log("Exporting...");
          this.ppaService.downloadPPAJob(this.assay.id, this.jobId, resp)
            .then(blob => {
              // console.log("ER", ans);
              // let blob = new Blob([ans], {type: 'text/csv'});
              // let blob = ans.blob();
              // console.log("B", blob);
              this.saveJobBlob(blob, this.assay.id, this.jobId);
            });
        } else {
          // console.log("Cancelled");
        }
      });

     */
  }

  saveJobBlob(blob: Blob, expId: number, jobId: string) {
    // FileSaver.saveAs(blob, expId + '_job' + jobId + '.ppa.csv');
    // let url= window.URL.createObjectURL(blob);
    // console.log("U",url);
    // window.open(url);

    const opt = {
      fileName: expId + '_job' + jobId + '.ppa.csv',
      extensions: ['.csv']
    }

    fileSave(blob, opt)
      .then( v => {
        //console.log('Saved export');
      })
      .catch( v => console.log('could not save export', v));
  }

  delete() {
    // in case they change when dialog is on
    const exp = this.assay;
    const job = this.job;

    this.dialogs.confirm('Do you want to delete analysis: ' + job.jobId,
        job.summary
      ).subscribe(ans => {
        if (ans) {
          this.doDelete(exp, job.jobId);
        }
    });

    /*
    if (this.confirmDialog) {
      this.confirmDialog.ask('Do you want to delete analysis: ' + job.jobId,
        job.summary
      ).then(ans => {
        if (ans) {
          this.doDelete(exp, job.jobId);
        }
      });
    } else {
      console.log('Confirmation dialog missing on job pane');
      this.doDelete(exp, job.jobId);
    } */
  }

  doDelete(exp: ExperimentalAssayView, jobId: string) {
    // console.log("Delete");
    this.ppaService.deletePPAJob(exp, jobId)
      .then(job => {
        this.deleted.next(job);
        this.feedback.success('Job: ' + job.jobId + ' deleted');
      })
      .catch(reason => {
        this.feedback.error(reason);
      });
  }

  refresh() {
    this.ppaJobFetcher.refresh();
  }

  reload() {
    this.expanded = true;
    this.refresh();
    if (this.ppaPlotsComponent) { this.ppaPlotsComponent.reload(); }
    if (this.ppaStatsComponent) { this.ppaStatsComponent.reload(); }
    if (this.ppaResultsComponent) { this.ppaResultsComponent.reload(); }
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    // this.expandedToogleStream.next(this.expanded);
  }

  toggleStats() {
    this.statsOn = !this.statsOn;
    // this.statsToogleStream.next(this.statsOn);
  }

  togglePeriods() {
    this.periodsOn = !this.periodsOn;

    // if (this.periodsOn) this.resultsToogleStream.next(true);
  }

  togglePhases() {
    this.phasesOn = !this.phasesOn;
    // this.phasesToogleStream.next(this.phasesOn);
    // if (this.phasesOn) this.resultsToogleStream.next(true);
  }


  initSubscriptions() {

    this.ppaJobFetcher.error$.subscribe(
      err => this.feedback.error(err)
    );


    /*
    this.expandedToogleStream.subscribe(
      exp => {
        // job fetcher should always be on
        // this.ppaJobFetcher.on(exp);
      }
    ); */

    // this.jobStream.subscribe(j => this.job = j);
    this.ppaJobFetcher.allJob$.subscribe(j => this.job = j);



  }


  simplifyJobState(job: PPAJobSummary) {
    /*if (job.status.state === 'SUCCESS') {
     return 'FINISHED';
     }*/
    return job.state;
  }


  isFinished(job: PPAJobSummary): boolean {

    return this.ppaJobFetcher.isFinished(job);

  }

  shortUUID(id: string) {
    return shortUUID(id);
  }

  toLocalDateTime(val: any) {
    return LocalDateTime.deserialize(val).date;
  }



}
