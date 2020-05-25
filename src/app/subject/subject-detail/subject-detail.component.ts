import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStatusService } from '../services/subject-status.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { ISubject } from '../models/subject';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss'],
  
})
export class SubjectDetailComponent implements OnInit, OnDestroy {

  subjectStatuses: ISimpleDropdownItem[] = [];
  subjectId: number;
  subject: ISubject;

  //temporarily 
  subjectStatus: ISimpleDropdownItem;

  constructor(
    private subjectStatusService: SubjectStatusService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSubjectStatuses();
    
    this.subjectId = +this.activatedRoute.snapshot.paramMap.get('id') || null;
    if(this.subjectId) {
      this.subjectService.getSubjectById(this.subjectId).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.subject = data;
          this.subjectStatus = this.subjectStatuses.find(x => x.id == this.subject.StatusPredmeta);
        }
      )
    }
  }

  // moramo imati zbog untilComponentDestroyed
  ngOnDestroy(): void {
  }

  navigateToEdit(): void {
    this.router.navigate(['subject/edit', this.subjectId]);
  }

  navigateToHome() {
    this.router.navigate(['welcome']);
  }

  deleteSubject() {
    
  }

  getSubjectStatuses(): void {
    this.subjectStatusService.getSubjectStatuses().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.subjectStatuses = data;
      }
    )
  }
}
