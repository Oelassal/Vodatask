import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  selectedUserId!: number;

  onUserSelected(userId: number): void {
    this.selectedUserId = userId;
  }
}
