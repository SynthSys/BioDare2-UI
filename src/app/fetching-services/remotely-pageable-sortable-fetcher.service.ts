import {BehaviorSubject, combineLatest, merge, Observable, of, Subject} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, take, tap} from 'rxjs/operators';

export abstract class RemotelyPageableSortableFetcher<I, P, A, D> {

  protected constructor(protected removeDebounce = false) {

    this.id = RemotelyPageableSortableFetcher.ids++;
    this.logMe('created');
    this.initAssetsStream();
    this.isBusy$ = this.initBusyStream();

    this.data$ = this.initDataStream();
  }
  protected static ids = 0;



  readonly data$: Observable<D>;
  readonly error$ = new Subject<any>();
  readonly isFetching$ = new BehaviorSubject<boolean>(false);
  readonly isProcessing$ = new BehaviorSubject<boolean>(false);
  readonly isBusy$: Observable<boolean>;
  currentPage: PageEvent;
  currentSort: Sort;
  currentAsset: A;
  currentData: D;
  currentInput: I;
  currentParams: P;
  dataLength = 0;

  protected readonly page$ = new BehaviorSubject<PageEvent>(undefined);
  protected readonly sort$ = new BehaviorSubject<Sort>(undefined);
  protected readonly on$ = new BehaviorSubject<boolean>(false);
  protected readonly refresh$ = new Subject<boolean>();

  protected readonly input$ = new BehaviorSubject<I>(undefined);
  protected readonly params$ = new BehaviorSubject<P>(undefined);
  protected readonly asset$ = new BehaviorSubject<A>(undefined);

  protected DEBUG = false;
  protected dataInputsDebounce = 10;
  protected assetInputsDebounce = 200;
  protected busyDebounce = 50;

  public readonly id: number;

  logMe(msg: string, obj?: any) {
    if (!this.DEBUG) { return; }
    msg = this.constructor.name + ':' + this.id + ' ' + msg;
    if (obj) {
      console.log(msg, obj);
    } else {
      console.log(msg);
    }
}

  public input(v: I) {
    if (v) {
      this.input$.next(v);
      this.resetPage();
    }
  }

  public params(v: P) {
    this.params$.next(v);
  }

  public on(state = true) {
    this.on$.next(state);
  }

  public refresh() {
    this.refresh$.next(true);
  }

  public page(page: PageEvent) {
    this.page$.next(page);
  }

  public sort(sort: Sort) {
    this.sort$.next(sort);
    this.resetPage();
  }

  public close() {
    this.asset$.complete();
    this.error$.complete();
    this.isFetching$.complete();
    this.isProcessing$.complete();

    this.input$.complete();
    this.params$.complete();
    this.on$.complete();
    this.refresh$.complete();
    this.page$.complete();
    this.sort$.complete();
  }

  protected abstract sameInput(def1: I, def2: I): boolean;

  protected abstract fetchAsset(input: I, sort: Sort, page: PageEvent): Observable<A>;

  protected abstract processData(asset: A, params: P): D;

  protected abstract assetToDataLength(asset: A): number;


  /**
   * @ToBeOverwritten
   */
  protected errorToData(err: any): Observable<D> {
    return of(undefined);
  }

  /**
   * @ToBeOverwritten
   */
  protected assetToSort(asset: A): Sort {
    return undefined;
  }

  /**
   * @ToBeOverwritten
   */
  protected assetToPage(asset: A): PageEvent {
    return undefined;
  }

  protected resetPage() {
    this.page$.pipe(take(1))
      .subscribe( p => {
        if (p) {
          const page = new PageEvent();
          page.pageIndex = 0;
          page.pageSize = p.pageSize;
          this.page(page);
        }
      }
      );
  }

  protected initBusyStream(): Observable<boolean> {

    if (this.removeDebounce) {
      return combineLatest([this.isFetching$, this.isProcessing$]).pipe(
        map(([fetching, processing]) => fetching || processing),
      );
    } else {
      return combineLatest([this.isFetching$, this.isProcessing$]).pipe(
        debounceTime(this.busyDebounce),
        map(([fetching, processing]) => fetching || processing)
      );
    }
  }

  protected initDataStream() {

    const dataMutations = this.dataMutators();

    let latest;
    if (this.removeDebounce) {
      latest = combineLatest(dataMutations);
    } else {
      latest = combineLatest(dataMutations).pipe(
        debounceTime(this.dataInputsDebounce)
      );
    }

    return latest.pipe(
      tap(v => this.logMe('Input for data stream', v)),
      tap( v => this.isProcessing$.next(true)),
      map( ([asset, params]) => {

        const data = this.processData(asset, params);
        this.currentParams = params;
        this.currentData = data;
        return data;
      }),
      catchError( err => {
        this.error$.next(err);
        return this.errorToData(err);
      }),
      tap( v => this.isProcessing$.next(false)),
    );

  }


  protected dataMutators(): [Observable<A>, Observable<P>] {
    return [
      this.asset$.pipe(filter(v => !!v)),
      this.params$
    ];
  }

  protected assetsMutators(): [Observable<I>, Observable<Sort>, Observable<PageEvent>] {

    const input$ = this.initAssetsInput();
    return [
      input$,
      this.sort$,
      this.page$.pipe(filter(v => !!v))
    ];
  }

  protected initAssetsStream() {

    const dataMutations = this.assetsMutators();

    let latest;
    if (this.removeDebounce) {
      latest = combineLatest(dataMutations);
    } else {
      latest = combineLatest(dataMutations).pipe(
        debounceTime(this.assetInputsDebounce)
      );
    }

    latest.pipe(
      tap(v => this.logMe('Input for asset stream', v))
    ).subscribe(
      ([input, sort, page]) => this.loadAsset(input, sort, page),
      error => this.error$.next(error)
    );
  }

  protected loadAsset(input: I, sort: Sort, page: PageEvent) {

    this.isFetching$.next(true);
    this.fetchAsset(input, sort, page)
      // .pipe(delay(2000))
      .subscribe(
      asset => {
        this.isFetching$.next(false);
        this.setAsset(asset, input, sort, page);
      },
      error => {
        this.isFetching$.next(false);
        this.error$.next(error);
      }
    );
  }



  protected setAsset(asset: A, input: I, sort: Sort, page: PageEvent) {
    this.currentInput = input;
    this.currentAsset = asset;
    this.currentSort = this.assetToSort(asset) || sort;
    this.currentPage = this.assetToPage(asset) || page;
    this.dataLength = this.assetToDataLength(asset);
    this.asset$.next(asset);
  }





  protected initAssetsInput(): Observable<I> {

    const onInput$ = combineLatest( [this.input$, this.on$]).pipe(
      filter( ([val, isOn]) => val && isOn),
      map( ([val, isOn]) => val)
    );

    const distinctInput$ = onInput$.pipe(
      distinctUntilChanged( (def1: I, def2: I) => this.sameInput(def1, def2)),
    );

    const refreshedInput$ = this.refresh$.pipe(
      switchMap( v => distinctInput$.pipe(take(1))),
    );

    const merged = merge(distinctInput$, refreshedInput$)
      .pipe(
        tap( v => this.logMe('Assets input', v))
      );

    return merged;
  }




}
