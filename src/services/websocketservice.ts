import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public socket: Socket;
  public connected = false;

  constructor() {
    this.socket = io('http://127.0.0.1:3000');
  }

  connect(): void {
    this.socket.on('connect', () => {
      console.log('Connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
  }

  emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  listen<T>(event: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: T) => {
        subscriber.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }
}
