import {Component} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {Observable} from 'rxjs';
import {QuizService} from '../quiz.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {

  filterForm = new FormGroup({
    'category': new FormControl<null | Category>(null, Validators.required),
    'subCategory': new FormControl<null | Category>(null),
    'difficulty': new FormControl<null | Difficulty>(null, Validators.required),
  });

  categories$: Observable<Category[]>;
  questions$!: Observable<Question[]>;

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getAllCategories()

    this.filterForm.get('category')?.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.filterForm.get('subCategory')?.reset());
  }

  createQuiz(): void {
    if (this.filterForm.invalid) return;
    const {category, subCategory, difficulty} = this.filterForm.value;
    this.questions$ = this.quizService.createQuiz(subCategory?.id??category!.id, difficulty!);
  }
}
