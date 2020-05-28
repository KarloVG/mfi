import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInnerbaseItem } from '../models/inner-base-item';

@Injectable({
  providedIn: 'root'
})
export class InnerBaseService {

  private readonly BASE_ITEMS = 'innerBaseItems';

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  getInnerBaseItems(): Observable<IInnerbaseItem[]> {
    const url = this.urlHelper.getUrl(this.BASE_ITEMS);
    return this.http.get<IInnerbaseItem[]>(url);
  }

  getInnerBaseItemsById(id: number): Observable<IInnerbaseItem[]> {
    const url = this.urlHelper.getUrl(this.BASE_ITEMS + '?BaseItemID=' + id.toString());
    console.log(url)
    return this.http.get<IInnerbaseItem[]>(url)
  }

}
