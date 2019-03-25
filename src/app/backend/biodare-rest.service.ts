import {Injectable} from '@angular/core';
import {BioDareEndPoints} from './biodare-rest.dom';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {SystemEventsService} from '../system/system-events.service';
import {BD2User} from '../auth/user.dom';

@Injectable({
  providedIn: 'root'
})
export class BioDareRestService {

  constructor(private endPoints: BioDareEndPoints,
              private systemEvents: SystemEventsService,
              private http: HttpClient) {

  }

  // it is static as the this was missinging in handleBadResponse
  protected static extractMessage(resp: HttpErrorResponse, def: string): string {
    if (!resp) {
      return '' + def;
    }

    if (resp.error && resp.error.message) {
      return resp.error.message;
    }

    if (resp.message) {
      return resp.message + ':' + def;
    }

    return def;
  }

  login(username: string, password: string): Observable<BD2User> {

    const options = this.makeOptions();

    // must be like this as headers are immutatble
    options.headers = options.headers.append('authorization',
      'Basic ' + btoa(username + ':' + password));
    options.headers = options.headers.append('X-Requested-With',
      'XMLHttpRequest'); // to prevent the basic auth popup

    const url = this.endPoints.login_url;

    return this.OKJson(this.http.get<BD2User>(url, options));

  }

  logout(): Observable<boolean> {
    const options = this.makeOptions();
    const url = this.endPoints.logout_url;

    return this.OK(this.http.post(url, undefined, options));
  }

  refreshUser(): Observable<BD2User> {
    const options = this.makeOptions();
    const url = this.endPoints.user_url;

    return this.OKJson(this.http.get<BD2User>(url, options));

  }

  userActivate(token: string): Promise<any> {
    const options = this.makeOptions();
    const url = this.endPoints.user_activate_url;
    const body = token;

    return this.OKJson(this.http.post(url, body, options)).toPromise();

  }

  userRequestReset(identifier: string, gRecaptchaResponse: string): Promise<any> {
    const options = this.makeOptions();
    const url = this.endPoints.user_requestreset_url;

    const body = {identifier, g_recaptcha_response: gRecaptchaResponse};

    return this.OKJson(this.http.post(url, body, options)).toPromise();

  }

  userResetPassword(password: string, token: string): Promise<any> {
    const options = this.makeOptions();
    const url = this.endPoints.user_reset_url;
    const body = {password, token};

    return this.OKJson(this.http.post(url, body, options)).toPromise();

  }

  userAvailableLogin(login: string): Promise<boolean> {
    const options = this.makeOptions();
    const url = this.endPoints.user_available_login_url;
    const body = login;

    return this.OKBoolean(this.http.post<string>(url, login, options)).toPromise();
  }

  userAcademicEmail(email: string): Promise<boolean> {
    const options = this.makeOptions();
    const url = this.endPoints.user_academic_email_url;
    const body = email;

    return this.OKBoolean(this.http.post<string>(url, body, options)).toPromise();
  }

  userSuitableEmail(email: string): Promise<any> {
    const options = this.makeOptions();
    const url = this.endPoints.user_suitable_email_url;
    const body = email;

    return this.OKJson(this.http.post(url, body, options)).toPromise();
  }


  userRegister(user: any): Promise<any> {
    const options = this.makeOptions();
    const url = this.endPoints.user_register_url;
    const body = JSON.stringify(user);

    return this.OKJson(this.http.put(url, body, options)).toPromise();

  }



  protected makeOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
      // 'X-Requested-With':'XMLHttpRequest' // to prevent the basic auth popup
    });

    return {
      headers,
      withCredentials: true
    };
  }

  protected OKJson<T>(resp$: Observable<T>): Observable<T> {

    return resp$.pipe(
      catchError(this.handleBadResponse)
    );
  }


  protected OK(resp$: Observable<any>): Observable<boolean> {

    return resp$.pipe(
      map(_ => true),
      catchError(this.handleBadResponse)
    );
  }

  protected OKBoolean(resp$: Observable<any>): Observable<boolean> {

    return resp$.pipe(
      map( resp => {
        if (resp.body) {
          resp = resp.body;
        }
        if (resp === true || resp === 'true') {
          return true;
        }
        if (resp === false || resp === 'false') {
          return false;
        }
        throw Error('Not boolean response: ' + resp);
        }),
      catchError(this.handleBadResponse)
    );

  }

  protected handleBadResponse(resp: HttpErrorResponse) {
    // console.log('HandleBadResponse: '+resp.status+'; '+resp.statusText);
    // console.log('Body: '+resp.text());
    // console.log('RESP: '+JSON.stringify(resp));
    // console.log('E: '+resp.text());
    // console.log("BR",resp);

    console.error('Response error', resp);


    let message: string;

    switch (resp.status) {
      case 401: {
        message = 'Bad credentials, locked or not activated account';
        break;
      }
      case 403: {
        // console.log('Unauthorised');
        this.systemEvents.emitUnauthorised(resp.url);

        // must be static call as this is not defined in the pipe ??? why???
        message = BioDareRestService.extractMessage(resp, 'Unauthorized');
        break;
      }
      case 400: {
        message = BioDareRestService.extractMessage(resp, 'Handling error');
        break;
      }
      default: {
        message = BioDareRestService.extractMessage(resp, 'No error details');
      }

    }
    return throwError(message);
  }


}
