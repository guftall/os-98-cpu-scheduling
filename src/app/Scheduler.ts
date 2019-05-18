import { Job } from './Job';

export interface Scheduler {

  jobs: Job[];
  _current: Job;
  jobQueue: Job[];
  next: () => void;
  current: () => Job;
  add: (job: Job) => void;
  reset: () => void;

}
