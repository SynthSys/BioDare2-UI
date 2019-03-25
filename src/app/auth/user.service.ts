import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {BD2User} from './user.dom';
import {FeedbackService} from '../feedback/feedback.service';
import {AnalyticsService} from '../analytics/analytics.service';
import {BioDareRestService} from '../backend/biodare-rest.service';
import {map, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userStream: BehaviorSubject<BD2User>;
  private user: BD2User;

  constructor(
    private BD2REST: BioDareRestService,
    private analytics: AnalyticsService,
    private feedback: FeedbackService) {

    this.user = this.makeAnonymous();
    this.userStream = new BehaviorSubject(this.user);
  }

  get currentUser(): BD2User {
    return this.user;
  }

  get currentUser$(): Observable<BD2User> {
    return this.userStream;
  }

  isLoggedIn(): boolean {
    if (!this.user || this.user.anonymous) {
      return false;
    }
    return true;
  }

  login(login: string, password: string): Promise<BD2User> {

    // making promise so login can be called without having to subscribe

    return this.BD2REST.login(login, password).pipe(
      map(user => {
        user = BD2User.deserialize(user);
        if (user.anonymous) {
          throw new Error('Login got anonymous user: ' + user.login);
        }
        return user;
      }),
      tap(user => {
          this.setUser(user);
          this.feedback.success(user.name + ', you are logged in');
          this.analytics.userLoggedIn(user.login);
        },
        err => this.handleError(err)
      )
    ).toPromise();


  }


  /* Manual promise creation
  const p = new Promise<BD2User>((resolve, reject) => {

    this.BD2REST.login(login, password).subscribe(
      user => {
        user = BD2User.deserialize(user);
        this.setUser(user);
        if (user.anonymous === false) {
          this.feedback.success(user.name + ', you are logged in');
          this.analytics.userLoggedIn(user.login);
          resolve(user);
        } else {
          this.handleError('Login got anonymous user: ' + user.login);
          reject('Login got anonymous user');
        }
      },
      e => {
        this.handleError(e);
        reject(e);
      }
    );
  });
  return p;

  */

  logout(): Promise<boolean> {

    return this.BD2REST.logout()
      .pipe(
        switchMap(_ => this.BD2REST.refreshUser()),
        tap(
          user => {
            user = BD2User.deserialize(user);
            this.setUser(user);
            this.feedback.success('You are logged out');
          }
        ),
        map(user => true)
      ).toPromise();
  }

  /*
  refresh(): Promise<BD2User> {

    /*
    return this.authenticationService.refreshUser()
      .then(user => {
        this.setUser(user);
        return user;
      });
    return Promise.resolve(this.currentUser);
  } */

  requestReset(identifier: string, gRecaptchaResponse: string): Promise<string> {

    return this.BD2REST.userRequestReset(identifier, gRecaptchaResponse)
      .then(jsonObj => jsonObj.email);
  }

  protected handleError(err) {
    this.feedback.error(err);
  }

  protected setUser(user: BD2User) {
    this.user = user;
    this.userStream.next(user);
  }

  protected makeAnonymous() {
    const user = new BD2User('anonymous');
    user.anonymous = true;
    return user;
  }

}
