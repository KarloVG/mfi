import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITirmItem } from '../models/tirm-item';
import { ITirmFile } from '../models/tirm-file';

@Injectable({
  providedIn: 'root'
})
export class TirmService {

  private readonly TIRM_ITEMS = 'tirmItems';
  private readonly TIRM_FILES = 'tirmFiles';
  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  getTirmItems(): Observable<ITirmItem[]> {
    const url = this.urlHelper.getUrl(this.TIRM_ITEMS);
    return this.http.get<ITirmItem[]>(url);
  }

  getTirmFiles(): Observable<ITirmFile[]> {
    const url = this.urlHelper.getUrl(this.TIRM_FILES);
    return this.http.get<ITirmFile[]>(url);
  }

}
