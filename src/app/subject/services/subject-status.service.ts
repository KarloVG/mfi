import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';

@Injectable({
  providedIn: 'root'
})
export class SubjectStatusService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'StatusPredmeta';

  getSubjectStatuses(): Observable<ISimpleDropdownItem[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<ISimpleDropdownItem[]>(url);
  }
}
