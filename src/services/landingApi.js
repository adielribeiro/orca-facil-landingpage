import { defaultLandingConfig, normalizeLandingConfig } from '../utils/landingConfig';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

function buildUrl(path) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_URL não foi configurada.');
  }

  return `${API_BASE_URL}${path}`;
}

async function parseResponse(response, fallbackMessage) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
}

export async function fetchPublicLandingConfig() {
  try {
    const response = await fetch(buildUrl('/landing-config'));
    const data = await parseResponse(
      response,
      'Não foi possível carregar as configurações da landing.'
    );
    return normalizeLandingConfig(data);
  } catch (error) {
    console.warn('[landing-config] usando configuração padrão:', error.message);
    return defaultLandingConfig;
  }
}

export async function fetchCheckoutConfig() {
  const response = await fetch(buildUrl('/checkout/config'));
  return parseResponse(response, 'Não foi possível carregar o checkout.');
}

export async function createPurchaseIntent(payload) {
  const response = await fetch(buildUrl('/checkout/intents'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response, 'Não foi possível iniciar a compra.');
}

export async function submitPurchaseReceipt(intentId, payload) {
  const response = await fetch(buildUrl(`/checkout/intents/${intentId}/receipt`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response, 'Não foi possível enviar o comprovante.');
}

export async function loginAdmin(email, password) {
  const response = await fetch(buildUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await parseResponse(response, 'Não foi possível fazer login.');

  if (data?.user?.role !== 'admin') {
    throw new Error('Este usuário não é administrador.');
  }

  return data;
}

export async function saveLandingConfigApi(config, token) {
  const response = await fetch(buildUrl('/landing-config'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(normalizeLandingConfig(config))
  });

  const data = await parseResponse(response, 'Não foi possível salvar as configurações.');
  return normalizeLandingConfig(data);
}