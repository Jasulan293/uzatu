import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppUrl,
  computeCountdown,
  formatTwoDigits,
  resolveSectionPhoto,
  validateRsvpForm,
} from './invitation';

test('formatTwoDigits pads single digits and clamps negatives', () => {
  assert.equal(formatTwoDigits(0), '00');
  assert.equal(formatTwoDigits(7), '07');
  assert.equal(formatTwoDigits(24), '24');
  assert.equal(formatTwoDigits(-5), '00');
});

test('computeCountdown calculates exact remaining time and handles past dates', () => {
  const target = '2026-12-19T17:00:00+05:00';
  const targetMs = Date.parse(target);
  const offset = ((3 * 86400) + (4 * 3600) + (15 * 60) + 9) * 1000;

  const future = computeCountdown(target, targetMs - offset);
  assert.deepEqual(future, {
    days: 3,
    hours: 4,
    minutes: 15,
    seconds: 9,
    isPast: false,
  });

  const past = computeCountdown(target, targetMs + 1000);
  assert.deepEqual(past, {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: true,
  });
});

test('resolveSectionPhoto cycles safely regardless of array length', () => {
  const twoPhotos = [
    { id: '1', url: '/a.jpg', title: 'A', alt: 'A', sectionKey: 'hero' },
    { id: '2', url: '/b.jpg', title: 'B', alt: 'B', sectionKey: 'bride' },
  ];

  assert.equal(resolveSectionPhoto(twoPhotos, 0)?.id, '1');
  assert.equal(resolveSectionPhoto(twoPhotos, 1)?.id, '2');
  assert.equal(resolveSectionPhoto(twoPhotos, 2)?.id, '1');
  assert.equal(resolveSectionPhoto(twoPhotos, 4)?.id, '1');
  assert.equal(resolveSectionPhoto([], 0), null);
});

test('validateRsvpForm enforces Kazakh name and guest count rules', () => {
  const emptyName = validateRsvpForm({
    name: ' ',
    attendance: 'attending',
    guestCount: 2,
  });
  assert.equal(emptyName.valid, false);
  assert.ok(emptyName.errors.name);

  const invalidCount = validateRsvpForm({
    name: 'Айгүл Сәрсенбай',
    attendance: 'attending',
    guestCount: 0,
  });
  assert.equal(invalidCount.valid, false);
  assert.ok(invalidCount.errors.guestCount);

  const validAttending = validateRsvpForm({
    name: 'Айгүл Сәрсенбай',
    attendance: 'attending',
    guestCount: 2,
    wish: 'Бақытты болыңыздар!',
  });
  assert.equal(validAttending.valid, true);

  const validDeclined = validateRsvpForm({
    name: 'Ерлан',
    attendance: 'declined',
    guestCount: 0,
  });
  assert.equal(validDeclined.valid, true);
});

test('buildWhatsAppUrl formats digits cleanly and includes encoded Kazakh text', () => {
  const url = buildWhatsAppUrl('+7 777 555 2026', 'Айзере', 'Айгүл');
  assert.ok(url.startsWith('https://wa.me/77775552026?text='));
  assert.ok(decodeURIComponent(url).includes('Айзере'));
  assert.ok(decodeURIComponent(url).includes('Айгүл'));
});
