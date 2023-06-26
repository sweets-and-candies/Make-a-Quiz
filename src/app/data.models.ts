export interface Category {
  id: number | string;
  name: string;
  subCategories: Category[];
}

export type CategoriesObj = Record<string, Category>;

export interface ApiQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
}

export interface QuestionWithAnswer {
  question: string,
  questionObject: Question,
  answer: string
}

export interface Results {
  questions: Question[];
  answers: string[];
  score: number;
}


export type Difficulty = "Easy" | "Medium" | "Hard";
