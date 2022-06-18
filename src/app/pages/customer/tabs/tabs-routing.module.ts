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
        path: 'shop',
        loadChildren: () => import('../../shop/products/products.module').then(m => m.ProductsPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('../help/help.module').then(m => m.HelpPageModule)
      },
      {
        path: '',
        redirectTo: '/customer/upload',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/customer/upload',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
