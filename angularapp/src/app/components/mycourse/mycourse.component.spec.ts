import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MycourseComponent } from './mycourse.component';

describe('MycourseComponent', () => {
  let component: MycourseComponent;
  let fixture: ComponentFixture<MycourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MycourseComponent]
    });
    fixture = TestBed.createComponent(MycourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
