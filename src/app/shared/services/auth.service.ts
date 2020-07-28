import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStoreService } from './local-store.service';
import { Router } from '@angular/router';
import { UrlHelperService } from './url-helper.service';

@Injectable()
export class AuthService {
  public readonly tokenStoreIdentifire = 'token';
  
  public applicationActions: string;
  constructor(private store: LocalStoreService,
    private router: Router,
    private urlHelper: UrlHelperService,
    private http: HttpClient) {
        this.checkAuth();
    }

  checkAuth() {
    if (this.hasToken()) {
      localStorage[this.tokenStoreIdentifire] = null;
    }
  }

  hasToken() {
    const token = localStorage[this.tokenStoreIdentifire];
    if (token == null) {
        return null;
      }
    return token;
  }
    
  signin(credentials) {
    localStorage.setToken(credentials)
  }
  
  getCredentialsToken(): string {
    return localStorage[this.tokenStoreIdentifire];
  }

  signout() {
    localStorage.removeItem(this.tokenStoreIdentifire);
  }

  setToken(authData) {
    localStorage[this.tokenStoreIdentifire] = authData;
  }

  getLocalStoreUserData(userData: string) {
    if(localStorage[userData]) {
      return localStorage[userData];
    } else {
      return false;
    }
  }
}
