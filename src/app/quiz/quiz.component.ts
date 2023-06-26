import {Component, inject, Input} from '@angular/core';
import {Question, QuestionWithAnswer} from '../data.models';
import {QuizService} from '../quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input() totalQuizNumber = 5;
  @Input() set questions(value: Question[] | null) {
    this._questionsWithAnswers = value?.map(q => ({ question: q.question, questionObject: q, answer: ''})) ?? [];
    this._canChangeQuestion = true;
  }
  get questionsWithAnswers(): QuestionWithAnswer[] {
    return this._questionsWithAnswers.slice(0,-1);
  }
  get canChangeQuestion() {
    return this._canChangeQuestion;
  }

  // total questions number = quiz question number + spare question for change
  private _questionsWithAnswers: QuestionWithAnswer[] = [];
  private _canChangeQuestion = false;
  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);


  get readyToSubmit(): boolean {
    return !!this.questionsWithAnswers.length && this.questionsWithAnswers.every(q => q.answer);
  }

  setAnswer(i: number, answer: string) {
    this._questionsWithAnswers[i].answer = answer;
  }

  changeQuestion(i: number) {
    const temp = [...this._questionsWithAnswers];
    // replace last question (spare question) with selected question
    const lastQuestion = temp.splice(temp.length -1, 1, temp[i])[0];
    // replace selected question with last question
    temp.splice(i, 1, lastQuestion);
    this._questionsWithAnswers = [...temp];
    this._canChangeQuestion = false;
  }

  submit(): void {
    const {questions, answers} = this.questionsWithAnswers.reduce(
      (obj: {questions: Question[], answers: string[]}, {questionObject, answer}) => {
        return {
        ...obj,
        questions: [...obj.questions, questionObject],
        answers: [...obj.answers, answer]
      }}, {questions: [], answers: []});
    this.quizService.computeScore(questions, answers);
    this.router.navigateByUrl("/result");
  }

  trackBy(_index: number, item: QuestionWithAnswer) {
    return item.question;
  }

}
