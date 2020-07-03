import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ImportFileService {

    private readonly CONTROLLER_NAME = 'FinancijskaTransakcija';

    constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

    validateFile(file, templateName): Observable<any> {
        const requestData = new FormData();
        requestData.append('fileName', file.name);
        requestData.append('file', file);
        requestData.append('templateName', templateName);
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME)
        return this.http.post<any>(url, requestData)
    }

    tryoutGet(id): Observable<any> {
        const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, id)
        return this.http.get<any>(url)
    }
}
