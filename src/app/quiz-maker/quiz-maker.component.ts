import {Component} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {BehaviorSubject, Observable, map, startWith, tap} from 'rxjs';
import {QuizService} from '../quiz.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {

  categories$: Observable<Category[]>;
  subcategories$ = new BehaviorSubject<Category[]>([]);
  canCreateQuiz$: Observable<number | null>;
  questions$!: Observable<Question[]>;

  form: FormGroup;

  constructor(protected quizService: QuizService) {
    this.form = new FormGroup({
      category: new FormControl<Category|null>(null),
      subcategory: new FormControl<Category|null>(null),
      difficulty: new FormControl<Difficulty | null>(null)
    });
    this.categories$ = quizService.getAllCategories();
    this.canCreateQuiz$ = this.form.valueChanges.pipe(
      map(value => this.getCategory(value) && value.difficulty),
    );

  }

  createQuiz(): void {
    const formValue = this.form.value;
    this.questions$ = this.quizService.createQuiz(this.getCategory(formValue), formValue.difficulty as Difficulty);
  }

  private getCategory(value: any) {
    return typeof value.category === 'number' ? value.category : value.subcategory;
  }
}
