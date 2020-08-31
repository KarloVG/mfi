import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ICountry } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'Drzava';

  getCountries(): Observable<ICountry[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<ICountry[]>(url);
  }
}
