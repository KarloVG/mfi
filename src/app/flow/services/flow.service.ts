import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ICreateGraphDataRequest } from '../models/graph-data-request';
import { createBeforeMidnightTime, createMidnightTime } from 'src/app/shared/utils/time-picker-helper';
import { IGraphDataResponse } from '../models/graph-data-response';

@Injectable({
    providedIn: 'root'
})
export class FlowService {

    private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';
    constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

    getGraphData(idOsoba: number, idIzvod: number, flowGroup: FormGroup): Observable<IGraphDataResponse[]> {
        const request: ICreateGraphDataRequest = {
            osobaID: idOsoba,
            izvodID: idIzvod,
            timespanID: flowGroup.value.TimespanChoice,
            datumOd: createMidnightTime(flowGroup.value.DatumOd),
            datumDo: createBeforeMidnightTime(flowGroup.value.DatumDo)
        }
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'graph');
        return this.http.post<IGraphDataResponse[]>(url, request);
    }
}