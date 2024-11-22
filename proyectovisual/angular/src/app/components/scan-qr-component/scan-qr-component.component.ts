import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';


@Component({
  selector: 'app-scan-qr',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './scan-qr-component.component.html',
  styleUrls: ['./scan-qr-component.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ScanQrComponentComponent {
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onScanSuccess(token: string) {
    this.message = 'Procesando asistencia...';
    this.http.post('/api/qr/asistencia', { token }).subscribe({
      next: (response: any) => {
        this.message = response.message || '¡Asistencia registrada con éxito!';
        setTimeout(() => this.router.navigate(['/inicio']), 3000);
      },
      error: (error) => {
        this.message = error.error?.error || 'Error al registrar asistencia.';
      }
    });
  }
}