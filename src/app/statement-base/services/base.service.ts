import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBaseExtract } from '../models/base-extract';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'baseExtracts';

  getBaseExtracts(): Observable<IBaseExtract[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<IBaseExtract[]>(url);
  }
}
