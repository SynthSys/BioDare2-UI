import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ExperimentalAssayView} from '../dom/repo/exp/experimental-assay-view';


@Component({
  selector: 'bd2-experiment-navigation',
  template: `
    <div *ngIf="experiment" style="margin-bottom: 2em;">
      <nav class="secondary">
        <a [routerLink]="['/experiments']"><i class="material-icons bd-icon">fast_rewind</i></a>
        <a role="button" (click)="back()" class="shade"><i class="material-icons bd-icon" >arrow_left</i></a>
        <a role="button" (click)="refresh()" class="shade"><i class="material-icons bd-icon">refresh</i></a>
        <a [routerLink]="['.']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Overview</a>
        <a *ngIf="experiment.security.canWrite" [routerLink]="['edit']" routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: true}">Edit</a>
        <a *ngIf="experiment.features.hasTSData" [routerLink]="['.','data','view','ts']" routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: true}">Show data</a>
        <a *ngIf="experiment.features.hasTSData" [routerLink]="['.','data','view','heatmap']" routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: true}">Heatmap</a>
        <!-- we start at new upload<a *ngIf="experiment.security.canWrite && !experiment.features.hasTSData" [routerLink]="['.','data','upload']"
           routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Import data</a>
        <a *ngIf="experiment.security.canWrite && experiment.features.hasTSData" [routerLink]="['.','data','upload']"
           routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Replace data</a> -->
        <a *ngIf="experiment.security.canWrite && experiment.features.hasTSData && !experiment.features.hasPPAJobs"
           [routerLink]="['ppa/new']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Period
          analysis</a>
        <a *ngIf="experiment.features.hasPPAJobs" [routerLink]="['ppa']" routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: false}">Period analysis</a>
        <a *ngIf="(experiment.security.canWrite && experiment.features.hasTSData) || experiment.features.hasRhythmicityJobs"
           [routerLink]="['rhythmicity']" routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: false}">Rhythmicity</a>
        <a *ngIf="experiment.security.canWrite" [routerLink]="['.','data','ts-import']"
           routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          {{experiment.features.hasTSData ? 'Replace data' : 'Import data'}}</a>
        <a [routerLink]="['file']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Files</a>
        <a *ngIf="experiment.security.isOwner || experiment.security.isSuperOwner" [routerLink]="['publish']"
           routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <!-- <img src="assets/Open_Access_logo_small.svg" style="height: 1em;" >-->
          <i class="material-icons bd-icon" style="color: green">lock_open</i>
        </a>
      </nav>
    </div>
  `,
  providers: []
})
export class ExperimentNavigationComponent {

  @Input()
  experiment: ExperimentalAssayView;

  @Output()
  onRefresh: EventEmitter<boolean> = new EventEmitter<boolean>();

  refresh() {
    this.onRefresh.emit(true);
  }

  back() {
    window.history.back();
  }
}
