import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { IFinancijskaTransakcija } from 'src/app/shared/models/financijska-transakcija';
import { ITablicaIzvod } from '../models/tablica-izvod';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private readonly CONTROLLER_NAME = 'Izvod';

  constructor(
    private http: HttpClient, 
    private urlHelper: UrlHelperService,
    private subjectLocalService: LocalStoreSubjectService
    ) { }

    getTransakcijeFromIzvod(): Observable<any> {
        const token = this.subjectLocalService.hasToken();
        if(token) {
          const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, token);
          return this.http.get<ITablicaIzvod[]>(url).pipe(
            map( data => {
                return data.map(
                    (data) => { return data.financijskeTransakcije; }
                )
            })
          );
        }
    }
}
