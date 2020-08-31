import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { IBaseItem } from '../models/base-item';
import { ICreateOsobaRequest } from '../models/create-osoba-request';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { IEditOsobaRequest } from '../models/edit-osoba-request';
import { IOsobaDropdown } from '../models/osoba-dropdown';
import { ITablicaIzvod } from 'src/app/table/models/tablica-izvod';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private readonly OSOBA_CONTROLLER = 'Osoba';
  private readonly IZVOD_CONTROLLER = 'Izvod';
  private readonly IDENTIFICATION_CONTROLLER = 'VrstaIdBroja';

  constructor(
    private http: HttpClient,
    private urlHelper: UrlHelperService,
    private subjectLocalService: LocalStoreSubjectService
    ) { }

  getBaseItems(): Observable<IBaseItem[]> {
    const token = this.subjectLocalService.hasToken();
    if(token) {
      const url = this.urlHelper.getUrl(this.OSOBA_CONTROLLER, 'predmet', token);
      console.log(url);
      return this.http.get<IBaseItem[]>(url);
    }
  }

  getIzvodiWithTransakcije(): Observable<ITablicaIzvod[]> {
    const token = this.subjectLocalService.hasToken();
    if(token) {
      const url = this.urlHelper.getUrl(this.IZVOD_CONTROLLER, token);
      return this.http.get<ITablicaIzvod[]>(url);
    }
  }

  getOsobeDropdown(): Observable<IOsobaDropdown[]> {
    const token = this.subjectLocalService.hasToken();
    if(token) {
      const url = this.urlHelper.getUrl(this.OSOBA_CONTROLLER, 'odabirOsobe', token);
      return this.http.get<IOsobaDropdown[]>(url);
    }
  }

  // getBaseExtracts(): Observable<IBaseExtract[]> {
  //   const url = this.urlHelper.getUrl(this.BASE_CONTROLLER);
  //   return this.http.get<IBaseExtract[]>(url);
  // }

  getIdentificationTypes() {
    const url = this.urlHelper.getUrl(this.IDENTIFICATION_CONTROLLER);
    return this.http.get<ISimpleDropdownItem[]>(url);
  }


  addPersonOnBase(formData: ICreateOsobaRequest) {
    const token = this.subjectLocalService.hasToken();
    if(token) {
      formData.predmetID = +token;
      const url = this.urlHelper.getUrl(this.OSOBA_CONTROLLER);
      return this.http.post<IBaseItem>(url, formData);
    }
  }

  editPersonOnBase(osoba: IEditOsobaRequest) {
    console.log('ePOB', osoba)
    const token = this.subjectLocalService.hasToken();
    if(token && osoba.osobaID) {
      osoba.predmetID = +token;
      const url = this.urlHelper.getUrl(this.OSOBA_CONTROLLER, osoba.osobaID.toString());
      return this.http.put<any>(url, osoba);
    }
  }

  deletePersonOnBase(id: number): Observable<any> {
    const url = this.urlHelper.getUrl(this.OSOBA_CONTROLLER, id.toString());
    return this.http.delete<any>(url);
  }
}
