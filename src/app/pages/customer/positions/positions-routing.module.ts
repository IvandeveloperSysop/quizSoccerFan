import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PositionsPage } from './positions.page';

const routes: Routes = [
  {
    path: '',
    component: PositionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionsPageRoutingModule {}
