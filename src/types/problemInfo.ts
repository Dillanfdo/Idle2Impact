export type ProblemInfoType = {
  task_id: number;
  problem_statement: string;
  description: string;
  dead_line: string;
  tech_stack: string;
  owner:string;
  expected_result: string;
  mentor_id:number;
  enrolledid: number;
  status: string;
  enrolledstatus: string;
};


export type EnrolledUsers = {
  enrolledid: number;
  user_id: number;
  name: string;
  email: string;
  enrolled_status: string;
  created_at: string;
  file_name: string;
  file_path: string;
};