import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInnerbaseItem } from '../models/inner-base-item';
import { IInnerBaseDetail } from '../models/inner-base-detail';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { IGetTransakcijeRequest } from '../models/get-transakcije-request';

@Injectable({
  providedIn: 'root'
})
export class BaseDetailService {

  private readonly IZVOD_CONTROLLER = 'izvod';
  constructor(
    private http: HttpClient, 
    private urlHelper: UrlHelperService,
    private subjectService: LocalStoreSubjectService
    ) { }

  getBaseDetailById(id): Observable<IInnerBaseDetail[]> {
    const token = this.subjectService.hasToken();
    if(token) {
      const request : IGetTransakcijeRequest = {
        izvodID: id,
        predmetID: token
      }
      const url = this.urlHelper.getUrl(this.IZVOD_CONTROLLER, 'transakcije');
      return this.http.post<IInnerBaseDetail[]>(url, request);
    }
    
  }

}
