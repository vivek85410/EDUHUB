import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducatormaterialsComponent } from './educatormaterials.component';

describe('EducatormaterialsComponent', () => {
  let component: EducatormaterialsComponent;
  let fixture: ComponentFixture<EducatormaterialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducatormaterialsComponent]
    });
    fixture = TestBed.createComponent(EducatormaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
