import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BasesPage } from './bases.page';

describe('BasesPage', () => {
  let component: BasesPage;
  let fixture: ComponentFixture<BasesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
