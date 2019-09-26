import { DataSource } from '@angular/cdk/collections';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {catchError, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import {Observable, merge, combineLatest, BehaviorSubject, Subject, of} from 'rxjs';
import {BD2eJTKRes, JobResults, RhythmicityJobSummary, TSResult} from '../../rhythmicity-dom';
import {RhythmicityService} from '../../rhythmicity.service';
import {ExperimentalAssayView} from '../../../../dom/repo/exp/experimental-assay-view';


/**
 * Data source for the RhythmicityResultsMDTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class RhythmicityResultsMDTableDataSource extends DataSource<TSResult<BD2eJTKRes>> {

  readonly allData$: Observable<TSResult<BD2eJTKRes>[]>;

  dataLength = 0;
  data: TSResult<BD2eJTKRes>[] = [];

  private job$ = new BehaviorSubject<[ExperimentalAssayView, RhythmicityJobSummary]>(null);
  private readonly pvalue$ = new BehaviorSubject<number>(0);
  private readonly page$ = new BehaviorSubject<PageEvent>(null);
  private readonly sort$ = new BehaviorSubject<Sort>(null);
  private readonly on$ = new BehaviorSubject<boolean>(false);
  private readonly refresh$ = new BehaviorSubject<boolean>(false);


  constructor(private rhythmicityService: RhythmicityService) {
    super();

    this.allData$ = this.initData();
  }

  assayJob(def: [ExperimentalAssayView, RhythmicityJobSummary]) {
    if (def && def[0] && def[1]) {
      this.job$.next(def);
    }
  }

  pvalue(val: number) {
    if (val != null && val !== undefined) {
      this.pvalue$.next(val);
    }
  }

  page(page: PageEvent) {
    this.page$.next(page);
  }

  sort(sort: Sort) {
    this.sort$.next(sort);
  }

  on(state = true) {
    this.on$.next(state);
  }

  refresh() {
    this.refresh$.next(true);
  }

  initData(): Observable<TSResult<BD2eJTKRes>[]> {

    const newJob$ = this.initJobs();

    const results = newJob$.pipe(
      // tap( p => console.log('Job Pair', p)),
      switchMap(([assay, job]) => this.isFinished(job) ? this.loadResults(assay, job) : of(new JobResults<BD2eJTKRes>())),
      tap( res => this.labelPatterns(res))
    );

    const rankedResults = combineLatest( [results, this.pvalue$]).pipe(
      // tap( p => console.log('Results pvalue', p)),
      map(([jobRes, pvalue]) => {
        this.rankResults(jobRes, pvalue);
        return jobRes.results;
      } ),
      tap(d => {
        this.dataLength = d.length;
        this.data = d;
      })
    );

    return rankedResults;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TSResult<BD2eJTKRes>[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.allData$,
      this.sort$,
      this.page$,
    ];

    return combineLatest(dataMutations).pipe(
      // tap( p => console.log('Changes', p)),
      map( ([results, sort, page]) => {
        const res = this.getSortedData(results as TSResult<BD2eJTKRes>[], sort as Sort);
        return [res, page];
      }),
      map( ([results, page]) => this.getPagedData(results as TSResult<BD2eJTKRes>[], page as PageEvent))
    );

  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  isFinished(job: RhythmicityJobSummary) {
    if (!job) { return false; }
    return job.jobStatus.state === 'SUCCESS';
  }

  private initJobs(): Observable<[ExperimentalAssayView, RhythmicityJobSummary]> {
    const onJob$ = combineLatest( [this.job$, this.on$]).pipe(
      filter( ([job, isOn]) => job && isOn),
      map( ([job, isOn]) => job)
    );

    const distinctJob$ = onJob$.pipe(
      distinctUntilChanged( (
                            def1: [ExperimentalAssayView, RhythmicityJobSummary],
                            def2: [ExperimentalAssayView, RhythmicityJobSummary]) =>
                  def1[1].jobId === def2[1].jobId && def1[0].id === def2[0].id
    ));


    const refreshedJob$ = combineLatest([ onJob$, this.refresh$]).pipe(
      filter( ([job, isRef]) => isRef),
      map( ([job, isRef]) => job)
    );

    const merged = merge(distinctJob$, refreshedJob$);

    return merged;

  }


  private labelPatterns(jobRes: JobResults<BD2eJTKRes>) {

    jobRes.results.forEach( res => res.result.patternLabel = this.describePattern(res.result) );
  }

  private describePattern(res: BD2eJTKRes) {
    const pattern = res.pattern;
    const peak = Math.round(pattern.peak * 10) / 10;
    return `${pattern.waveform} ${pattern.period}:${peak}`;
  }

  private rankResults(jobRes: JobResults<BD2eJTKRes>, pvalue: number) {
    jobRes.results.forEach( res => {
      const ejtkR = res.result;
      ejtkR.rhythmic = ejtkR.empP < pvalue;
    });
  }


  private loadResults(assay: ExperimentalAssayView, job: RhythmicityJobSummary): Observable<JobResults<BD2eJTKRes>> {
    return this.rhythmicityService.getResults(assay.id, job.jobId).pipe(
      tap( r => console.log('Fetching results', r)),
      catchError( err => {
        console.error('Could not load results', err);
        return of(new JobResults<BD2eJTKRes>());
      })
    );
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TSResult<BD2eJTKRes>[], page: PageEvent): TSResult<BD2eJTKRes>[] {
    if (!page) {
      return [];
    }

    const startIndex = page.pageIndex * page.pageSize;

    return data.slice().splice(startIndex, page.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TSResult<BD2eJTKRes>[], sort: Sort) {
    if (!sort || !sort.active || sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'label': return compare(a.label, b.label, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'empp': return compare(+a.result.empP, +b.result.empP, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}