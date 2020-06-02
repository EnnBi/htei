import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTeacherComponent } from './subject-teacher.component';

describe('SubjectTeacherComponent', () => {
  let component: SubjectTeacherComponent;
  let fixture: ComponentFixture<SubjectTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
