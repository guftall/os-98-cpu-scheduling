import { Job } from './Job';

export interface Scheduler {

  _current: Job;
  jobQueue: Job[];
  next: () => void;
  current: () => Job;
  add: (job: Job) => void;

}
