import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { SubjectService } from '../subject.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from '../navigation.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectGuard implements CanActivate {

  constructor(
    private router: Router,
    private storeService: SubjectService,
    private toastrService: ToastrService,
    private navigationService: NavigationService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.storeService.hasToken()){
        return true;
      }
      else{
        this.toastrService.info("Morate otvoriti predmet putem 'Otvori postojeći predmet' akcije");
        this.navigationService.publishNavigationChange();
        return this.router.parseUrl("welcome");
      }
  }
}
