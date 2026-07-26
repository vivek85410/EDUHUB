import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducatoraddmeterialComponent } from './educatoraddmeterial.component';

describe('EducatoraddmeterialComponent', () => {
  let component: EducatoraddmeterialComponent;
  let fixture: ComponentFixture<EducatoraddmeterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducatoraddmeterialComponent]
    });
    fixture = TestBed.createComponent(EducatoraddmeterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
