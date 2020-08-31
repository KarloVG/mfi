import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITransactionType } from '../models/transaction-type';

@Injectable({
  providedIn: 'root'
})
export class TransactionTypeService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'VrstaTransakcije';

  getTransactionType(): Observable<ITransactionType[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<ITransactionType[]>(url);
  }
}
