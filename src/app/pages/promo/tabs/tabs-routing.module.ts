import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'upload',
        loadChildren: () => import('../upload-tickets/upload-tickets.module').then(m => m.UploadTicketsPageModule)
      },
      {
        path: 'positions',
        loadChildren: () => import('../positions/positions.module').then(m => m.PositionsPageModule)
      },
      {
        path: 'awards',
        loadChildren: () => import('../awards/awards.module').then(m => m.AwardsPageModule)
      },
      {
        path: '',
        redirectTo: '/promo/upload',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/promo/upload',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
