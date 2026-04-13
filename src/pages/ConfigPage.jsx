import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LoginIcon from '@mui/icons-material/Login';
import PixIcon from '@mui/icons-material/Pix';
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

const pixKeyTypeOptions = [
  { value: 'email', label: 'E-mail' },
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'aleatoria', label: 'Chave aleatória' }
];

function SectionCard({ title, subtitle, children }) {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

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
                Aqui você altera a landing, o checkout PIX e os dados públicos salvos no banco.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component={RouterLink} to="/" variant="outlined" startIcon={<ArrowBackIcon />}>
                Voltar para a landing
              </Button>

              <Button component="a" href={whatsappPreview} target="_blank" rel="noreferrer" variant="contained" startIcon={<OpenInNewIcon />}>
                Testar WhatsApp
              </Button>
            </Stack>
          </Stack>

          {!token ? (
            <SectionCard title="Login de administrador" subtitle="Faça login para salvar as configurações da landing e do checkout.">
              <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={3}>
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

                  <Button type="submit" variant="contained" startIcon={<LoginIcon />} disabled={loginLoading}>
                    {loginLoading ? 'Entrando...' : 'Entrar como admin'}
                  </Button>
                </Stack>
              </Box>
            </SectionCard>
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

          <Box component="form" onSubmit={handleSave}>
            <Stack spacing={3}>
              <SectionCard title="Informações principais" subtitle="Esses dados aparecem publicamente na landing.">
                <Stack spacing={3}>
                  <TextField label="Nome da marca" value={form.brandName} onChange={(event) => updateField('brandName', event.target.value)} fullWidth />
                  <TextField label="Link do app" value={form.appLink} onChange={(event) => updateField('appLink', event.target.value)} fullWidth />
                  <TextField label="Número do WhatsApp" value={form.whatsappNumber} onChange={(event) => updateField('whatsappNumber', event.target.value)} fullWidth />
                  <TextField label="Mensagem padrão do WhatsApp" value={form.whatsappMessage} onChange={(event) => updateField('whatsappMessage', event.target.value)} multiline minRows={3} fullWidth />
                </Stack>
              </SectionCard>

              <SectionCard title="Plano exibido na landing" subtitle="Essas informações ficam na seção de preço e também ajudam no checkout.">
                <Stack spacing={3}>
                  <TextField label="Chip de preço" value={form.pricingChip} onChange={(event) => updateField('pricingChip', event.target.value)} fullWidth />
                  <TextField label="Nome do plano" value={form.planName} onChange={(event) => updateField('planName', event.target.value)} fullWidth />
                  <TextField label="Preço exibido" value={form.planPrice} onChange={(event) => updateField('planPrice', event.target.value)} fullWidth />
                  <TextField label="Descrição do plano" value={form.planDescription} onChange={(event) => updateField('planDescription', event.target.value)} multiline minRows={4} fullWidth />
                </Stack>
              </SectionCard>

              <SectionCard title="Checkout PIX" subtitle="Configure a página que gera o QR Code, o PIX copia e cola e recebe o comprovante.">
                <Stack spacing={3}>
                  <FormControlLabel
                    control={<Switch checked={form.checkoutEnabled} onChange={(event) => updateField('checkoutEnabled', event.target.checked)} />}
                    label="Checkout ativo"
                  />

                  <TextField label="Título do checkout" value={form.checkoutHeadline} onChange={(event) => updateField('checkoutHeadline', event.target.value)} fullWidth />
                  <TextField label="Descrição do checkout" value={form.checkoutDescription} onChange={(event) => updateField('checkoutDescription', event.target.value)} multiline minRows={3} fullWidth />
                  <TextField label="Texto do botão de compra" value={form.checkoutButtonLabel} onChange={(event) => updateField('checkoutButtonLabel', event.target.value)} fullWidth />
                  <TextField label="Valor real do plano para o PIX" value={form.planAmount} onChange={(event) => updateField('planAmount', event.target.value)} helperText="Exemplo: 119,90" fullWidth />
                  <TextField select label="Tipo da chave PIX" value={form.pixKeyType} onChange={(event) => updateField('pixKeyType', event.target.value)} fullWidth>
                    {pixKeyTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField label="Chave PIX" value={form.pixKey} onChange={(event) => updateField('pixKey', event.target.value)} fullWidth />
                  <TextField label="Nome do favorecido" value={form.pixBeneficiaryName} onChange={(event) => updateField('pixBeneficiaryName', event.target.value)} fullWidth />
                  <TextField label="Cidade do PIX" value={form.pixCity} onChange={(event) => updateField('pixCity', event.target.value)} helperText="Use sem acentos para evitar falha no BR Code." fullWidth />
                  <TextField label="Descrição no PIX" value={form.pixDescription} onChange={(event) => updateField('pixDescription', event.target.value)} fullWidth />
                  <TextField label="E-mail de suporte" value={form.supportEmail} onChange={(event) => updateField('supportEmail', event.target.value)} fullWidth />
                </Stack>
              </SectionCard>

              <Alert severity="info" icon={<PixIcon />}>
                Depois de salvar, a landing passa a ter botão para o checkout, e a página de checkout gera o PIX com base nessas configurações.
              </Alert>

              <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar configurações'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
