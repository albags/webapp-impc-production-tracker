import { Injectable } from '@angular/core';
import { LoggedUser } from '../model/user/logged-user';
import { Observable } from 'rxjs';
import { MessageService } from './message.service';
import { Permission } from '../model/conf/permission';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/**
 * Class to keep information about the current user logged into the application.
 */
export class LoggedUserService {

  private loggedUser: LoggedUser;
  readonly TOKEN_INFO_KEY = 'tokenInfo';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  // Returns an object with permissions for the logged user.
  getPermissions() {
    return this.http.get<Permission>(`${environment.baseUrl}/api/permissions`);
}

  getAccessToken() {
    const logginInfo = JSON.parse(localStorage.getItem(this.TOKEN_INFO_KEY));
    let token = null;
    if (logginInfo) {
      token = logginInfo.access_token;
    }
    return token;
  }

  storeLoggedUser(userInfo: any) {
    localStorage.setItem(this.TOKEN_INFO_KEY, JSON.stringify(userInfo));
    this.messageService.setUserLoggedIn(true);
  }

  removeLoggedUser() {
    localStorage.removeItem(this.TOKEN_INFO_KEY);
    this.messageService.setUserLoggedIn(false);
  }

  readLoggedUser() {
    const tokenInfo = JSON.parse(localStorage.getItem(this.TOKEN_INFO_KEY));
    if (tokenInfo) {
      this.loggedUser = new LoggedUser();
      this.loggedUser.role = tokenInfo.role;
      this.loggedUser.userName = tokenInfo.username;
      this.loggedUser.workUnitName = tokenInfo.workUnitName;
    } else {
      this.loggedUser = null;
    }
  }

  getLoggerUser() {
    this.readLoggedUser();
    return this.loggedUser;
  }

  evaluatePermission(action: string): Observable<boolean> {
    return this.getPermissions().pipe( map(v => {
      switch (action) {
        case 'register-user':
          return !v.canRegisterUser;
          break;
        default:
          return false;
      }
    }));
  }
}