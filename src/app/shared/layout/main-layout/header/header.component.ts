import { Component, OnInit } from '@angular/core';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { SubjectApiService } from 'src/app/subject/services/subject.service';
import { take } from 'rxjs/operators';
import { ISubject } from 'src/app/subject/models/subject';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  predmet: ISubject;

  constructor(
    private localStoreSubjectService: LocalStoreSubjectService,
    private subjectService: SubjectApiService
  ) { }

  ngOnInit(): void {
    this.getPredmetById();
  }

  getPredmetById() {
    const token = this.localStoreSubjectService.hasToken();
    if (token) {
      this.subjectService.getSubjectById(token).pipe(take(1)).subscribe(
        data => {
          console.log(data);
          this.predmet = data;
        }
      )
    }
  }

}
