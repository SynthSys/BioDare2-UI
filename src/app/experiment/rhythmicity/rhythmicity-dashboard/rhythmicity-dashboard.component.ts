import {Component, QueryList, ViewChildren} from '@angular/core';
import {RhythmicityBaseComponent} from '../rhythmicity-base.component';
import {RhythmicityService} from '../rhythmicity.service';
import {ExperimentComponentsDependencies} from '../../experiment-components.dependencies';

import {ExperimentalAssayView} from '../../../dom/repo/exp/experimental-assay-view';
import {RhythmicityJobSummary} from '../rhythmicity-dom';

import {RhythmicityJobPaneComponent} from './rhythmicity-job-pane/rhythmicity-job-pane.component';


@Component({
  templateUrl: './rhythmicity-dashboard.component.html',
  styles: []
})
export class RhythmicityDashboardComponent extends RhythmicityBaseComponent {



  jobs: RhythmicityJobSummary[];
  jobsIds: string[];

  expandAll = false;

  // hasFinished = false;
  // queuing: number;
  blocked = false;

  exportURL: string;

  @ViewChildren(RhythmicityJobPaneComponent)
  panes: QueryList<RhythmicityJobPaneComponent>;

  constructor(
    rhythmicityService: RhythmicityService,
    serviceDependencies: ExperimentComponentsDependencies) {
    super(rhythmicityService, serviceDependencies);

    this.titlePart = ' Rhythm';

  }

  protected updateModel(exp: ExperimentalAssayView) {
    super.updateModel(exp);
    if (exp) {
      this.loadJobs(exp);
    }
  }

  protected loadJobs(exp: ExperimentalAssayView, refresh = false) {
    // console.log("Dashboard loading jobs");
    this.blocked = true;
    this.rhythmicityService.getJobs(exp).subscribe(
      jobs => {
        this.jobs = jobs;
        this.refreshJobsInfo(jobs);
        this.exportURL = this.rhythmicityService.exportURL(exp);
        if (refresh) {
          this.refreshPanes();
        }
        this.blocked = false;
      },
      reason => {
        this.blocked = false;
        this.feedback.error(reason);
      }
    );
  }

  protected refreshJobsInfo(jobs: RhythmicityJobSummary[]) {
    this.jobsIds = jobs.map(j => j.jobId);
    // this.queuing = this.calculateQueuing(jobs);
    // this.hasFinished = this.checkFinished(jobs);
  }


  refresh() {
    this.loadJobs(this.assay, true);
  }

  refreshPanes() {
      if (this.panes) {
        this.panes.forEach(pane => pane.refresh());
      }

  }

  remove(job: RhythmicityJobSummary) {
    // this.blocked = true;
    const ix = this.jobs.findIndex(j => job.jobId === j.jobId);
    if (ix >= 0) {
      this.jobs.splice(ix, 1);
      this.refreshJobsInfo(this.jobs);
    }
    // this.blocked = false;
  }

  refreshJob(job: RhythmicityJobSummary) {
    // console.log("Refresh", job);
    // this.blocked = true;
    const ix = this.jobs.findIndex(j => job.jobId === j.jobId);
    if (ix >= 0) {
      this.jobs[ix] = job;
      this.refreshJobsInfo(this.jobs);
    }
    // this.blocked = false;
  }



  protected calculateQueuing(jobs: RhythmicityJobSummary[]) {

    return jobs.filter(j => this.isQueueing(j.jobStatus.state)).length;

  }

  protected isQueueing(state: string): boolean {
    switch (state) {
      case 'WAITING':
        return true;
      case 'PROCESSING':
        return true;
      case 'SUBMITTED':
        return true;
      default:
        return false;
    }

  }

  protected checkFinished(jobs: RhythmicityJobSummary[]): boolean {

    return !!jobs.find(j => this.isFinished(j.jobStatus.state));

  }

  protected isFinished(state: string): boolean {
    switch (state) {
      case 'SUCCESS':
        return true;
      case 'FINISHED':
        return true;
      case 'COMPLETED':
        return true;
      default:
        return false;
    }

  }


}
