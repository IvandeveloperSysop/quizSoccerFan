import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { SafePipe } from './../safe.pipe';

@NgModule({
  declarations: [SafePipe],
  imports: [IonicModule],
  exports: [SafePipe]
})
export class PipesModule {}