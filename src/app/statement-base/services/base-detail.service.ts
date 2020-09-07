import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInnerbaseItem } from '../models/inner-base-item';
import { IInnerBaseDetail } from '../models/inner-base-detail';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { IGetTransakcijeRequest } from '../models/get-transakcije-request';
import { IFinancijskaTransakcija } from 'src/app/shared/models/financijska-transakcija';
import { IPagedResult } from 'src/app/shared/models/pagination/paged-result';
import { IPaginationBase } from 'src/app/shared/models/pagination/pagination-base';

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

  getBaseDetailById(paginationRequest: IPaginationBase,id: number): Observable<IPagedResult<IFinancijskaTransakcija>> {
    const token = this.subjectService.hasToken();
    if(token) {
      const request = {
        searchString: paginationRequest.searchString,
        pageSize: paginationRequest.pageSize,
        pageNumber: paginationRequest.page,
        orderBy: paginationRequest.orderBy,
        predmetID: token,
        izvodID: id
      }
      const url = this.urlHelper.getUrl(this.IZVOD_CONTROLLER, 'transakcije');
      return this.http.post<IPagedResult<IFinancijskaTransakcija>>(url, request);
    }
    
  }

}
