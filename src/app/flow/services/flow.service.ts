import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FlowService {

    private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';
    constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

    getGraphData(idOsoba: number, idIzvod: number, idTimespan: number): Observable<any> {
        const request = {
            osobaID: idOsoba,
            izvodID: idIzvod,
            timespanID: idTimespan
        }
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'graph');
        return this.http.post<any>(url, request);
    }
}