import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubjectPermission } from '../models/subject-permission';

@Injectable({
  providedIn: 'root'
})
export class SubjectPermissionervice {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'Korisnik';

  getPermissions(): Observable<ISubjectPermission[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<ISubjectPermission[]>(url);
  }
}
