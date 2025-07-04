import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Test Component</h1>
      <p>This is a test component to verify routing works.</p>
      <p>Current time: {{ currentTime }}</p>
    </div>
  `
})
export class TestComponent {
  currentTime = new Date().toLocaleString();
}
