import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducatoraddcourseComponent } from './educatoraddcourse.component';

describe('EducatoraddcourseComponent', () => {
  let component: EducatoraddcourseComponent;
  let fixture: ComponentFixture<EducatoraddcourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducatoraddcourseComponent]
    });
    fixture = TestBed.createComponent(EducatoraddcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
