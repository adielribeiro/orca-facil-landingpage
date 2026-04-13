import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PixIcon from '@mui/icons-material/Pix';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import { Link as RouterLink } from 'react-router-dom';
import logoHorizontal from '../assets/orcafeito/logo_horizontal_fundo_claro.png';
import {
  createPurchaseIntent,
  fetchCheckoutConfig,
  submitPurchaseReceipt
} from '../services/landingApi';

function formatFileSize(bytes = 0) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || '');
      const [, base64 = ''] = result.split(',');
      resolve(base64);
    };

    reader.onerror = () => reject(new Error('Não foi possível ler o comprovante.'));
    reader.readAsDataURL(file);
  });
}

export default function CheckoutPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [purchaseError, setPurchaseError] = useState('');
  const [receiptError, setReceiptError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [purchase, setPurchase] = useState(null);
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    whatsapp: ''
  });

  useEffect(() => {
    let mounted = true;

    async function loadCheckout() {
      setLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchCheckoutConfig();
        if (mounted) {
          setConfig(data);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || 'Não foi possível carregar o checkout.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCheckout();

    return () => {
      mounted = false;
    };
  }, []);

  const helperEmailText = useMemo(() => {
    if (!purchase?.email) {
      return 'Esse e-mail será usado para criar seu acesso ao app.';
    }

    return `Seu acesso será criado no e-mail ${purchase.email}.`;
  }, [purchase]);

  function updateField(field, value) {
    setPurchaseError('');
    setReceiptError('');
    setSuccessMessage('');
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleCreatePurchase(event) {
    event.preventDefault();
    setCreating(true);
    setPurchaseError('');
    setReceiptError('');
    setSuccessMessage('');

    try {
      const data = await createPurchaseIntent(form);
      setPurchase(data);
    } catch (error) {
      setPurchaseError(error.message || 'Não foi possível iniciar a compra.');
    } finally {
      setCreating(false);
    }
  }

  async function handleCopyPix() {
    if (!purchase?.pixCopyPaste) {
      return;
    }

    try {
      await navigator.clipboard.writeText(purchase.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setReceiptError('Não foi possível copiar automaticamente. Selecione e copie o código manualmente.');
    }
  }

  async function handleUploadReceipt() {
    if (!purchase?.id) {
      setReceiptError('Primeiro gere o seu PIX.');
      return;
    }

    if (!selectedFile) {
      setReceiptError('Selecione o comprovante antes de enviar.');
      return;
    }

    if (selectedFile.size > 3 * 1024 * 1024) {
      setReceiptError('O comprovante deve ter no máximo 3 MB.');
      return;
    }

    setUploading(true);
    setReceiptError('');
    setSuccessMessage('');

    try {
      const receiptBase64 = await readFileAsBase64(selectedFile);
      const data = await submitPurchaseReceipt(purchase.id, {
        receiptBase64,
        receiptName: selectedFile.name,
        receiptMimeType: selectedFile.type || 'application/octet-stream'
      });

      setSuccessMessage(data.message || 'Comprovante enviado com sucesso.');
    } catch (error) {
      setReceiptError(error.message || 'Não foi possível enviar o comprovante.');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc' }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography>Carregando checkout...</Typography>
        </Stack>
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#f8fafc', py: 6 }}>
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Button component={RouterLink} to="/" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start' }}>
              Voltar para a landing
            </Button>
            <Alert severity="error">{errorMessage}</Alert>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (!config?.checkoutEnabled) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#f8fafc', py: 6 }}>
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Button component={RouterLink} to="/" variant="outlined" startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start' }}>
              Voltar para a landing
            </Button>
            <Alert severity="warning">O checkout está temporariamente desativado.</Alert>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc', py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Stack spacing={1}>
              <Box component="img" src={logoHorizontal} alt="Orça Feito" sx={{ width: { xs: 210, sm: 250 }, maxWidth: '100%' }} />
              <Typography variant="h4" fontWeight={900}>
                {config.checkoutHeadline}
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
                {config.checkoutDescription}
              </Typography>
            </Stack>

            <Button component={RouterLink} to="/" variant="outlined" startIcon={<ArrowBackIcon />}>
              Voltar para a landing
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }
            }}
          >
            <Card sx={{ borderRadius: 5 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Chip label="Passo 1" color="primary" sx={{ width: 'fit-content' }} />
                    <Typography variant="h5" fontWeight={800}>
                      Informe seus dados para liberar o acesso
                    </Typography>
                    <Typography color="text.secondary">
                      O e-mail informado aqui será usado para criar seu usuário depois da conferência do comprovante.
                    </Typography>
                  </Stack>

                  {purchaseError ? <Alert severity="error">{purchaseError}</Alert> : null}

                  <Box component="form" onSubmit={handleCreatePurchase}>
                    <Stack spacing={2}>
                      <TextField
                        label="E-mail"
                        type="email"
                        value={form.email}
                        onChange={(event) => updateField('email', event.target.value)}
                        helperText={helperEmailText}
                        required
                        fullWidth
                      />

                      <TextField
                        label="Nome completo"
                        value={form.fullName}
                        onChange={(event) => updateField('fullName', event.target.value)}
                        fullWidth
                      />

                      <TextField
                        label="WhatsApp"
                        value={form.whatsapp}
                        onChange={(event) => updateField('whatsapp', event.target.value)}
                        fullWidth
                      />

                      <Button type="submit" variant="contained" size="large" startIcon={<PixIcon />} disabled={creating}>
                        {creating ? 'Gerando PIX...' : config.checkoutButtonLabel || 'Gerar PIX'}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 5, border: '2px solid', borderColor: 'primary.main' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Stack spacing={1}>
                    <Chip label="Seu plano" color="primary" variant="outlined" sx={{ width: 'fit-content' }} />
                    <Typography variant="h5" fontWeight={800}>
                      {config.planName}
                    </Typography>
                    <Typography variant="h3" color="primary.main" fontWeight={900}>
                      {config.planPrice}
                    </Typography>
                    <Typography color="text.secondary">
                      Sem intermediador pago agora no começo: o checkout gera o PIX e você envia o comprovante aqui mesmo.
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircleIcon color="success" />
                      <Typography>PIX copia e cola</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircleIcon color="success" />
                      <Typography>QR Code para pagamento no celular</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircleIcon color="success" />
                      <Typography>Liberação manual após conferência do comprovante</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CheckCircleIcon color="success" />
                      <Typography>Acesso enviado por e-mail depois da aprovação</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {purchase ? (
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }
              }}
            >
              <Card sx={{ borderRadius: 5 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Chip label="Passo 2" color="primary" sx={{ width: 'fit-content' }} />
                      <Typography variant="h5" fontWeight={800}>
                        Pague com o QR Code ou PIX copia e cola
                      </Typography>
                      <Typography color="text.secondary">
                        Protocolo da solicitação: <strong>{purchase.protocol}</strong>
                      </Typography>
                    </Stack>

                    <Box
                      component="img"
                      src={purchase.pixQrCodeUrl}
                      alt="QR Code PIX"
                      sx={{ width: 280, maxWidth: '100%', alignSelf: 'center', borderRadius: 3, border: '1px solid #e5e7eb' }}
                    />

                    <TextField
                      label="PIX copia e cola"
                      value={purchase.pixCopyPaste}
                      multiline
                      minRows={5}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />

                    <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopyPix}>
                      {copied ? 'PIX copiado' : 'Copiar PIX'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 5 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={3}>
                    <Stack spacing={1}>
                      <Chip label="Passo 3" color="primary" sx={{ width: 'fit-content' }} />
                      <Typography variant="h5" fontWeight={800}>
                        Envie o comprovante
                      </Typography>
                      <Typography color="text.secondary">
                        Após a conferência, o sistema cria o usuário no app e envia seu acesso para {purchase.email}.
                      </Typography>
                    </Stack>

                    {receiptError ? <Alert severity="error">{receiptError}</Alert> : null}
                    {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}

                    <Stack spacing={1.5}>
                      <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                        Selecionar comprovante
                        <input
                          hidden
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                        />
                      </Button>

                      {selectedFile ? (
                        <Alert severity="info">
                          Arquivo selecionado: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
                        </Alert>
                      ) : null}

                      <Button variant="contained" size="large" onClick={handleUploadReceipt} disabled={uploading}>
                        {uploading ? 'Enviando comprovante...' : 'Enviar comprovante'}
                      </Button>
                    </Stack>

                    <Divider />

                    <Stack spacing={1}>
                      <Typography fontWeight={700}>O que acontece depois?</Typography>
                      <Typography color="text.secondary">
                        1. Você paga pelo PIX.
                      </Typography>
                      <Typography color="text.secondary">
                        2. Envia o comprovante aqui pela página.
                      </Typography>
                      <Typography color="text.secondary">
                        3. Após a conferência, seu usuário é criado no banco do app.
                      </Typography>
                      <Typography color="text.secondary">
                        4. Você recebe e-mail, senha inicial e o link do sistema.
                      </Typography>
                    </Stack>

                    {config.supportEmail ? (
                      <Alert icon={<MailOutlineIcon />} severity="info">
                        Suporte: {config.supportEmail}
                      </Alert>
                    ) : null}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
