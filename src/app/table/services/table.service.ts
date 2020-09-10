import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { IFinancijskaTransakcija } from 'src/app/shared/models/financijska-transakcija';
import { ITablicaIzvod } from '../models/tablica-izvod';
import { IPaginationBase } from 'src/app/shared/models/pagination/pagination-base';
import { IPagedResult } from 'src/app/shared/models/pagination/paged-result';
import { ITopbarTableInfo } from '../models/topbar-table-info';
import { LocalStoreFilterService } from 'src/app/shared/services/local-store-filter.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';
  private readonly IZVOD_CONTROLLER = 'Izvod';

  constructor(
    private http: HttpClient,
    private urlHelper: UrlHelperService,
    private subjectLocalService: LocalStoreSubjectService,
    private filterService: LocalStoreFilterService
  ) { }

  getTransakcijeFromIzvod(paginationRequest: IPaginationBase): Observable<IPagedResult<IFinancijskaTransakcija>> {
    const subjectToken = this.subjectLocalService.hasToken();
    const filterToken = this.filterService.hasToken();
    if (subjectToken) {
      let request = {
        searchString: paginationRequest.searchString,
        pageSize: paginationRequest.pageSize,
        pageNumber: paginationRequest.page,
        orderBy: paginationRequest.orderBy,
        predmetID: subjectToken,
        filterValues: null
      };
      if(filterToken) {
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
      const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'paginated');
      return this.http.post<IPagedResult<IFinancijskaTransakcija>>(url, request);
    }
  }

  getAllTransakcije(): Observable<IFinancijskaTransakcija[]> {
    const token = this.subjectLocalService.hasToken();
    if (token) {
      const url = this.urlHelper.getUrl(this.IZVOD_CONTROLLER, 'transakcije', token);
      return this.http.get<IFinancijskaTransakcija[]>(url);
    }
  }

  getTopInfoByPredmetId(): Observable<ITopbarTableInfo> {
    const token = this.subjectLocalService.hasToken();
    if (token) {
      const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'topInfoByPredmetId', token);
      console.log(url)
      return this.http.get<ITopbarTableInfo>(url);
    }
  }
}
