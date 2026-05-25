import Papa from 'papaparse';
import type { SolarDataPoint } from '@/types/solar';

export type ParseResult =
  | { ok: true; data: SolarDataPoint[] }
  | { ok: false; error: string };

const parseCsvFile = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const sample = results.data[0];
        if (!sample) {
          resolve({ ok: false, error: 'CSV file is empty.' });
          return;
        }

        const cols = Object.keys(sample);
        const kwhCol = cols.includes('production_kwh')
          ? 'production_kwh'
          : cols.includes('daily_production_kwh')
            ? 'daily_production_kwh'
            : null;

        if (!cols.includes('date') || !kwhCol) {
          resolve({
            ok: false,
            error: `CSV must have "date" and "production_kwh" (or "daily_production_kwh"). Found: ${cols.join(', ')}.`,
          });
          return;
        }

        const parsed: SolarDataPoint[] = [];
        const errors: string[] = [];

        results.data.forEach((row, i) => {
          const rowNum = i + 2;
          const date = row['date']?.trim();
          const kwh = parseFloat(row[kwhCol]?.trim());

          if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            errors.push(`Row ${rowNum}: invalid date "${date}"`);
            return;
          }
          if (isNaN(kwh) || kwh < 0) {
            errors.push(`Row ${rowNum}: invalid kWh value`);
            return;
          }

          parsed.push({
            date,
            production_kwh: kwh,
            site_name: row['site_name']?.trim() || undefined,
            weather: row['weather']?.trim() || undefined,
            anomaly_detected:
              row['anomaly_detected']?.trim().toLowerCase() === 'yes'
                ? true
                : row['anomaly_detected']?.trim().toLowerCase() === 'no'
                  ? false
                  : undefined,
          });
        });

        if (parsed.length === 0) {
          resolve({
            ok: false,
            error: errors.length
              ? `No valid rows. First issue: ${errors[0]}`
              : 'CSV is empty.',
          });
          return;
        }

        parsed.sort((a, b) => a.date.localeCompare(b.date));
        resolve({ ok: true, data: parsed });
      },
      error(err) {
        resolve({ ok: false, error: `Parse failed: ${err.message}` });
      },
    });
  });
};

export default parseCsvFile;
