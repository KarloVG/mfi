import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { IParserResponse } from '../models/parser-response';

@Injectable({
  providedIn: 'root'
})
export class FinancijskaTransakcijaService {

  private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';

  constructor(
    private http: HttpClient, 
    private urlHelper: UrlHelperService,
    private subjectLocalService: LocalStoreSubjectService
    ) { }

  getTemplates(): Observable<ISimpleDropdownItem[]> {
    const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'getTemplates');
    return this.http.get<ISimpleDropdownItem[]>(url);
  }

  validateFile(osobaID,file, templateName): Observable<IParserResponse> {
    const token = this.subjectLocalService.hasToken();
    if (token) {
      const requestData = new FormData();
      requestData.append('fileName', file.name);
      requestData.append('file', file);
      requestData.append('PredmetID', token);
      requestData.append('templateName', templateName);
      requestData.append('OsobaID', osobaID);
      const url = this.urlHelper.getUrl(this.CONTROLLER_NAME)
      return this.http.post<any>(url, requestData)
    }
  }
}
