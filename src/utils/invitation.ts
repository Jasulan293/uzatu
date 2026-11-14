export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export interface PhotoEntry {
  id: string;
  url: string;
  title: string;
  alt: string;
  sectionKey: string;
}

export type AttendanceStatus = 'attending' | 'declined';

export interface RsvpInput {
  name: string;
  attendance: AttendanceStatus;
  guestCount: number;
  wish?: string;
}

export interface RsvpValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    guestCount?: string;
  };
}

/**
 * Formats a non-negative integer as a zero-padded two-digit string.
 */
export function formatTwoDigits(value: number): string {
  const safe = Math.max(0, Math.floor(value));
  return safe < 10 ? `0${safe}` : String(safe);
}

/**
 * Computes remaining days, hours, minutes, and seconds until eventDateISO.
 */
export function computeCountdown(
  targetIso: string,
  nowMs: number = Date.now(),
): CountdownState {
  const targetMs = Date.parse(targetIso);
  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const diffMs = targetMs - nowMs;
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Maps any section index (0..N) to the available photo array,
 * cycling cleanly when fewer than 5 photos are supplied.
 */
export function resolveSectionPhoto<T extends PhotoEntry>(
  photos: readonly T[],
  sectionIndex: number,
): T | null {
  if (!photos || photos.length === 0) {
    return null;
  }
  const normalized = ((Math.floor(sectionIndex) % photos.length) + photos.length) % photos.length;
  return photos[normalized];
}

/**
 * Validates RSVP form submission without substituting silent fallbacks.
 */
export function validateRsvpForm(input: RsvpInput): RsvpValidationResult {
  const errors: RsvpValidationResult['errors'] = {};
  const trimmedName = input.name.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Толық аты-жөніңізді енгізіңіз (кемінде 2 таңба).';
  }

  if (input.attendance === 'attending') {
    if (!Number.isInteger(input.guestCount) || input.guestCount < 1 || input.guestCount > 12) {
      errors.guestCount = 'Қонақ саны 1-ден 12-ге дейін болуы тиіс.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Builds a clean WhatsApp link with a prefilled polite Kazakh inquiry message.
 */
export function buildWhatsAppUrl(
  phone: string,
  brideName: string,
  guestName?: string,
): string {
  const digits = phone.replace(/\D/g, '');
  const cleanGuest = guestName?.trim();
  const message = cleanGuest
    ? `Сәлеметсіз бе! Мен ${cleanGuest}. ${brideName} қызымыздың ұзату тойы бойынша хабарласып тұрмын.`
    : `Сәлеметсіз бе! ${brideName} қызымыздың ұзату тойы бойынша хабарласып тұрмын.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
