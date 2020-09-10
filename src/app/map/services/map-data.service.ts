import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStoreFilterService } from 'src/app/shared/services/local-store-filter.service';

@Injectable({
    providedIn: 'root'
})
export class MapDataService {

    private readonly MAP_CONTROLLER_NAME = 'Map';
    private readonly IZVOD_CONTROLLER_NAME = 'Izvod';

    constructor(private http: HttpClient, private urlHelper: UrlHelperService, private filterService: LocalStoreFilterService) { }

    getInitialData(idOsoba: any): Observable<any> {
        const filterToken = this.filterService.hasToken();
        const url = this.urlHelper.getUrl(this.MAP_CONTROLLER_NAME, 'initial')
        let request = {
            osobaID: idOsoba,
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
        return this.http.post(url, request)
    }
}
