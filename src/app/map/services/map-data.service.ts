import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MapDataService {

    private readonly MAP_CONTROLLER_NAME = 'Map';
    private readonly IZVOD_CONTROLLER_NAME = 'Izvod';

    constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

    getInitialData(idOsoba: any): Observable<any> {
        const url = this.urlHelper.getUrl(this.MAP_CONTROLLER_NAME, idOsoba)
        return this.http.get(url)
    }

    getIzvodByList(listArray): Observable<any> {
        const request = {
          listaIzvoda: listArray
        }
        const url = this.urlHelper.getUrl(this.IZVOD_CONTROLLER_NAME, 'byList')
        return this.http.post(url, request)
    }
}
