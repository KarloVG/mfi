import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FinancijskaTransakcijaService {

    private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';
    constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

    getAccountData(idIzvod: number, brojRacuna: string,): Observable<any> {
        const request = {
            izvoD_ID: idIzvod,
            brojRacuna: brojRacuna,
        }
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'getByIzvodIdAndBrRacuna');
        return this.http.post(url, request);
    }
}
