import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should disable START OCR if credentials are not applied', () => {
    component.apiKey = '123';
    component.regulaLicense = 'abc';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const startButton = compiled.querySelectorAll('button')[1] as HTMLButtonElement;
    expect(startButton.disabled).toBeTrue();
  });

  it('should enable START OCR after applyCredentials is called', () => {
    component.apiKey = '123';
    component.regulaLicense = 'abc';
    component.applyCredentials();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const startButton = compiled.querySelectorAll('button')[1] as HTMLButtonElement;
    expect(startButton.disabled).toBeFalse();
  });

  it('should set status if missing credentials', () => {
    component.apiKey = '';
    component.regulaLicense = '';
    component.applyCredentials();
    expect(component.status).toContain('Please provide both API Key and Regula license.');
  });

  it('should set status to success when credentials are applied', () => {
    component.apiKey = 'valid-key';
    component.regulaLicense = 'valid-license';
    component.applyCredentials();
    expect(component.status).toContain('Credentials applied successfully');
  });
});
