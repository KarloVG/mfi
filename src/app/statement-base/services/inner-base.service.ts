import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInnerbaseItem } from '../models/inner-base-item';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { ITransakcijeForOsobaRequest } from '../models/trasancije-for-osoba-request';

@Injectable({
  providedIn: 'root'
})
export class InnerBaseService {

  private readonly BASE_ITEMS = 'izvod';
  private readonly OSOBA_CONTROLLER = 'osoba';

  constructor(
    private http: HttpClient, 
    private urlHelper: UrlHelperService,
    private subjectLocalService: LocalStoreSubjectService
    ) { }

  getInnerBaseItems(): Observable<IInnerbaseItem[]> {
    const url = this.urlHelper.getUrl(this.OSOBA_CONTROLLER,);
    return this.http.get<IInnerbaseItem[]>(url);
  }

  getInnerBaseItemsById(id: number): Observable<IInnerbaseItem[]> {
    const token = +this.subjectLocalService.hasToken();
    if (token) {
      const request: ITransakcijeForOsobaRequest = {
        osobaID: id,
        predmetID: token
      }
      const url = this.urlHelper.getUrl(this.OSOBA_CONTROLLER, 'transakcija');
      return this.http.post<IInnerbaseItem[]>(url, request)
    }
  }

  deleteInnerBaseItem(id: number): Observable<any> {
    const url = this.urlHelper.getUrl(this.BASE_ITEMS, id.toString());
    return this.http.delete<any>(url)
  }
}
