import { Component, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { OcrId, Envs, EventType, EventTypeUserFeedback, ResultHelper } from 'fw-ocrid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  @ViewChild('container', { static: false }) videoContainer!: ElementRef;

  apiKey: string = '';
  regulaLicense: string = '';
  status: string = '';
  ocrReady: boolean = false;

  private ocrid: OcrId | null = null;
  public processId: string | undefined;
  public result: any;

  applyCredentials(): void {
    if (!this.apiKey || !this.regulaLicense) {
      this.status = 'Please provide both API Key and Regula license.';
      this.ocrReady = false;
      return;
    }

    (window as any).regulaLicense = { license: this.regulaLicense.trim() };
    this.ocrid = new OcrId(this.apiKey, Envs.PRE3, undefined, 'en');
    this.ocrReady = true;
    this.status = 'Credentials applied successfully. Ready to start OCR.';

    this.setupOcrEvents();
  }

  private setupOcrEvents(): void {
    if (!this.ocrid) return;

    this.ocrid.events(EventType.USER_FEEDBACK).subscribe((feedback) => {
      switch (feedback) {
        case EventTypeUserFeedback.SHOW_DOCUMENT_FRONT_SIDE:
          console.log('Muestra el frente del documento.');
          break;
        case EventTypeUserFeedback.SHOW_DOCUMENT_REVERSE_SIDE:
          console.log('Muestra el reverso del documento.');
          break;
        case EventTypeUserFeedback.DOCUMENT_FRONT_SIDE_COMPLETED:
          console.log('Frente del documento escaneado con éxito.');
          break;
        case EventTypeUserFeedback.PROCESS_FAILED_DUE_ANALYSIS_ERROR:
          console.error('Proceso fallido debido a un error de análisis.');
          break;
        case EventTypeUserFeedback.PROCESS_FINISHED:
          console.log('Proceso de escaneo completado.');
          break;
      }
    });

    this.ocrid.events(EventType.RESULT).subscribe((result) => {
      console.log('Escaneo completado con éxito:', result);
      this.status = 'Escaneo completado con éxito.';
      this.getOcrResult(this.processId!);
      this.ocrid?.close(); 
    });

    this.ocrid.events(EventType.ERROR).subscribe((error) => {
      console.error('Ocurrió un error durante el escaneo:', error);
      this.status = `Error durante el escaneo: ${error}`;
    });
  }

  async startCamera(): Promise<void> {
    if (!this.ocrid || !this.videoContainer) {
      this.status = 'OCR instance or video container not available.';
      return;
    }

    try {
      this.processId = await this.ocrid.startStream(this.videoContainer.nativeElement);
      if (this.processId) {
        this.status = 'Proceso OCR iniciado.';
        console.log('Proceso OCR iniciado:', this.processId);
      } else {
        this.status = 'Error al iniciar el proceso OCR.';
      }
    } catch (error) {
      this.status = `Excepción al iniciar OCR: ${error}`;
    }
  }

  async getOcrResult(processId: string): Promise<void> {
    try {
      this.result = await ResultHelper.get(processId, Envs.PRE3);
      console.log('Resultado obtenido:', this.result);
      
      if (this.result?.success) {
        const documentTypes = this.result.value.types;
        const fields = this.result.value.fields;
        const images = this.result.value.images;

        console.log('Tipo de documento:', documentTypes);
        console.log('Campos extraídos:', fields);
        console.log('Imágenes:', images);
      }
    } catch (error) {
      console.error('Error al obtener el resultado OCR:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.ocrid) {
      this.ocrid.close();
    }
  }
}
