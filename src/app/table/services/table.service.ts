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

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';
  private readonly IZVOD_CONTROLLER = 'Izvod';

  constructor(
    private http: HttpClient,
    private urlHelper: UrlHelperService,
    private subjectLocalService: LocalStoreSubjectService
  ) { }

  getTransakcijeFromIzvod(paginationRequest: IPaginationBase): Observable<IPagedResult<IFinancijskaTransakcija>> {
    const token = this.subjectLocalService.hasToken();
    if (token) {
      const request = {
        searchString: paginationRequest.searchString,
        pageSize: paginationRequest.pageSize,
        pageNumber: paginationRequest.page,
        orderBy: paginationRequest.orderBy,
        predmetID: token
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
