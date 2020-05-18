import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISubject } from '../models/subject';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient, private urlHelper: UrlHelperService) { }

  private readonly CONTROLER_NAME = 'subjects';

  getSubjects(): Observable<ISubject[]> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME);
    return this.http.get<ISubject[]>(url);
  }

  getSubjectById(id: number): Observable<ISubject> {
    const url = this.urlHelper.getUrl(this.CONTROLER_NAME + '?PredmetID=' + id.toString());
    console.log(url)
    return this.http.get<ISubject>(url).pipe(
      // hacking due to in memory fake web api
      map( value => value[0])
    );
  }
}
