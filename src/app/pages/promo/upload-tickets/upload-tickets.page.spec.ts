import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadTicketsPage } from './upload-tickets.page';

describe('UploadTicketsPage', () => {
  let component: UploadTicketsPage;
  let fixture: ComponentFixture<UploadTicketsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadTicketsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadTicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
