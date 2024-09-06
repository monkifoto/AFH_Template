import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessQuestionFormComponent } from './business-question-form.component';

describe('BusinessQuestionFormComponent', () => {
  let component: BusinessQuestionFormComponent;
  let fixture: ComponentFixture<BusinessQuestionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessQuestionFormComponent]
    });
    fixture = TestBed.createComponent(BusinessQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
