import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { Api, FinalResult } from '../../../core/services/api';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-results-display',
  standalone: true,
  imports: [NgClass],
  templateUrl: './results-display.html',
  styleUrls: ['./results-display.css']
})
export class ResultsDisplay implements OnInit {
  uiState: 'waiting' | 'countdown' | 'revealed' = 'waiting';
  countdownValue = 10;
  finalResults: FinalResult[] = [];
  liveCountdown: { hours: string, minutes: string, seconds: string } | null = null;

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.scheduleCountdown();
  }

  scheduleCountdown(): void {
    const targetTime = new Date();
    // HORA OBJETIVO: 6:00:00 PM
    targetTime.setHours(13, 43, 0, 0);

    const timeCheckInterval = setInterval(() => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();

      if (diff > 10000) { // Muestra la cuenta regresiva en vivo si falta más de 10 segundos
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        this.liveCountdown = {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
        };
      } else if (diff > 0 && diff <= 10000) { // Inicia el countdown final de 10 segundos
        clearInterval(timeCheckInterval);
        this.liveCountdown = null; // Oculta la cuenta regresiva en vivo
        this.startCountdown(Math.floor(diff / 1000));
      } else if (diff <= 0) { // Si ya pasó la hora
        clearInterval(timeCheckInterval);
        this.loadResults();
      }
    }, 1000);
  }

  startCountdown(initialValue: number): void {
    this.uiState = 'countdown';
    this.countdownValue = initialValue;
    const countdownInterval = setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue > 0) {
        // La animación se maneja en el CSS
      } else {
        clearInterval(countdownInterval);
        this.loadResults();
      }
    }, 1000);
  }

  loadResults(): void {
    this.apiService.getResults().subscribe({
      next: (data) => {
        this.finalResults = data;
        this.uiState = 'revealed';
        setTimeout(() => this.triggerConfetti(), 300);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error de Carga',
          text: 'No se pudieron cargar los resultados finales.',
          confirmButtonColor: '#5D3EBF'
        });
        this.uiState = 'waiting'; // Vuelve al estado de espera si hay error
      }
    });
  }

  triggerConfetti(): void {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }
}