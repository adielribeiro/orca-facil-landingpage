import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LoginIcon from '@mui/icons-material/Login';
import { Link as RouterLink } from 'react-router-dom';
import {
  buildWhatsAppLink,
  clearStoredAdminToken,
  getStoredAdminToken,
  normalizeLandingConfig,
  saveStoredAdminToken,
  sanitizeWhatsappNumber
} from '../utils/landingConfig';
import { fetchPublicLandingConfig, loginAdmin, saveLandingConfigApi } from '../services/landingApi';

export default function ConfigPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(() => getStoredAdminToken());
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      setLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchPublicLandingConfig();
        if (mounted) {
          setForm(normalizeLandingConfig(data));
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || 'Erro ao carregar a configuração.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  const whatsappPreview = useMemo(() => {
    if (!form) {
      return '#';
    }

    return buildWhatsAppLink(form.whatsappNumber, form.whatsappMessage);
  }, [form]);

  function updateField(field, value) {
    setSavedMessage('');
    setErrorMessage('');
    setForm((current) => ({
      ...current,
      [field]: field === 'whatsappNumber' ? sanitizeWhatsappNumber(value) : value
    }));
  }

  function updateLoginField(field, value) {
    setErrorMessage('');
    setLoginForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoginLoading(true);
    setErrorMessage('');
    setSavedMessage('');

    try {
      const data = await loginAdmin(loginForm.email, loginForm.password);
      setToken(data.token);
      saveStoredAdminToken(data.token);
      setSavedMessage('Login de administrador realizado com sucesso.');
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível fazer login.');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!token) {
      setErrorMessage('Faça login como administrador para salvar.');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSavedMessage('');

    try {
      const saved = await saveLandingConfigApi(form, token);
      setForm(saved);
      setSavedMessage('Configurações salvas no banco com sucesso.');
    } catch (error) {
      if (String(error.message || '').toLowerCase().includes('token')) {
        clearStoredAdminToken();
        setToken('');
      }
      setErrorMessage(error.message || 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearStoredAdminToken();
    setToken('');
    setSavedMessage('Login removido deste navegador.');
    setErrorMessage('');
  }

  if (loading || !form) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography>Carregando configurações da landing...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc', py: { xs: 4, md: 7 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Painel de configuração da landing
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Aqui você altera os dados públicos e salva direto no banco pela API.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
              >
                Voltar para a landing
              </Button>

              <Button
                component="a"
                href={whatsappPreview}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                startIcon={<OpenInNewIcon />}
              >
                Testar WhatsApp
              </Button>
            </Stack>
          </Stack>

          {!token ? (
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box component="form" onSubmit={handleLogin}>
                  <Stack spacing={3}>
                    <Typography variant="h6" fontWeight={700}>
                      Login de administrador
                    </Typography>

                    <TextField
                      label="E-mail"
                      type="email"
                      value={loginForm.email}
                      onChange={(event) => updateLoginField('email', event.target.value)}
                      fullWidth
                    />

                    <TextField
                      label="Senha"
                      type="password"
                      value={loginForm.password}
                      onChange={(event) => updateLoginField('password', event.target.value)}
                      fullWidth
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<LoginIcon />}
                      disabled={loginLoading}
                    >
                      {loginLoading ? 'Entrando...' : 'Entrar como admin'}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Alert
              severity="success"
              action={
                <Button color="inherit" size="small" startIcon={<LogoutIcon />} onClick={handleLogout}>
                  Sair
                </Button>
              }
            >
              Você está autenticado como administrador e pode salvar alterações.
            </Alert>
          )}

          {savedMessage ? <Alert severity="success">{savedMessage}</Alert> : null}
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box component="form" onSubmit={handleSave}>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight={700}>
                    Informações principais
                  </Typography>

                  <TextField
                    label="Nome da marca"
                    value={form.brandName}
                    onChange={(event) => updateField('brandName', event.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Link do app"
                    value={form.appLink}
                    onChange={(event) => updateField('appLink', event.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Número do WhatsApp"
                    helperText="Use somente números, com DDI e DDD. Ex.: 5517999999999"
                    value={form.whatsappNumber}
                    onChange={(event) => updateField('whatsappNumber', event.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Mensagem padrão do WhatsApp"
                    value={form.whatsappMessage}
                    onChange={(event) => updateField('whatsappMessage', event.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                  />

                  <Typography variant="h6" fontWeight={700}>
                    Plano exibido na página
                  </Typography>

                  <TextField
                    label="Chip da seção de preço"
                    value={form.pricingChip}
                    onChange={(event) => updateField('pricingChip', event.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Nome do plano"
                    value={form.planName}
                    onChange={(event) => updateField('planName', event.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Preço do plano"
                    value={form.planPrice}
                    onChange={(event) => updateField('planPrice', event.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Descrição do plano"
                    value={form.planDescription}
                    onChange={(event) => updateField('planDescription', event.target.value)}
                    fullWidth
                    multiline
                    minRows={4}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={saving || !token}
                  >
                    {saving ? 'Salvando...' : 'Salvar no banco'}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}