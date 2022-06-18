import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { HeaderShopComponent } from './header-shop/header-shop.component';


const PAGES_COMPONENTS = [
  HeaderComponent,
  HeaderShopComponent
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    PAGES_COMPONENTS
  ],
  exports: [
    PAGES_COMPONENTS
  ],
})
export class ComponentsModule { }
