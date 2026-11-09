import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsRecipesComponent } from './questions-recipes.component';

describe('QuestionsRecipesComponent', () => {
  let component: QuestionsRecipesComponent;
  let fixture: ComponentFixture<QuestionsRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
