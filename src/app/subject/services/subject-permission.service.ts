import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubjectPermission } from '../models/subject-permission';
import { IGetKorisnikRequest } from '../models/get-korisnik-request';

@Injectable({
  providedIn: 'root'
})
export class SubjectPermissionervice {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'Korisnik';

  getPermissions(formgroup: IGetKorisnikRequest): Observable<ISubjectPermission[]> {
    const request: IGetKorisnikRequest =  {
      ime: formgroup.ime,
      prezime: formgroup.prezime,
      loginName: formgroup.loginName
    }
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME, 'filter');
    return this.http.post<ISubjectPermission[]>(url, request);
  }
}
