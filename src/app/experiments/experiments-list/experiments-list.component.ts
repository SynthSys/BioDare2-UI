import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../auth/user.service';
import {FeedbackService} from '../../feedback/feedback.service';
import {ExperimentService} from '../../experiment/experiment.service';
import {ExperimentSummary} from '../../dom/repo/exp/experiment-summary';

@Component({
  template: `
    <div>
      <h2 class="float-left">Experiments
        <a (click)="refresh()" role="button" aria-label="refresh">
            <i class="material-icons bd-icon-inh bd-primary" style="font-size: larger;">refresh</i>
            <!--<span class="glyphicon glyphicon-repeat" aria-hidden="true"></span>-->
        </a>
      </h2>
      <div class="float-right">
        <mat-slide-toggle [(ngModel)]="showPublic">Show public</mat-slide-toggle>
      </div>

      <div class="clearfix"></div>

      <div *ngIf="!experiments || experiments.length < 1" class="alert alert-info">
        There are no experiments visible to you.
      </div>

      <div class="list-group">
        <bd2-experiment-summary *ngFor="let exp of experiments" [exp]="exp" >
        </bd2-experiment-summary>
      </div>

    </div>
  `,
  styles: []
})
export class ExperimentsListComponent implements OnInit, OnDestroy {

  experiments: ExperimentSummary[];

  constructor(private experimentService: ExperimentService,
              private feedback: FeedbackService,
              private userService: UserService) {
  }

  _showPublic = false;

  get showPublic(): boolean {
    return this._showPublic;
  }

  set showPublic(val: boolean) {
    this._showPublic = val;
    this.refresh();
  }

  ngOnInit() {
    this.showPublic = !this.userService.isLoggedIn();
    this.loadExperiments();
  }

  ngOnDestroy(): void {
  }

  refresh() {
    this.loadExperiments();
  }

  loadExperiments() {
    const onlyOwned = !this.showPublic;
    this.experimentService.getExperiments(onlyOwned)
      .then(exps => {
        this.experiments = exps;
      })
      .catch(reason => {
        this.feedback.error(reason);
      });
  }

}