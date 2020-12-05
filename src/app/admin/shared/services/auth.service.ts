import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {AuthEnum} from '../auth.enum';

@Injectable({providedIn: 'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  public login(user: User): Observable<FbAuthResponse> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap<FbAuthResponse>(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  public get token(): string {
    const expirationDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expirationDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  private setToken(response: FbAuthResponse): void {
    if (response) {
      const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expirationDate.toString());
    } else {
      this.removeToken();
    }
  }

  private handleError(error: HttpErrorResponse): Observable<any>{
    const {message} = error.error.error;
    this.error$.next(AuthEnum[message]);
    return throwError(error);
  }

  public isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  private removeToken(): void {
    localStorage.clear();
  }

  public logout(): void {
    this.removeToken();
  }
}

