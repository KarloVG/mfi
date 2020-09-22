import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBank } from '../models/bank';
import { LocalStoreSubjectService } from './local-store-subject.service';
import { IAlarmResponse } from '../models/alarm-response';
import { ISaveStateResponse } from '../models/save-state-response';
import { ISaveStateRequest } from '../models/save-state-request';
import { ICreateSaveStateRequest } from '../models/create-save-state-request';

@Injectable({
  providedIn: 'root'
})
export class SaveStateService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService, private subjectService: LocalStoreSubjectService) { }

  private readonly CONTROLER_NAME = 'DijagramPredmeta';

  getSavedState(vrsta): Observable<ISaveStateResponse> {
    const predmetID = this.subjectService.hasToken();
    if(predmetID) {
        const request: ISaveStateRequest = {
            predmetID: predmetID,
            vrstaDijagrama: vrsta
        };
        const url = this.urlHelper.getUrl(this.CONTROLER_NAME, 'forPredmet');
        return this.http.post<ISaveStateResponse>(url, request);
    }
  }

  saveState(data, vrsta): Observable<ISaveStateResponse> {
    const predmetID = this.subjectService.hasToken();
    if(predmetID) {
      const request: ICreateSaveStateRequest = {
        predmetID: +predmetID,
        vrstaDijagrama: vrsta,
        stanjeDijagrama: data
      }
      const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
      return this.http.post<ISaveStateResponse>(url, request);
    }
  }
}
