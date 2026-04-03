import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ArrowLeft,
  Download,
  Heart,
  LucideAngularModule,
  Palette,
  Type,
  Layout,
  Square,
  Layers,
  BookOpen,
  Image,
  MessageCircle,
  Shield,
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
  readonly Palette = Palette;
  readonly Type = Type;
  readonly Layout = Layout;
  readonly Square = Square;
  readonly Layers = Layers;
  readonly BookOpen = BookOpen;
  readonly Image = Image;
  readonly MessageCircle = MessageCircle;
  readonly Shield = Shield;

  readonly primaryColors = [
    { name: 'Sky 500', hex: '#0ea5e9', rgb: '14, 165, 233', usage: 'Primary buttons, active states, links', tw: 'bg-sky-500' },
    { name: 'Sky 600', hex: '#0284c7', rgb: '2, 132, 199', usage: 'Hover states, gradient endpoints', tw: 'bg-sky-600' },
    { name: 'Blue 600', hex: '#2563eb', rgb: '37, 99, 235', usage: 'Accents, highlights, secondary CTAs', tw: 'bg-blue-600' },
    { name: 'Blue 700', hex: '#1d4ed8', rgb: '29, 78, 216', usage: 'Deep accents, active navigation', tw: 'bg-blue-700' },
  ];

  readonly neutralColors = [
    { name: 'White', hex: '#ffffff', rgb: '255, 255, 255', usage: 'Backgrounds, cards', bordered: true },
    { name: 'Gray 50', hex: '#f9fafb', rgb: '249, 250, 251', usage: 'Page backgrounds', bordered: true },
    { name: 'Gray 100', hex: '#f3f4f6', rgb: '243, 244, 246', usage: 'Hover states, dividers', bordered: false },
    { name: 'Gray 200', hex: '#e2e8f0', rgb: '226, 232, 240', usage: 'Borders, input outlines', bordered: false },
    { name: 'Gray 500', hex: '#718096', rgb: '113, 128, 150', usage: 'Secondary text, placeholders', bordered: false },
    { name: 'Gray 900', hex: '#1a202c', rgb: '26, 32, 44', usage: 'Primary text, headings', bordered: false },
  ];

  readonly semanticColors = [
    { name: 'Success', hex: '#10b981', rgb: '16, 185, 129', usage: 'Completed states, confirmations' },
    { name: 'Warning', hex: '#f59e0b', rgb: '245, 158, 11', usage: 'Pending states, caution alerts' },
    { name: 'Error', hex: '#ef4444', rgb: '239, 68, 68', usage: 'Cancelled states, validation errors' },
    { name: 'Info', hex: '#3b82f6', rgb: '59, 130, 246', usage: 'Informational messages, tooltips' },
  ];

  readonly gradients = [
    { name: 'Primary Button', css: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', usage: 'Main CTA buttons, headers' },
    { name: 'Page Background', css: 'linear-gradient(to bottom right, #f0f9ff, #ffffff, #eff6ff)', usage: 'Full-page backgrounds' },
    { name: 'Hero Accent', css: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', usage: 'Hero overlays, feature cards' },
  ];

  readonly typographyScale = [
    { name: 'Display', size: '60px', weight: '700', lh: '1.1', usage: 'Hero titles', tw: 'text-6xl' },
    { name: 'Heading 1', size: '48px', weight: '700', lh: '1.2', usage: 'Page titles', tw: 'text-5xl' },
    { name: 'Heading 2', size: '36px', weight: '700', lh: '1.25', usage: 'Section titles', tw: 'text-4xl' },
    { name: 'Heading 3', size: '30px', weight: '600', lh: '1.3', usage: 'Subsection titles', tw: 'text-3xl' },
    { name: 'Heading 4', size: '24px', weight: '600', lh: '1.35', usage: 'Card titles', tw: 'text-2xl' },
    { name: 'Body Large', size: '18px', weight: '400', lh: '1.6', usage: 'Lead paragraphs', tw: 'text-lg' },
    { name: 'Body', size: '16px', weight: '400', lh: '1.5', usage: 'Default body text', tw: 'text-base' },
    { name: 'Small', size: '14px', weight: '400', lh: '1.5', usage: 'Labels, captions', tw: 'text-sm' },
    { name: 'Tiny', size: '12px', weight: '500', lh: '1.5', usage: 'Badges, metadata', tw: 'text-xs' },
  ];

  readonly spacingScale = [
    { name: 'xs', value: '4px', tw: 'p-1' },
    { name: 'sm', value: '8px', tw: 'p-2' },
    { name: 'md', value: '16px', tw: 'p-4' },
    { name: 'lg', value: '24px', tw: 'p-6' },
    { name: 'xl', value: '32px', tw: 'p-8' },
    { name: '2xl', value: '48px', tw: 'p-12' },
    { name: '3xl', value: '64px', tw: 'p-16' },
  ];

  readonly radii = [
    { name: 'Small', value: '4px', tw: 'rounded' },
    { name: 'Default', value: '8px', tw: 'rounded-lg' },
    { name: 'Medium', value: '12px', tw: 'rounded-xl' },
    { name: 'Large', value: '16px', tw: 'rounded-2xl' },
    { name: 'Full', value: '9999px', tw: 'rounded-full' },
  ];

  readonly shadows = [
    { name: 'Small', tw: 'shadow-sm', css: '0 1px 2px rgba(0,0,0,0.05)', usage: 'Cards, list items' },
    { name: 'Default', tw: 'shadow', css: '0 1px 3px rgba(0,0,0,0.1)', usage: 'Dropdowns' },
    { name: 'Medium', tw: 'shadow-md', css: '0 4px 6px rgba(0,0,0,0.1)', usage: 'Popovers' },
    { name: 'Large', tw: 'shadow-lg', css: '0 10px 15px rgba(0,0,0,0.1)', usage: 'Modals' },
    { name: 'XL', tw: 'shadow-xl', css: '0 20px 25px rgba(0,0,0,0.1)', usage: 'Drawers, sticky nav' },
  ];

  readonly tocItems = [
    { num: '01', label: 'Brand Identity', icon: this.BookOpen },
    { num: '02', label: 'Logo Guidelines', icon: this.Image },
    { num: '03', label: 'Color Palette', icon: this.Palette },
    { num: '04', label: 'Typography', icon: this.Type },
    { num: '05', label: 'Spacing & Layout', icon: this.Layout },
    { num: '06', label: 'Components', icon: this.Square },
    { num: '07', label: 'Shadows & Elevation', icon: this.Layers },
    { num: '08', label: 'Iconography', icon: this.Image },
    { num: '09', label: 'Voice & Tone', icon: this.MessageCircle },
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
