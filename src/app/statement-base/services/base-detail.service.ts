import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInnerbaseItem } from '../models/inner-base-item';
import { IInnerBaseDetail } from '../models/inner-base-detail';

@Injectable({
  providedIn: 'root'
})
export class BaseDetailService {

  private readonly BASE_DETAIL = 'baseDetails';
  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  getBaseDetailById(): Observable<IInnerBaseDetail[]> {
    const url = this.urlHelper.getUrl(this.BASE_DETAIL);
    return this.http.get<IInnerBaseDetail[]>(url);
  }

}
