import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChartRequest } from '../models/chart-request';
import { IChartResponse } from '../models/chart-response';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';
    constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

    getChartData(idOsoba: number, idIzvod?: number,): Observable<IChartResponse> {
        const request: IChartRequest = {
            osobaID: idOsoba,
            izvodID: idIzvod,
        }
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'chart');
        return this.http.post<IChartResponse>(url, request);
    }
}