import defaultLandingConfig from '../config/defaultLandingConfig';

export const LANDING_ADMIN_TOKEN_KEY = 'orcafeito_admin_token';

export function sanitizeWhatsappNumber(value = '') {
  return String(value).replace(/\D/g, '');
}

export function buildWhatsAppLink(number, message) {
  const cleanNumber = sanitizeWhatsappNumber(number);
  const encodedMessage = encodeURIComponent(message || 'Olá!');
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function normalizeLandingConfig(config) {
  const source = config || {};

  return {
    ...defaultLandingConfig,
    ...source,
    whatsappNumber: sanitizeWhatsappNumber(
      source.whatsappNumber || defaultLandingConfig.whatsappNumber
    ),
    checkoutEnabled:
      typeof source.checkoutEnabled === 'boolean'
        ? source.checkoutEnabled
        : defaultLandingConfig.checkoutEnabled,
    pixKeyType: String(source.pixKeyType || defaultLandingConfig.pixKeyType),
    pixKey: String(source.pixKey || defaultLandingConfig.pixKey),
    planAmount: String(source.planAmount || defaultLandingConfig.planAmount),
    supportEmail: String(source.supportEmail || defaultLandingConfig.supportEmail)
  };
}

export function getStoredAdminToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(LANDING_ADMIN_TOKEN_KEY) || '';
}

export function saveStoredAdminToken(token) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LANDING_ADMIN_TOKEN_KEY, token || '');
}

export function clearStoredAdminToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(LANDING_ADMIN_TOKEN_KEY);
}

export { defaultLandingConfig };