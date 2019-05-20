import { Component, OnInit } from '@angular/core';
import { Scheduler } from '../Scheduler';
import { GanttChartService } from '../gantt-chart/gantt-chart.service';
import { Job } from '../Job';
import { PriorityQueue } from '../PriorityQueue';

@Component({
  selector: 'app-srtn',
  templateUrl: './srtn.component.html',
  styleUrls: ['./srtn.component.css'],
  providers: [GanttChartService]
})
export class SrtnComponent implements OnInit {

  scheduler: Scheduler;
  constructor(
    private gChartService: GanttChartService
    ) {
      this.scheduler = new ShortestRemainingTimeNext();
    }

  ngOnInit() {
  }
  jobReceived(jobId: string) {

    var index = +jobId;
    var j = this.scheduler.jobs[index];

    this.scheduler.jobReceived(j);
  }

}

class ShortestRemainingTimeNext implements Scheduler {
  jobs: Job[];
  _current: Job;
  jobQueue: Job[];
  priorityQueue: PriorityQueue;

  constructor() {

    this.jobQueue = [];
    this.jobs = [];
    this.priorityQueue = new PriorityQueue(this.jobQueue, (a: Job, b: Job): any => {

      if (a.remainingTime > b.remainingTime) {
        return 1;
      } else if (a.remainingTime < b.remainingTime) {
        return -1;
      }
      return 0;
    });
  }

  next(): Job {
    if (this.jobQueue.length == 0) {
      return undefined;
    }

    var next = this.priorityQueue.dequeue();
    next.quantum = next.remainingTime;
    return next;
  }
  current(): Job {

    if (this._current == undefined) {
      if (this.jobQueue.length > 0) {
        this._current = this.next();
      } else {
        return undefined;
      }
    }
    if (this._current.remainingTime == 0) {

      console.log(`Job ${this._current.name()} finished`);
      this._current = this.next();
    } else if (this._current.quantum < 1) {

      this.priorityQueue.queue(this._current);
      this._current = this.next();
    }

    return this._current;
  }
  add(job: Job) {

    if (job.burstTime < 0 || job.arrivalTime < 0) {
      return;
    }
    this.jobs.push(job);
  }
  jobReceived(job: Job) {

    job.remainingTime = job.burstTime;
    console.log(`Job ${job.name.bind(job)()} entered`)

    if (this._current != undefined) {
      if (job.remainingTime < this._current.remainingTime) {

        this.priorityQueue.queue(this._current);
        this._current = job;
        return;
      }
    }

    this.jobQueue.forEach(j => {
      console.log(j);
    })
    this.priorityQueue.queue(job);
    this.jobQueue.forEach(j => {
      console.log(j);
    })
  }
  reset() {

  }
}
