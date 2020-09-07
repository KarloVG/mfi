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
  private readonly DIAGRAM_CONTROLLER = 'dijagram';
  private readonly MAP_CONTROLLER = 'map';
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

  getBaseDetailForDiagram(paginationRequest: IPaginationBase,listOfId: number[], label): Observable<IPagedResult<IFinancijskaTransakcija>> {
    const token = this.subjectService.hasToken();
    if(token) {
      const request = {
        brojRacuna: label,
        searchString: paginationRequest.searchString,
        pageSize: paginationRequest.pageSize,
        pageNumber: paginationRequest.page,
        orderBy: paginationRequest.orderBy,
        predmetID: token,
        listaIzvoda: listOfId
      }
      const url = this.urlHelper.getUrl(this.DIAGRAM_CONTROLLER, 'accountDetailListPaginated');
      return this.http.post<IPagedResult<IFinancijskaTransakcija>>(url, request);
    }
  }

  getBaseDetailForMap(paginationRequest: IPaginationBase,listOfId: number[], drzava: string): Observable<IPagedResult<IFinancijskaTransakcija>> {
    const token = this.subjectService.hasToken();
    if(token) {
      const request = {
        searchString: paginationRequest.searchString,
        pageSize: paginationRequest.pageSize,
        pageNumber: paginationRequest.page,
        orderBy: paginationRequest.orderBy,
        predmetID: token,
        listaIzvoda: listOfId,
        drzava: drzava
      }
      console.log(request)
      const url = this.urlHelper.getUrl(this.MAP_CONTROLLER, 'mapDetailPaginated');
      return this.http.post<IPagedResult<IFinancijskaTransakcija>>(url, request);
    }
  }

}
