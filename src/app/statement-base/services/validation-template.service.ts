import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';

@Injectable({
  providedIn: 'root'
})
export class ValidationTemplateService {

  private readonly CONTROLLER_NAME = 'validationTemplates';

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  getTemplates(): Observable<ISimpleDropdownItem[]> {
    const url = this.urlHelper.getUrl(this.CONTROLLER_NAME);
    return this.http.get<ISimpleDropdownItem[]>(url);
  }
}
