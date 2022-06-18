import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadTicketsPage } from './upload-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: UploadTicketsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadTicketsPageRoutingModule {}
