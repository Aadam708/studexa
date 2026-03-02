export type Subject = {
  id: number;
  name: string;
};

export type Material = {
  id: string;
  title: string;
  subject: string;
  subjectColor: string;
  cards: number;
  progress: number;
};
