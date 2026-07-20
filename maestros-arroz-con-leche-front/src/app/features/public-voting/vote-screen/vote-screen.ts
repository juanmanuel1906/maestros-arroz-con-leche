import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Api, VotePayload } from '../../../core/services/api';
import { DeviceIdService } from '../../../core/services/device-id';

@Component({
  selector: 'app-vote-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vote-screen.html',
  styleUrls: ['./vote-screen.css']
})
export class VoteScreen implements OnInit {
  // Estado del componente
  emprendedores: any[] = [];
  selectedStandId: number | null = null;
  
  ratings = {
    sabor: 0,
    creatividad: 0,
    presentacion: 0
  };
  uiState: 'loading' | 'selecting' | 'voting' | 'submitting' = 'loading';
  
  // Constante para el número de estrellas
  stars = [1, 2, 3, 4, 5];

  // Inyección de dependencias a través del constructor
  constructor(private apiService: Api, private deviceIdService: DeviceIdService) {}

  ngOnInit(): void {
    this.loadEmprendedores();
  }

  loadEmprendedores(): void {
    this.uiState = 'loading';
    this.apiService.getEmprendedores().subscribe({
      next: (data) => {
        this.emprendedores = data;
        this.uiState = 'selecting';
        console.log('Emprendedores cargados:', this.emprendedores);
        
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: `Error de Carga: ${err.message}`,
          text: 'No se pudo cargar la lista de emprendedores. Por favor, intenta de nuevo más tarde.',
          confirmButtonColor: '#5D3EBF'
        });
      }
    });
  }

  onStandSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const id = parseInt(target.value, 10);
    if (id) {
      this.selectedStandId = id;
      this.uiState = 'voting';
      // Resetea las calificaciones al cambiar de emprendedor
      this.ratings = { sabor: 0, creatividad: 0, presentacion: 0 };
    } else {
      this.selectedStandId = null;
      this.uiState = 'selecting';
    }
  }

  setRating(category: 'sabor' | 'creatividad' | 'presentacion', value: number): void {
    if (this.uiState === 'voting') {
        this.ratings[category] = value;
    }
  }

  async submitVote(): Promise<void> { // Se convierte en async
    if (!this.selectedStandId) {
        Swal.fire('Error', 'Debes seleccionar un emprendedor.', 'error');
        return;
    }
    if (Object.values(this.ratings).some(r => r === 0)) {
        Swal.fire('Atención', 'Por favor, califica todos los criterios antes de votar.', 'warning');
        return;
    }

    this.uiState = 'submitting';

    try {
        // 1. Obtener el ID del dispositivo
        const deviceId = await this.deviceIdService.getVisitorId();

        const payload: VotePayload = {
          emprendedor_id: this.selectedStandId,
          device_id: deviceId,
          calificacion_sabor: this.ratings.sabor,
          calificacion_creatividad: this.ratings.creatividad,
          calificacion_presentacion: this.ratings.presentacion
        };

        // 3. Enviar el voto
        this.apiService.submitPublicVote(payload).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Voto registrado!',
              text: 'Muchas gracias por ser parte del festival y apoyar el talento local.',
              timer: 3000,
              showConfirmButton: false
            });
            this.resetForm();
          },
          error: (err) => {
            const errorMessage = err.status === 409 
              ? 'Ya has votado por este emprendedor.'
              : 'Hubo un problema al registrar tu voto. Inténtalo de nuevo.';
            
            Swal.fire({
                icon: 'error',
                title: '¡Oops!',
                confirmButtonText: '<b>ENTENDIDO</b>',
                confirmButtonColor: '#2c00b2ff',
                text: errorMessage,
            });
            this.uiState = 'voting';
          }
        });

    } catch (error) {
        console.error('Error al obtener el ID del dispositivo:', error);
        Swal.fire('Error Crítico', 'No se pudo identificar tu dispositivo. No es posible votar.', 'error');
        this.uiState = 'voting';
    }
  }
  
  private resetForm(): void {
    this.selectedStandId = null;
    this.uiState = 'selecting';
    this.ratings = { sabor: 0, creatividad: 0, presentacion: 0 };
    // Esto requiere que el elemento select también se resetee en el HTML,
    // lo cual se puede manejar con [(ngModel)] si se usa FormsModule.
    // Por simplicidad, el usuario puede re-seleccionar.
  }
}