import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentviewcourseComponent } from './studentviewcourse.component';

describe('StudentviewcourseComponent', () => {
  let component: StudentviewcourseComponent;
  let fixture: ComponentFixture<StudentviewcourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentviewcourseComponent]
    });
    fixture = TestBed.createComponent(StudentviewcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
