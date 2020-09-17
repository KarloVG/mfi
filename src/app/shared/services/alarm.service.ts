import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBank } from '../models/bank';
import { LocalStoreSubjectService } from './local-store-subject.service';
import { IAlarmResponse } from '../models/alarm-response';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService, private subjectService: LocalStoreSubjectService) { }

  private readonly CONTROLER_NAME = 'Alarm';

  getAlarmInformation(): Observable<IAlarmResponse[]> {
    const predmetID = this.subjectService.hasToken();
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME, predmetID);
    return this.http.get<IAlarmResponse[]>(url);
  }
}
