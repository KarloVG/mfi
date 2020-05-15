import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubject } from '../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'subjects';

  getApplicationRequests(): Observable<ISubject[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<ISubject[]>(url);
  }
}
