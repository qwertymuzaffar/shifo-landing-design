import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ArrowLeft,
  Download,
  Heart,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-brandbook',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './brandbook.html',
  styleUrl: './brandbook.scss',
})
export class BrandbookComponent {
  readonly Heart = Heart;
  readonly ArrowLeft = ArrowLeft;
  readonly Download = Download;

  readonly version = '9';
  readonly date = 'April 3, 2026';

  readonly primaryColors = [
    { name: 'Sky 500', hex: '#0ea5e9', rgb: '14, 165, 233', usage: 'Primary buttons, active states, links' },
    { name: 'Sky 600', hex: '#0284c7', rgb: '2, 132, 199', usage: 'Hover states, gradient endpoints' },
    { name: 'Blue 600', hex: '#2563eb', rgb: '37, 99, 235', usage: 'Accents, highlights, secondary CTAs' },
    { name: 'Blue 700', hex: '#1d4ed8', rgb: '29, 78, 216', usage: 'Deep accents, active navigation' },
  ];

  readonly neutralColors = [
    { name: 'White', hex: '#ffffff', rgb: '255, 255, 255', usage: 'Backgrounds, cards' },
    { name: 'Gray 50', hex: '#f9fafb', rgb: '249, 250, 251', usage: 'Page backgrounds' },
    { name: 'Gray 100', hex: '#f3f4f6', rgb: '243, 244, 246', usage: 'Hover states, dividers' },
    { name: 'Gray 200', hex: '#e2e8f0', rgb: '226, 232, 240', usage: 'Borders, input outlines' },
    { name: 'Gray 500', hex: '#718096', rgb: '113, 128, 150', usage: 'Secondary text, placeholders' },
    { name: 'Gray 900', hex: '#1a202c', rgb: '26, 32, 44', usage: 'Primary text, headings' },
  ];

  readonly semanticColors = [
    { name: 'Success', hex: '#10b981', rgb: '16, 185, 129', usage: 'Completed states, confirmations' },
    { name: 'Warning', hex: '#f59e0b', rgb: '245, 158, 11', usage: 'Pending states, caution alerts' },
    { name: 'Error', hex: '#ef4444', rgb: '239, 68, 68', usage: 'Cancelled states, validation errors' },
    { name: 'Info', hex: '#3b82f6', rgb: '59, 130, 246', usage: 'Informational messages, tooltips' },
  ];

  readonly gradients = [
    {
      name: 'Primary Button',
      css: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      usage: 'Main CTA buttons, headers',
    },
    {
      name: 'Page Background',
      css: 'linear-gradient(to bottom right, #f0f9ff, #ffffff, #eff6ff)',
      usage: 'Full-page backgrounds',
    },
    {
      name: 'Hero Accent',
      css: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      usage: 'Hero section overlays',
    },
  ];

  readonly typographyScale = [
    { name: 'Display', size: '3.75rem / 60px', weight: '700', lineHeight: '1.1', tag: 'h1', usage: 'Hero titles' },
    { name: 'Heading 1', size: '3rem / 48px', weight: '700', lineHeight: '1.2', tag: 'h1', usage: 'Page titles' },
    { name: 'Heading 2', size: '2.25rem / 36px', weight: '700', lineHeight: '1.25', tag: 'h2', usage: 'Section titles' },
    { name: 'Heading 3', size: '1.875rem / 30px', weight: '600', lineHeight: '1.3', tag: 'h3', usage: 'Subsection titles' },
    { name: 'Heading 4', size: '1.5rem / 24px', weight: '600', lineHeight: '1.35', tag: 'h4', usage: 'Card titles' },
    { name: 'Body Large', size: '1.125rem / 18px', weight: '400', lineHeight: '1.6', tag: 'p', usage: 'Lead paragraphs' },
    { name: 'Body', size: '1rem / 16px', weight: '400', lineHeight: '1.5', tag: 'p', usage: 'Default body text' },
    { name: 'Small', size: '0.875rem / 14px', weight: '400', lineHeight: '1.5', tag: 'span', usage: 'Labels, captions' },
    { name: 'Tiny', size: '0.75rem / 12px', weight: '500', lineHeight: '1.5', tag: 'span', usage: 'Badges, metadata' },
  ];

  readonly spacingScale = [
    { name: 'xs', value: '4px', tailwind: 'p-1' },
    { name: 'sm', value: '8px', tailwind: 'p-2' },
    { name: 'md', value: '16px', tailwind: 'p-4' },
    { name: 'lg', value: '24px', tailwind: 'p-6' },
    { name: 'xl', value: '32px', tailwind: 'p-8' },
    { name: '2xl', value: '48px', tailwind: 'p-12' },
    { name: '3xl', value: '64px', tailwind: 'p-16' },
  ];

  readonly borderRadii = [
    { name: 'Small', value: '4px', tailwind: 'rounded' },
    { name: 'Default', value: '8px', tailwind: 'rounded-lg' },
    { name: 'Medium', value: '12px', tailwind: 'rounded-xl' },
    { name: 'Large', value: '16px', tailwind: 'rounded-2xl' },
    { name: 'XL', value: '20px', tailwind: 'rounded-[20px]' },
    { name: 'Full', value: '9999px', tailwind: 'rounded-full' },
  ];

  readonly shadowScale = [
    { name: 'Small', value: '0 1px 2px rgba(0,0,0,0.05)', tailwind: 'shadow-sm' },
    { name: 'Default', value: '0 1px 3px rgba(0,0,0,0.1)', tailwind: 'shadow' },
    { name: 'Medium', value: '0 4px 6px rgba(0,0,0,0.1)', tailwind: 'shadow-md' },
    { name: 'Large', value: '0 10px 15px rgba(0,0,0,0.1)', tailwind: 'shadow-lg' },
    { name: 'XL', value: '0 20px 25px rgba(0,0,0,0.1)', tailwind: 'shadow-xl' },
  ];

  isExporting = signal(false);

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }

  exportPdf() {
    this.isExporting.set(true);
    setTimeout(() => {
      window.print();
      this.isExporting.set(false);
    }, 100);
  }
}
