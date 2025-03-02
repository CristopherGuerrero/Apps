export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface DayData {
  tasks: Task[];
  completed: number;
}