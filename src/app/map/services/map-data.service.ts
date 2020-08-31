import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MapDataService {

    private readonly CONTROLLER_NAME = 'Map';
    constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

    getInitialData(idOsoba: any): Observable<any> {
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, idOsoba)
        return this.http.get(url)
    }
}
