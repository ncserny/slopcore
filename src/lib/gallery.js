import gallery from '../../tmp/gallery.json';

export const entries = gallery;
export const hourPath = (entry) => `/hour/${encodeURIComponent(entry.id.toLowerCase())}/`;
export const site = 'https://slopcore.nader.io';
export const formatDate = (value) => new Intl.DateTimeFormat('en-GB', {
  dateStyle:'medium', timeStyle:'short', timeZone:'Europe/Berlin',
}).format(new Date(value));
