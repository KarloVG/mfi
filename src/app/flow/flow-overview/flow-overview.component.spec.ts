import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowOverviewComponent } from './flow-overview.component';

describe('FlowOverviewComponent', () => {
  let component: FlowOverviewComponent;
  let fixture: ComponentFixture<FlowOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
