export const formatKwh = (value: number): string =>
  `${value.toLocaleString('en-US', { maximumFractionDigits: 1 })} kWh`;

export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const formatDateShort = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
