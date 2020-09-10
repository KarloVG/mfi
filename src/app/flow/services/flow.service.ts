import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ICreateGraphDataRequest } from '../models/graph-data-request';
import { createBeforeMidnightTime, createMidnightTime } from 'src/app/shared/utils/time-picker-helper';
import { IGraphDataResponse } from '../models/graph-data-response';
import { LocalStoreFilterService } from 'src/app/shared/services/local-store-filter.service';

@Injectable({
    providedIn: 'root'
})
export class FlowService {

    private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';
    constructor(private http: HttpClient, private urlHelper: UrlHelperService, private filterService: LocalStoreFilterService) { }

    getGraphData(idOsoba: number, idIzvod: number, flowGroup: FormGroup): Observable<IGraphDataResponse> {
        const filterToken = this.filterService.hasToken();
        const request: ICreateGraphDataRequest = {
            osobaID: idOsoba,
            izvodID: idIzvod,
            timespanID: flowGroup.value.TimespanChoice,
            datumOd: createMidnightTime(flowGroup.value.DatumOd),
            datumDo: createBeforeMidnightTime(flowGroup.value.DatumDo),
            filterValues: null
        }
        if(filterToken) {
            request.filterValues = {
              A_NA: filterToken.Naziv,
              B_NA: filterToken.NazivB,
              T_DIR: filterToken.Smjer,
              A_RN: filterToken.BrojRacuna,
              B_RN: filterToken.BrojRacunaB,
              A_FIN: filterToken.Banka,
              B_FIN: filterToken.BankaB,
              T_DV_od: filterToken.DatumTrasakcijeOd,
              T_DV_do: filterToken.DatumTrasakcijeDo,
              A_FID: filterToken.Drzava,
              B_FID: filterToken.DrzavaB,
              T_VR: filterToken.VrstaTransakcije,
              T_KONV_IZ_od: filterToken.IznosOd,
              T_KONV_IZ_do: filterToken.IznosDo
            };
          }
        console.log(createBeforeMidnightTime(flowGroup.value.DatumOd))
        console.log(createBeforeMidnightTime(flowGroup.value.DatumDo))
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'graph');
        return this.http.post<IGraphDataResponse>(url, request);
    }
}