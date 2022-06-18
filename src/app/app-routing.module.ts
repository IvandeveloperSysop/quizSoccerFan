import { PositionsPageModule } from './pages/customer/positions/positions.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/customer/home/home.module').then( m => m.HomePageModule),
    canActivate: [ AuthGuard ]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/customer/home/home.module').then( m => m.HomePageModule),
    canActivate: [ AuthGuard ]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  // {
  //   path: 'registerSocial/:name/:email/:id/:photoUrl/:provider/:authToken/:url',
  //   loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
  //   pathMatch: 'full'
  // },
  {
    path: 'registerSocial/:name/:email/:id/:photoUrl/:provider/:authToken',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    pathMatch: 'full'
  },
  {
    path: 'customer',
    loadChildren: () => import('./pages/customer/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [ AuthGuard ]
  },
  {
    path: 'customer/tickets',
    loadChildren: () => import('./pages/customer/profile/tickets/tickets.module').then( m => m.TicketsPageModule)
  },
  {
    path: 'customer/vouchers',
    loadChildren: () => import('./pages/customer/profile/vouchers/vouchers.module').then( m => m.VouchersPageModule)
  },
  {
    path: 'customer/friends',
    loadChildren: () => import('./pages/customer/profile/friends/friends.module').then( m => m.FriendsPageModule)
  },
  {
    path: 'customer/edit-profile',
    loadChildren: () => import('./pages/customer/profile/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'customer/bases',
    loadChildren: () => import('./pages/customer/info/bases/bases.module').then( m => m.BasesPageModule)
  },
  {
    path: 'customer/steps',
    loadChildren: () => import('./pages/customer/info/steps/steps.module').then( m => m.StepsPageModule)
  },
  {
    path: 'customer/steps/:instructions',
    loadChildren: () => import('./pages/customer/info/steps/steps.module').then( m => m.StepsPageModule)
  },
  {
    path: 'customer/dates',
    loadChildren: () => import('./pages/customer/info/dates/dates.module').then( m => m.DatesPageModule)
  },
  {
    path: 'customer/winners',
    loadChildren: () => import('./pages/customer/info/winners/winners.module').then( m => m.WinnersPageModule)
  },
  {
    path: 'customer/contact',
    loadChildren: () => import('./pages/customer/info/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'customer/minigame/:idMinigame',
    loadChildren: () => import('./pages/customer/minigame/minigame.module').then( m => m.MinigamePageModule)
  },
  {
    path: 'refer',
    loadChildren: () => import('./pages/refer/refer.module').then( m => m.ReferPageModule)
  },
  {
    path: 'refer/:token',
    loadChildren: () => import('./pages/refer/refer.module').then( m => m.ReferPageModule)
  },
  {
    path: 'register/campaign',
    loadChildren: () => import('./pages/campaign/campaign.module').then( m => m.CampaignPageModule)
  },
  {
    path: 'register/campaign/:slug',
    loadChildren: () => import('./pages/campaign/campaign.module').then( m => m.CampaignPageModule)
  },
  {
    path: 'customer/share',
    loadChildren: () => import('./pages/customer/share/share.module').then( m => m.SharePageModule)
  },
  {
    path: 'notfound',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
  {
    path: 'customer/notifications',
    loadChildren: () => import('./pages/customer/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'minigame-instructions',
    loadChildren: () => import('./pages/customer/minigame-instructions/minigame-instructions.module').then( m => m.MinigameInstructionsPageModule)
  },
  {
    path: 'reset-password/:idUser/:tokenUser',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('./pages/modal/modal.module').then( m => m.ModalPageModule)
  },
  {
    path: 'home-modal',
    loadChildren: () => import('./home-modal/home-modal.module').then( m => m.HomeModalPageModule)
  },
  // {
  //   path: 'products-details/:productId',
  //   loadChildren: () => import('./modals/products-details/products-details.module').then( m => m.ProductsDetailsPageModule)
  // },
  {
    path: 'positions',
    loadChildren: () => import('./pages/customer/positions/positions.module').then(m => m.PositionsPageModule)
  },
  {
    path: 'promo',
    loadChildren: () => import('./pages/promo/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [ AuthGuard ]
  },
  {
    path: 'product/:productId',
    loadChildren: () => import('./pages/shop/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'cart/:productId',
    loadChildren: () => import('./pages/shop/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'shop/orders',
    loadChildren: () => import('./pages/shop/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'shop/wallet',
    loadChildren: () => import('./pages/shop/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'promo/steps',
    loadChildren: () => import('./pages/promo/steps/steps.module').then( m => m.StepsPageModule)
  },
  {
    path: 'promo/steps/:instructions',
    loadChildren: () => import('./pages/promo/steps/steps.module').then( m => m.StepsPageModule)
  },
  {
    path: 'vouchers',
    loadChildren: () => import('./pages/customer/profile/vouchers/vouchers.module').then( m => m.VouchersPageModule)
  },
  {
    path: 'vouchers',
    loadChildren: () => import('./pages/customer/profile/vouchers/vouchers.module').then( m => m.VouchersPageModule)
  },
  {
    path: 'slider-modal',
    loadChildren: () => import('./modals/slider-modal/slider-modal.module').then( m => m.SliderModalPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./modals/intro/intro.module').then( m => m.IntroPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
