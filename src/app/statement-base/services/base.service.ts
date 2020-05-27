import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseExtract } from '../models/base-extract';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { IBaseItem } from '../models/base-item';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private readonly BASE_ITEMS = 'baseItems';
  private readonly BASE_CONTROLLER = 'baseExtracts';
  private readonly PERSON_CONTROLLER = 'personTypes';
  private readonly IDENTIFICATION_CONTROLLER = 'identificationTypes';

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  getBaseItems(): Observable<IBaseItem[]> {
    const url = this.urlHelper.getUrl(this.BASE_ITEMS);
    return this.http.get<IBaseItem[]>(url);
  }

  getBaseExtracts(): Observable<IBaseExtract[]> {
    const url = this.urlHelper.getUrl(this.BASE_CONTROLLER);
    return this.http.get<IBaseExtract[]>(url);
  }

  getPersonTypes() {
    const url = this.urlHelper.getUrl(this.PERSON_CONTROLLER);
    return this.http.get<ISimpleDropdownItem[]>(url);
  }

  getIdentificationTypes() {
    const url = this.urlHelper.getUrl(this.IDENTIFICATION_CONTROLLER);
    return this.http.get<ISimpleDropdownItem[]>(url);
  }
}
