import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListManagementComponent } from './components/list-management/list-management.component';


const routes: Routes = [
  {
    path: 'target-gene-list/manage', component: ListManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetGeneListRoutingModule { }