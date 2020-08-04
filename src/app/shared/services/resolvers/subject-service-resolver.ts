import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { LocalStoreSubjectService } from '../local-store-subject.service';

@Injectable({
    providedIn: 'root'
})
export class SubjectServiceResolver implements Resolve<ISimpleDropdownItem[]> {
    constructor(private subjectLocalService: LocalStoreSubjectService) { }
  
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISimpleDropdownItem[]> {
      return this.subjectLocalService.hasToken();
    }
}