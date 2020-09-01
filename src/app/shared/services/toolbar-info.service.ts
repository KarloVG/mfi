import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IToolbarInfo } from '../models/toolbar-info';

@Injectable({
  providedIn: 'root'
})
export class ToolbarInfoService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'Izvod';

  getToolbarData(token): Observable<IToolbarInfo> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME, 'topbar', token);
    return this.http.get<IToolbarInfo>(url);
  }
}