import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBank } from '../models/bank';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'Banka';

  getBanke(): Observable<IBank[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<IBank[]>(url);
  }
}
