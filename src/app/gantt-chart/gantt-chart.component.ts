import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Job } from '../Job';
import { GanttChartService } from './gantt-chart.service';
import { Subscription } from 'rxjs';
import { Scheduler } from '../Scheduler';

export const TIMER_MS = 50;
@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css']
})
export class GanttChartComponent implements OnInit, OnDestroy {

  @Input() scheduler: Scheduler;
  @Output() jobReceived = new EventEmitter();
  startSubscription: Subscription;
  stopSubscription: Subscription;
  timer;
  parts: GanttPart[];
  isIdle: boolean;
  prev: Job;
  now: number;
  constructor(
    private ganttChartService: GanttChartService
  ) {
    this.now = 0;
    this.initParts();
    this.isIdle = false;
    this.startSubscription = ganttChartService.$startChart.subscribe(() => {
      this.start.bind(this)();
    })
    this.stopSubscription = ganttChartService.$stopChart.subscribe(() => {
      this.stopTimer.bind(this)();
    })

  }
  initParts() {

    this.parts = [];
    this.parts.push({length: 0, color: "", margin: 0, name: ""})
  }

  ngOnInit() {
  }
  calculateMargin(index: number) {
    var r = 0;
    for (var i=0; i<index; i++){
      r += this.parts[i].length;
    }
    return r;
  }
  start() {
    let that = this;
    this.initParts();
    if (this.timer != undefined)
    {
      alert('Timer is already started');
      return;
    }
    var allJobs = that.scheduler.jobs;


    this.timer = setInterval(() => {

      for (var i=0; i<allJobs.length; i++) {

        if (allJobs[i].remainingTime == -1 && allJobs[i].arrivalTime <= that.now) {
          that.jobReceived.emit(`${i}`);
        }
      }

      var current: Job = that.scheduler.current.bind(that.scheduler)();

      if (current == undefined && !that.isIdle) {
        that.isIdle = true;

        var part = new GanttPart();
        part.name = "";
        part.color = "#e51c23";
        that.parts.push(part);
        part.margin = that.calculateMargin.bind(that)(that.parts.length - 1);
      }
      else if (current != undefined) {

        that.isIdle = false;
        --current.quantum;
        --current.remainingTime;

        if (that.prev != current) {

          that.prev = current;
          var part = new GanttPart();
          part.name = that.scheduler._current.name();
          part.color = current.backgroundColor;
          that.parts.push(part);
          part.margin = that.calculateMargin.bind(that)(that.parts.length - 1);
        }
      }

      ++that.parts[that.parts.length - 1].length;

      ++that.now;
    }, TIMER_MS)
  }
  stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
    // this.parts = [];
    this.isIdle = false;
    this.prev = undefined;
    this.scheduler.reset();
  }
  ngOnDestroy(): void {
    this.startSubscription.unsubscribe();
    this.stopSubscription.unsubscribe();
  }
}

class GanttPart {
  name: string;
  length: number;
  margin: number;
  color: string;

  constructor() {
    this.length = 0;
  }
}

