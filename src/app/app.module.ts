import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FcfsComponent } from './fcfs/fcfs.component';
import { SjfComponent } from './sjf/sjf.component';
import { RrComponent } from './rr/rr.component';
import { SrtnComponent } from './srtn/srtn.component';
import { JobsComponent } from './jobs/jobs.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    FcfsComponent,
    SjfComponent,
    RrComponent,
    SrtnComponent,
    JobsComponent,
    GanttChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
