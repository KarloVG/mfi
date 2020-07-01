import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionviewComponent } from './transactionview.component';

describe('TransactionviewComponent', () => {
  let component: TransactionviewComponent;
  let fixture: ComponentFixture<TransactionviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
