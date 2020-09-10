import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChartRequest } from '../models/chart-request';
import { IChartResponse } from '../models/chart-response';
import { LocalStoreFilterService } from 'src/app/shared/services/local-store-filter.service';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';
    constructor(private http: HttpClient, private urlHelper: UrlHelperService, private filterService: LocalStoreFilterService) { }

    getChartData(idOsoba: number, idIzvod?: number): Observable<IChartResponse> {
        const filterToken = this.filterService.hasToken();
        let request: IChartRequest = {
            osobaID: idOsoba,
            izvodID: idIzvod,
            filterValues: null
        }
        if (filterToken) {
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
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'chart');
        return this.http.post<IChartResponse>(url, request);
    }
}