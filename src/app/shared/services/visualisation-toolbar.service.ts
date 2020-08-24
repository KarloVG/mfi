import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStoreSubjectService } from './local-store-subject.service';
import { IOsobaDropdown } from '../models/osoba-dropdown';
import { IIzvodDropdown } from '../models/izvod-dropdown';

@Injectable({
    providedIn: 'root'
})
export class VisualisationToolbarService {

    private readonly OSOBA_CONTROLLER = 'Osoba';
    private readonly IZVOD_CONTROLLER = 'Izvod';

    constructor(private http: HttpClient, private urlHelper: UrlHelperService, private subjectService: LocalStoreSubjectService) { }

    getOsobaDropdown(): Observable<IOsobaDropdown[]> {
        const token = this.subjectService.hasToken();
        if(token) {
            const url = this.urlHelper.getUrl(this.OSOBA_CONTROLLER, 'odabirOsobe', token);
            return this.http.get<IOsobaDropdown[]>(url);
        }
    }

    getIzvodiForOsobaDropdown(id:number): Observable<IIzvodDropdown[]> {
        const url = this.urlHelper.getUrl(this.IZVOD_CONTROLLER, 'dropdown', id.toString());
        return this.http.get<IIzvodDropdown[]>(url);
    }
}