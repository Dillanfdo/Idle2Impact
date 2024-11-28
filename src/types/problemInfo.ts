export type ProblemInfoType = {
  problemId: string;
  project: string;
  title: string;
  description: string;
  tech_stack: string[];
  deadline: string;
  owner: { name: string; email: string };
  created_date: string;
  summary: string;
  expectedResult: string;
};
