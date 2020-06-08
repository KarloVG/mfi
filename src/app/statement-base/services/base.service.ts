import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseExtract } from '../models/base-extract';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { IBaseItem } from '../models/base-item';
import { IPerson } from '../models/person';

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


  addPersonOnBase(formData: IPerson) {
    const requestData = {
      Osoba: {
        Naziv: formData.Naziv,
        TipOsobe: formData.TipOsobeId,
        IdBroj: formData.IdBroj,
        VrstaIdBroja: formData.VrstaId
      },
      UvezeneIzliste: 0,
      BrojTransakcija: '0 HRK',
      IznosTransakcija: '0 HRK'
    }

    const url = this.urlHelper.getUrl(this.BASE_ITEMS);
    return this.http.post<IBaseItem>(url, requestData);
  }

  editPersonOnBase(item: IBaseItem, form: IPerson,types, iTypes) {
    // needs refatoring - this is due to web api workaround
    console.log(types,iTypes)
    const personType = types.find(x=>x.id == form.TipOsobeId);
    const indentityType = iTypes.find(x=>x.id == form.VrstaId);
    console.log(personType,indentityType)
    const requestData = {
      id: item.id,
      Osoba: {
        OsobaID: form.OsobaID,
        Naziv:form.Naziv,
        TipOsobe:personType,
        IdBroj:form.IdBroj,
        VrstaIdBroja:indentityType
      },
      UvezeneIzliste: item.UvezeneIzliste,
      BrojTransakcija: item.BrojTransakcija,
      IznosTransakcija: item.IznosTransakcija
    }
    console.log(requestData)

    const url = this.urlHelper.getUrl(this.BASE_ITEMS);
    return this.http.put<any>(url, requestData);
  }
}
