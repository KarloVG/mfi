import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubject } from '../models/subject';
import { map } from 'rxjs/operators';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'Predmet';

  getSubjects(): Observable<ISubject[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<ISubject[]>(url);
  }

  getSubjectById(id: number): Observable<ISubject> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME, id.toString());
    return this.http.get<ISubject>(url);
  }

  getSubjectsDropdown(): Observable<ISimpleDropdownItem[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<ISubject[]>(url).pipe(map(response => {
      return response.map(el => {
        const item: ISimpleDropdownItem = { id: el.predmetID , name: `Predmet '${el.nazivPredmeta}' (${moment(el.datumOtvaranja).format('DD.MM.YYYY')})` }
        return item
      })
    }));
  }

  addSubject(formData: ISubject): Observable<ISubject> {
    const requestData = {
      brojPredmeta: formData.brojPredmeta,
      datumOtvaranja: formData.datumOtvaranja,
      dozvoljeniKorisnici: formData.predmetKorisnici,
      napomena: formData.napomena,
      nazivPredmeta: formData.nazivPredmeta,
      statusPredmetaID: formData.statusPredmetaID
    }

    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.post<ISubject>(url, requestData);
  }

  editSubject(subjectId: number, formData:ISubject): Observable<ISubject> {
    const requestData = {
      predmetID: subjectId,
      brojPredmeta: formData.brojPredmeta,
      datumOtvaranja: formData.datumOtvaranja,
      dozvoljeniKorisnici: formData.predmetKorisnici,
      napomena: formData.napomena,
      nazivPredmeta: formData.nazivPredmeta,
      statusPredmetaID: formData.statusPredmetaID
    }

    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.put<ISubject>(url, requestData);
  }

  deleteSubject(id: number): Observable<any> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME, id.toString());
    return this.http.delete<any>(url);
  }
}
