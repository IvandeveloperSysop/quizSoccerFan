import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadTicketsPageRoutingModule } from './upload-tickets-routing.module';

import { UploadTicketsPage } from './upload-tickets.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadTicketsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [UploadTicketsPage]
})
export class UploadTicketsPageModule {}
