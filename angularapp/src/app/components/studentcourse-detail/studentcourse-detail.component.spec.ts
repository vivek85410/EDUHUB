import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcourseDetailComponent } from './studentcourse-detail.component';

describe('StudentcourseDetailComponent', () => {
  let component: StudentcourseDetailComponent;
  let fixture: ComponentFixture<StudentcourseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentcourseDetailComponent]
    });
    fixture = TestBed.createComponent(StudentcourseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
