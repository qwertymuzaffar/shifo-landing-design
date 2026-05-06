import { Injectable, signal } from '@angular/core';

export type DocumentCategory = 'tests' | 'imaging' | 'reports';

export interface SourceAppointment {
  id: string;
  doctor: string;
  specialization: string;
  date: string;
}

export interface PatientDocument {
  id: string;
  type: string;
  name: string;
  date: string;
  size: string;
  category: DocumentCategory;
  appointment: SourceAppointment;
}

const apt = (id: string, doctor: string, specialization: string, date: string): SourceAppointment =>
  ({ id, doctor, specialization, date });

const A = {
  p001: apt('apt-p-001', 'Алишер Каримов',     'Терапевт',        '2026-04-22'),
  p002: apt('apt-p-002', 'Дилноза Рашидова',   'Кардиолог',       '2026-04-15'),
  p003: apt('apt-p-003', 'Фарход Юсупов',      'Офтальмолог',     '2026-04-08'),
  p004: apt('apt-p-004', 'Шерзод Махмудов',    'Хирург',          '2026-03-25'),
  p005: apt('apt-p-005', 'Алишер Каримов',     'Терапевт',        '2026-03-18'),
  p006: apt('apt-p-006', 'Малика Сатторова',   'Дерматолог',      '2026-03-04'),
  p007: apt('apt-p-007', 'Зарина Холова',      'Эндокринолог',    '2026-02-26'),
  p008: apt('apt-p-008', 'Алишер Каримов',     'Терапевт',        '2026-02-12'),
  p009: apt('apt-p-009', 'Бахтиёр Назаров',    'ЛОР',             '2026-02-05'),
  p010: apt('apt-p-010', 'Гульнора Исмоилова', 'Гинеколог',       '2026-01-28'),
  p012: apt('apt-p-012', 'Алишер Каримов',     'Терапевт',        '2026-01-14'),
  p013: apt('apt-p-013', 'Нилуфар Азимова',    'Невролог',        '2025-12-30'),
  p014: apt('apt-p-014', 'Парвиз Ёдгоров',     'Травматолог',     '2025-12-15'),
  p015: apt('apt-p-015', 'Алишер Каримов',     'Терапевт',        '2025-12-01'),
  p016: apt('apt-p-016', 'Дилноза Рашидова',   'Кардиолог',       '2025-11-20'),
  p017: apt('apt-p-017', 'Шерзод Махмудов',    'Хирург',          '2025-11-10'),
  p018: apt('apt-p-018', 'Алишер Каримов',     'Терапевт',        '2025-10-28'),
  p019: apt('apt-p-019', 'Сухроб Раджабов',    'Гастроэнтеролог', '2025-10-15'),
  p022: apt('apt-p-022', 'Алишер Каримов',     'Терапевт',        '2025-09-15'),
  p024: apt('apt-p-024', 'Алишер Каримов',     'Терапевт',        '2025-08-25'),
  p025: apt('apt-p-025', 'Дилноза Рашидова',   'Кардиолог',       '2025-08-18'),
  p026: apt('apt-p-026', 'Зарина Холова',      'Эндокринолог',    '2025-08-10'),
  p031: apt('apt-p-031', 'Гульнора Исмоилова', 'Гинеколог',       '2025-04-18')
};

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private _documents = signal<PatientDocument[]>([
    { id: 'd-01', type: 'Анализ крови',             name: 'analiz_krovi_2026_04_22.pdf',         date: '2026-04-22', size: '245 KB', category: 'tests',   appointment: A.p001 },
    { id: 'd-02', type: 'Заключение терапевта',     name: 'zaklyuchenie_terapevta_2026_04.pdf',  date: '2026-04-22', size: '92 KB',  category: 'reports', appointment: A.p001 },
    { id: 'd-03', type: 'ЭКГ',                      name: 'ekg_2026_04_15.pdf',                  date: '2026-04-15', size: '168 KB', category: 'imaging', appointment: A.p002 },
    { id: 'd-04', type: 'Заключение кардиолога',    name: 'zaklyuchenie_kardiologa_2026_04.pdf', date: '2026-04-15', size: '115 KB', category: 'reports', appointment: A.p002 },
    { id: 'd-05', type: 'Заключение офтальмолога',  name: 'zaklyuchenie_oftalmologa.pdf',        date: '2026-04-08', size: '78 KB',  category: 'reports', appointment: A.p003 },

    { id: 'd-06', type: 'УЗИ брюшной полости',      name: 'uzi_bryushnoy_2026_03_25.pdf',        date: '2026-03-25', size: '912 KB', category: 'imaging', appointment: A.p004 },
    { id: 'd-07', type: 'Заключение хирурга',       name: 'zaklyuchenie_hirurga.pdf',            date: '2026-03-25', size: '104 KB', category: 'reports', appointment: A.p004 },
    { id: 'd-08', type: 'Анализ мочи',              name: 'analiz_mochi_2026_03_18.pdf',         date: '2026-03-18', size: '162 KB', category: 'tests',   appointment: A.p005 },
    { id: 'd-09', type: 'Биохимический анализ',     name: 'biohimiya_2026_03_18.pdf',            date: '2026-03-18', size: '208 KB', category: 'tests',   appointment: A.p005 },
    { id: 'd-10', type: 'Биопсия',                  name: 'biopsiya_2026_03_04.pdf',             date: '2026-03-04', size: '345 KB', category: 'tests',   appointment: A.p006 },
    { id: 'd-11', type: 'Заключение дерматолога',   name: 'zaklyuchenie_dermatologa.pdf',        date: '2026-03-04', size: '98 KB',  category: 'reports', appointment: A.p006 },

    { id: 'd-12', type: 'Анализ на гормоны',        name: 'analiz_gormony_2026_02_26.pdf',       date: '2026-02-26', size: '224 KB', category: 'tests',   appointment: A.p007 },
    { id: 'd-13', type: 'УЗИ щитовидной железы',    name: 'uzi_shchitovidnoy_2026_02.pdf',       date: '2026-02-26', size: '780 KB', category: 'imaging', appointment: A.p007 },
    { id: 'd-14', type: 'Заключение эндокринолога', name: 'zaklyuchenie_endokrinologa.pdf',      date: '2026-02-26', size: '128 KB', category: 'reports', appointment: A.p007 },
    { id: 'd-15', type: 'Общий анализ крови',       name: 'analiz_krovi_obshiy_2026_02.pdf',     date: '2026-02-12', size: '198 KB', category: 'tests',   appointment: A.p008 },
    { id: 'd-16', type: 'Заключение ЛОРа',          name: 'zaklyuchenie_lora.pdf',               date: '2026-02-05', size: '86 KB',  category: 'reports', appointment: A.p009 },

    { id: 'd-17', type: 'УЗИ органов малого таза',  name: 'uzi_malogo_taza_2026_01.pdf',         date: '2026-01-28', size: '845 KB', category: 'imaging', appointment: A.p010 },
    { id: 'd-18', type: 'Заключение гинеколога',    name: 'zaklyuchenie_ginekologa.pdf',         date: '2026-01-28', size: '109 KB', category: 'reports', appointment: A.p010 },
    { id: 'd-19', type: 'Флюорография',             name: 'flyuorografiya_2026_01_14.pdf',       date: '2026-01-14', size: '2.0 MB', category: 'imaging', appointment: A.p012 },
    { id: 'd-20', type: 'Анализ крови',             name: 'analiz_krovi_2026_01_14.pdf',         date: '2026-01-14', size: '241 KB', category: 'tests',   appointment: A.p012 },

    { id: 'd-21', type: 'МРТ позвоночника',         name: 'mrt_pozvonochnika_2025_12.pdf',       date: '2025-12-30', size: '4.6 MB', category: 'imaging', appointment: A.p013 },
    { id: 'd-22', type: 'Заключение невролога',     name: 'zaklyuchenie_nevrologa.pdf',          date: '2025-12-30', size: '142 KB', category: 'reports', appointment: A.p013 },
    { id: 'd-23', type: 'Рентген коленного сустава', name: 'rentgen_kolennogo_sustava.pdf',      date: '2025-12-15', size: '1.4 MB', category: 'imaging', appointment: A.p014 },
    { id: 'd-24', type: 'Заключение травматолога',  name: 'zaklyuchenie_travmatologa.pdf',       date: '2025-12-15', size: '95 KB',  category: 'reports', appointment: A.p014 },
    { id: 'd-25', type: 'Анализ крови',             name: 'analiz_krovi_2025_12_01.pdf',         date: '2025-12-01', size: '232 KB', category: 'tests',   appointment: A.p015 },

    { id: 'd-26', type: 'ЭхоКГ',                    name: 'ehokg_2025_11_20.pdf',                date: '2025-11-20', size: '1.1 MB', category: 'imaging', appointment: A.p016 },
    { id: 'd-27', type: 'ЭКГ',                      name: 'ekg_2025_11_20.pdf',                  date: '2025-11-20', size: '156 KB', category: 'imaging', appointment: A.p016 },
    { id: 'd-28', type: 'Заключение кардиолога',    name: 'zaklyuchenie_kardiologa_2025_11.pdf', date: '2025-11-20', size: '118 KB', category: 'reports', appointment: A.p016 },
    { id: 'd-29', type: 'Рентген грудной клетки',   name: 'rentgen_grudnoy_kletki_2025_11.pdf',  date: '2025-11-10', size: '1.2 MB', category: 'imaging', appointment: A.p017 },

    { id: 'd-30', type: 'Анализ крови',             name: 'analiz_krovi_2025_10_28.pdf',         date: '2025-10-28', size: '236 KB', category: 'tests',   appointment: A.p018 },
    { id: 'd-31', type: 'Заключение гастроэнтеролога', name: 'zaklyuchenie_gastro.pdf',          date: '2025-10-15', size: '124 KB', category: 'reports', appointment: A.p019 },
    { id: 'd-32', type: 'Анализ кала',              name: 'analiz_kala_2025_10_15.pdf',          date: '2025-10-15', size: '142 KB', category: 'tests',   appointment: A.p019 },

    { id: 'd-33', type: 'Флюорография',             name: 'flyuorografiya_2025_09.pdf',          date: '2025-09-15', size: '2.1 MB', category: 'imaging', appointment: A.p022 },

    { id: 'd-34', type: 'Общий анализ крови',       name: 'analiz_krovi_obshiy_2025_08.pdf',     date: '2025-08-25', size: '215 KB', category: 'tests',   appointment: A.p024 },
    { id: 'd-35', type: 'Биохимический анализ',     name: 'biohimiya_2025_08_25.pdf',            date: '2025-08-25', size: '244 KB', category: 'tests',   appointment: A.p024 },
    { id: 'd-36', type: 'Заключение терапевта',     name: 'zaklyuchenie_terapevta_2025_08.pdf',  date: '2025-08-25', size: '102 KB', category: 'reports', appointment: A.p024 },
    { id: 'd-37', type: 'ЭКГ',                      name: 'ekg_2025_08_18.pdf',                  date: '2025-08-18', size: '160 KB', category: 'imaging', appointment: A.p025 },
    { id: 'd-38', type: 'Заключение кардиолога',    name: 'zaklyuchenie_kardiologa_2025_08.pdf', date: '2025-08-18', size: '110 KB', category: 'reports', appointment: A.p025 },
    { id: 'd-39', type: 'Анализ на сахар',          name: 'analiz_sahar_2025_08_10.pdf',         date: '2025-08-10', size: '154 KB', category: 'tests',   appointment: A.p026 },
    { id: 'd-40', type: 'Заключение эндокринолога', name: 'zaklyuchenie_endokr_2025_08.pdf',     date: '2025-08-10', size: '128 KB', category: 'reports', appointment: A.p026 },

    { id: 'd-41', type: 'УЗИ органов малого таза',  name: 'uzi_malogo_taza_2025_04.pdf',         date: '2025-04-18', size: '820 KB', category: 'imaging', appointment: A.p031 },
    { id: 'd-42', type: 'Маммография',              name: 'mammografiya_2025_04_18.pdf',         date: '2025-04-18', size: '1.8 MB', category: 'imaging', appointment: A.p031 },
    { id: 'd-43', type: 'Заключение гинеколога',    name: 'zaklyuchenie_ginekologa_2025_04.pdf', date: '2025-04-18', size: '108 KB', category: 'reports', appointment: A.p031 }
  ]);

  documents = this._documents.asReadonly();

  getById(id: string): PatientDocument | undefined {
    return this._documents().find(d => d.id === id);
  }

  forAppointment(appointmentId: string): PatientDocument[] {
    return this._documents().filter(d => d.appointment.id === appointmentId);
  }
}
