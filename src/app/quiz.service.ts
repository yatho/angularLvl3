import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';
import {Category, Difficulty, ApiQuestion, Question, Results} from './data.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private API_URL = "https://opentdb.com/";
  private lastestQuizzOptions?: {categoryId: number; difficulty: Difficulty};
  private latestResults!: Results;

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<{ trivia_categories: Category[] }>(this.API_URL + "api_category.php").pipe(
      map(res => res.trivia_categories),
      map(this.groupCategoriesByMainCategory)
    );
  }

  private groupCategoriesByMainCategory(categories: Category[]): Category[] {
    const mainCategories: Category[] = [];
  
    categories.forEach((category) => {
      const [mainCategory, subCategory] = category.name.split(": ");
      
      const mainCategoryObj = mainCategories.find((item) => item.name === mainCategory);
      if (mainCategoryObj) {
        if (!mainCategoryObj.subCategories) mainCategoryObj.subCategories = [];
        mainCategoryObj.subCategories.push({
          id: category.id,
          name: subCategory
        });
      } else {
        mainCategories.push({
          id: subCategory ? 0 : category.id,
          name: mainCategory,
          subCategories: subCategory ? [{id: category.id, name: subCategory}] : [],
        });
      }
    });
  
    return mainCategories;
  }

  createQuiz(categoryId: number, difficulty: Difficulty): Observable<Question[]> {
    return this.getQuestionList(categoryId, difficulty)
      .pipe(
        tap(() => {
          this.lastestQuizzOptions = {
            categoryId: categoryId,
            difficulty: difficulty
          }
        })
      );
  }

  getNewQuestion(): Observable<Question> {
    if (!this.lastestQuizzOptions) return of();
    return this.getQuestionList(this.lastestQuizzOptions.categoryId, this.lastestQuizzOptions.difficulty, 1).pipe(
      map(res => res[0])
    )
  }

  private getQuestionList(categoryId: number, difficulty: Difficulty, questionCount: number = 5) : Observable<Question[]> {
    return this.http.get<{ results: ApiQuestion[] }>(
      `${this.API_URL}/api.php?amount=${questionCount}&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        map(res => {
          const quiz: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));
          return quiz;
        })
      );
  }

  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index])
        score++;
    });
    delete this.lastestQuizzOptions;
    this.latestResults = {questions, answers, score};
  }

  getLatestResults(): Results {
    return this.latestResults;
  }
}