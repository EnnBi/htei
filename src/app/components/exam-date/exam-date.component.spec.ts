import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamDateComponent } from './exam-date.component';

describe('ExamDateComponent', () => {
  let component: ExamDateComponent;
  let fixture: ComponentFixture<ExamDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
