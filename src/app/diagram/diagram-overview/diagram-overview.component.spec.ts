import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramOverviewComponent } from './diagram-overview.component';

describe('DiagramOverviewComponent', () => {
  let component: DiagramOverviewComponent;
  let fixture: ComponentFixture<DiagramOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
