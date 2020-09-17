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
import { LocalStoreFilterService } from 'src/app/shared/services/local-store-filter.service';

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
    private subjectService: LocalStoreSubjectService,
    private filterService: LocalStoreFilterService
  ) { }

  getBaseDetailById(paginationRequest: IPaginationBase, id: number): Observable<IPagedResult<IFinancijskaTransakcija>> {
    const token = this.subjectService.hasToken();
    if (token) {
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

  getBaseDetailForDiagram(paginationRequest: IPaginationBase, listOfId: number[], label, isARN: boolean = false): Observable<IPagedResult<IFinancijskaTransakcija>> {
    const token = this.subjectService.hasToken();
    if (token) {
      const request = {
        brojRacuna: label,
        searchString: paginationRequest.searchString,
        pageSize: paginationRequest.pageSize,
        pageNumber: paginationRequest.page,
        orderBy: paginationRequest.orderBy,
        predmetID: token,
        listaIzvoda: listOfId,
        isARN: isARN,
      }
      const url = this.urlHelper.getUrl(this.DIAGRAM_CONTROLLER, 'accountDetailListPaginated');
      return this.http.post<IPagedResult<IFinancijskaTransakcija>>(url, request);
    }
  }

  getBaseDetailForMap(paginationRequest: IPaginationBase, listOfId: number[], drzava: string): Observable<IPagedResult<IFinancijskaTransakcija>> {
    const token = this.subjectService.hasToken();
    const filterToken = this.filterService.hasToken();
    if (token) {
      const request = {
        searchString: paginationRequest.searchString,
        pageSize: paginationRequest.pageSize,
        pageNumber: paginationRequest.page,
        orderBy: paginationRequest.orderBy,
        predmetID: token,
        listaIzvoda: listOfId,
        drzava: drzava,
        filterValues: null
      }

      if (filterToken) {
        request.filterValues = {
          A_NA: filterToken.Naziv,
          B_NA: filterToken.NazivB,
          T_DIR: filterToken.Smjer,
          A_RN: filterToken.BrojRacuna,
          B_RN: filterToken.BrojRacunaB,
          A_FIN: filterToken.Banka,
          B_FIN: filterToken.BankaB,
          T_DV_od: filterToken.DatumTrasakcijeOd,
          T_DV_do: filterToken.DatumTrasakcijeDo,
          A_FID: filterToken.Drzava,
          B_FID: filterToken.DrzavaB,
          T_VR: filterToken.VrstaTransakcije,
          T_KONV_IZ_od: filterToken.IznosOd,
          T_KONV_IZ_do: filterToken.IznosDo
        };
      }
      console.log(request)
      const url = this.urlHelper.getUrl(this.MAP_CONTROLLER, 'mapDetailPaginated');
      return this.http.post<IPagedResult<IFinancijskaTransakcija>>(url, request);
    }
  }

}
