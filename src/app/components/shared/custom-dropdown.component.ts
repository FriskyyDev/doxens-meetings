import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface DropdownOption {
  value: any;
  label: string;
  selected?: boolean;
}

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [CommonModule, MatIconModule],  template: `
    <div class="relative">
      <button 
        type="button" 
        class="relative w-full cursor-pointer rounded-lg bg-gray-800 border border-gray-600 py-3 pl-4 pr-10 text-left text-white shadow-lg hover:bg-gray-750 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
        [class.ring-2]="isOpen"
        [class.ring-primary-500]="isOpen"
        [class.border-primary-500]="isOpen"
        (click)="toggle()">
        <span class="block truncate">
          {{ selectedLabel || placeholder }}
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <mat-icon class="text-gray-400 text-xl transition-transform duration-200"
                    [class.rotate-180]="isOpen">
            expand_more
          </mat-icon>
        </span>
      </button>

      @if (isOpen) {
        <div class="absolute z-10 mt-1 w-full rounded-lg bg-gray-800 border border-gray-600 shadow-xl">
          <ul class="max-h-60 overflow-auto rounded-lg py-1 text-base focus:outline-none">
            @for (option of options; track option.value) {
              <li>
                <button type="button" 
                        class="relative w-full cursor-pointer select-none py-3 pl-4 pr-9 text-left text-white hover:bg-primary-500/10 transition-colors duration-150" 
                        [class.bg-primary-500/20]="option.selected" 
                        [class.text-primary-400]="option.selected" 
                        (click)="selectOption(option)">
                  <span class="block truncate">{{ option.label }}</span>
                  @if (option.selected) {
                    <span class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <mat-icon class="text-primary-400 text-lg">check</mat-icon>
                    </span>
                  }
                </button>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    /* Custom dropdown animations and hover effects */
    .dropdown-enter {
      animation: dropdown-enter 0.15s ease-out;
    }

    @keyframes dropdown-enter {
      from {
        opacity: 0;
        transform: scaleY(0.95);
      }
      to {
        opacity: 1;
        transform: scaleY(1);
      }
    }

    /* Better focus and hover states */
    .dropdown-button:focus {
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.5);
    }

    /* Smooth background color transitions */
    .dropdown-option {
      transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
    }
  `]
})
export class CustomDropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() selectedValue: any = null;
  @Input() placeholder: string = 'Select an option';
  @Output() selectionChange = new EventEmitter<any>();

  isOpen = false;

  get selectedLabel(): string | null {
    const selected = this.options.find(opt => opt.value === this.selectedValue);
    return selected?.label || null;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: DropdownOption): void {
    this.selectionChange.emit(option.value);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-custom-dropdown')) {
      this.isOpen = false;
    }
  }
}
