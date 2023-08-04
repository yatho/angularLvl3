import {Component, DestroyRef, inject, Injector, Input} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  questions: Question[] | null = [];

  userAnswers: string[] = [];
  quizService = inject(QuizService);

  router = inject(Router);
  destroyRef = inject(DestroyRef);

  isSwitchedQuestion: boolean = false;

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }

  onSwitchQuestion(index: number) : void {
    if (!this.questions) return;

    this.isSwitchedQuestion = true;
    delete this.userAnswers[index];
    this.questions[index] = {...this.questions[0]};
    this.quizService.getNewQuestion()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(question => this.questions![index] = question);
  }

}
