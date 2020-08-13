import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStoreSubjectService } from './local-store-subject.service';
import { IOsobaDropdown } from '../models/osoba-dropdown';

@Injectable({
    providedIn: 'root'
})
export class VisualisationToolbarService {

    private readonly CONTROLLER_NAME = 'Osoba';
    constructor(private http: HttpClient, private urlHelper: UrlHelperService, private subjectService: LocalStoreSubjectService) { }

    getOsobaDropdown(): Observable<IOsobaDropdown[]> {
        const token = this.subjectService.hasToken();
        if(token) {
            const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'odabirOsobe', token);
            return this.http.get<IOsobaDropdown[]>(url);
        }
    }
}