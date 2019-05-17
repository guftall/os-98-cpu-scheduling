import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FcfsComponent } from './fcfs/fcfs.component';
import { RrComponent } from './rr/rr.component';
import { SjfComponent } from './sjf/sjf.component';
import { SrtnComponent } from './srtn/srtn.component';

const routes: Routes = [
  {path: 'FirstComeFirstServe', component: FcfsComponent},
  {path: 'RoundRobin', component: RrComponent},
  {path: 'SmallestJobFirst', component: SjfComponent},
  {path: 'ShortestRemainingTimeNext', component: SrtnComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
