import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HistoryIcon from '@mui/icons-material/History';
import CalculateIcon from '@mui/icons-material/Calculate';
import DevicesIcon from '@mui/icons-material/Devices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ConstructionIcon from '@mui/icons-material/Construction';
import BoltIcon from '@mui/icons-material/Bolt';
import HandymanIcon from '@mui/icons-material/Handyman';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LoginIcon from '@mui/icons-material/Login';
import { buildWhatsAppLink, defaultLandingConfig } from '../utils/landingConfig';
import { fetchPublicLandingConfig } from '../services/landingApi';
import logoHorizontal from '../assets/orcafeito/logo_horizontal_fundo_claro.png';
import logoQuadrado from '../assets/orcafeito/logo_quadrado.png';

const beneficios = [
  {
    titulo: 'Cálculo automático',
    descricao:
      'Some mão de obra, peças e insumos rapidamente e reduza erros no orçamento.',
    icon: <CalculateIcon fontSize="large" />
  },
  {
    titulo: 'PDF profissional',
    descricao:
      'Gere um orçamento bonito e organizado para enviar ao cliente em poucos cliques.',
    icon: <PictureAsPdfIcon fontSize="large" />
  },
  {
    titulo: 'Histórico salvo',
    descricao:
      'Consulte orçamentos anteriores e não perca informações importantes do atendimento.',
    icon: <HistoryIcon fontSize="large" />
  },
  {
    titulo: 'Acesso por login',
    descricao:
      'Cada usuário acessa sua própria conta com segurança e organização.',
    icon: <LoginIcon fontSize="large" />
  },
  {
    titulo: 'Celular e computador',
    descricao:
      'Atenda com agilidade no celular e trabalhe com conforto no computador.',
    icon: <DevicesIcon fontSize="large" />
  },
  {
    titulo: 'Mais confiança na venda',
    descricao:
      'Passe mais profissionalismo e aumente a confiança do cliente no seu serviço.',
    icon: <CheckCircleIcon fontSize="large" />
  }
];

const nichos = [
  { nome: 'Oficinas', icon: <ConstructionIcon /> },
  { nome: 'Eletricistas', icon: <BoltIcon /> },
  { nome: 'Instaladores', icon: <HandymanIcon /> },
  { nome: 'Assistência técnica', icon: <HomeRepairServiceIcon /> },
  { nome: 'Marcenaria', icon: <PrecisionManufacturingIcon /> },
  { nome: 'Prestadores de serviço', icon: <ConstructionIcon /> }
];

function SectionTitle({ chip, title, subtitle, center = false }) {
  return (
    <Stack
      spacing={1}
      sx={{
        mb: 4,
        textAlign: center ? 'center' : 'left',
        alignItems: center ? 'center' : 'flex-start'
      }}
    >
      {chip ? <Chip label={chip} color="primary" variant="outlined" /> : null}
      <Typography variant="h4" fontWeight={800}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

function FeatureCard({ item }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
          <Typography variant="h6">{item.titulo}</Typography>
          <Typography color="text.secondary">{item.descricao}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function LandingPage() {
  const [config, setConfig] = useState(defaultLandingConfig);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      setLoading(true);
      setLoadError('');

      try {
        const data = await fetchPublicLandingConfig();
        if (mounted) {
          setConfig(data);
        }
      } catch (error) {
        if (mounted) {
          setLoadError(error.message || 'Não foi possível carregar a configuração online.');
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

  const whatsappLink = useMemo(
    () => buildWhatsAppLink(config.whatsappNumber, config.whatsappMessage),
    [config]
  );

  const plano = {
    nome: config.planName,
    preco: config.planPrice,
    descricao: config.planDescription,
    itens: [
      'Cadastro de orçamentos',
      'Cálculo automático',
      'Geração de PDF',
      'Envio por WhatsApp e e-mail',
      'Histórico completo',
      'Configurações por usuário',
      'Acesso por login',
      'Uso no celular e computador'
    ]
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc' }}>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar
          sx={{
            borderBottom: '1px solid #e5e7eb',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            py: 1
          }}
        >
          <Box
            component="img"
            src={logoHorizontal}
            alt={config.brandName}
            sx={{
              height: { xs: 46, md: 56 },
              width: 'auto',
              display: 'block'
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="outlined" href={config.appLink} startIcon={<LoginIcon />}>
              Entrar
            </Button>

            <Button
              variant="contained"
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              startIcon={<WhatsAppIcon />}
            >
              Falar no WhatsApp
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {loading ? (
        <Box sx={{ py: 2, px: 2 }}>
          <Container maxWidth="lg">
            <Alert icon={<CircularProgress size={18} />} severity="info">
              Carregando configurações da landing...
            </Alert>
          </Container>
        </Box>
      ) : null}

      {loadError ? (
        <Box sx={{ py: 2, px: 2 }}>
          <Container maxWidth="lg">
            <Alert severity="warning">{loadError}</Alert>
          </Container>
        </Box>
      ) : null}

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            alignItems: 'center',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="img"
                src={logoQuadrado}
                alt={`${config.brandName} símbolo`}
                sx={{
                  width: { xs: 54, md: 66 },
                  height: { xs: 54, md: 66 },
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)'
                }}
              />
              <Chip
                label="Orçamentos rápidos e profissionais"
                color="primary"
                variant="outlined"
                sx={{ width: 'fit-content' }}
              />
            </Stack>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.3rem', md: '4rem' },
                lineHeight: 1.05
              }}
            >
              Crie orçamentos profissionais em minutos
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400, maxWidth: 680 }}
            >
              Calcule mão de obra, peças e insumos automaticamente, gere PDF e envie para seus clientes por WhatsApp ou e-mail.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button size="large" variant="contained" href={whatsappLink} target="_blank" rel="noreferrer">
                Quero conhecer
              </Button>

              <Button size="large" variant="outlined" href={config.appLink} startIcon={<LoginIcon />}>
                Entrar no sistema
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              <Chip label="Cálculo automático" />
              <Chip label="PDF profissional" />
              <Chip label="Histórico salvo" />
            </Stack>
          </Stack>

          <Card sx={{ borderRadius: 5, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    component="img"
                    src={logoQuadrado}
                    alt={config.brandName}
                    sx={{ width: 42, height: 42, borderRadius: 2.5 }}
                  />
                  <Box>
                    <Typography variant="h6">Exemplo de orçamento</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Visual moderno com identidade da {config.brandName}
                    </Typography>
                  </Box>
                </Stack>

                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Orçamento do cliente
                    </Typography>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Mão de obra</Typography>
                      <Typography fontWeight={700}>R$ 650,00</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Peças</Typography>
                      <Typography fontWeight={700}>R$ 320,00</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Insumos</Typography>
                      <Typography fontWeight={700}>R$ 85,00</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" fontWeight={800}>
                        Total
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="primary.main">
                        R$ 1.055,00
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)'
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <PlayArrowIcon color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Do cadastro ao envio para o cliente em poucos cliques.
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <SectionTitle
            chip="Problema"
            title="Você ainda faz orçamento no papel, planilha ou mensagem solta?"
            subtitle="Isso faz você perder tempo, errar valores e passar menos confiança para o cliente."
            center
          />

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }
            }}
          >
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mais demora
                </Typography>
                <Typography color="text.secondary">
                  Montar orçamento manualmente atrasa o atendimento.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mais erros
                </Typography>
                <Typography color="text.secondary">
                  Cálculos separados aumentam a chance de passar valor errado.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Menos profissionalismo
                </Typography>
                <Typography color="text.secondary">
                  Um orçamento bagunçado reduz a confiança do cliente.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle
          chip="Benefícios"
          title="Tudo o que você precisa para vender melhor"
          subtitle="Organize seus orçamentos em um sistema simples, rápido e profissional."
          center
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }
          }}
        >
          {beneficios.map((item) => (
            <FeatureCard key={item.titulo} item={item} />
          ))}
        </Box>
      </Container>

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <SectionTitle
            chip="Ideal para"
            title="Feito para quem precisa orçar com rapidez"
            subtitle="Atenda melhor seus clientes e mantenha seus orçamentos organizados."
            center
          />

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }
            }}
          >
            {nichos.map((item) => (
              <Paper
                key={item.nome}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                <Typography fontWeight={600}>{item.nome}</Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle
          chip={config.pricingChip}
          title="Uma única opção, completa para o seu negócio"
          subtitle="Sem complicação para escolher. Você entra com tudo o que precisa para organizar e profissionalizar seus orçamentos."
          center
        />

        <Card
          sx={{
            borderRadius: 5,
            border: '2px solid',
            borderColor: 'primary.main',
            boxShadow: '0 18px 40px rgba(25, 118, 210, 0.15)'
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Box
                component="img"
                src={logoQuadrado}
                alt={`${config.brandName} logo`}
                sx={{ width: 72, height: 72, borderRadius: 3 }}
              />

              <Chip label="Plano recomendado" color="primary" />

              <Typography variant="h4" fontWeight={800}>
                {plano.nome}
              </Typography>

              <Typography variant="h2" color="primary.main" fontWeight={900}>
                {plano.preco}
              </Typography>

              <Typography color="text.secondary" sx={{ maxWidth: 600 }}>
                {plano.descricao}
              </Typography>

              <Divider sx={{ width: '100%' }} />

              <Stack spacing={1.5} sx={{ width: '100%', maxWidth: 520 }}>
                {plano.itens.map((texto) => (
                  <Stack key={texto} direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body1">{texto}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                <Button
                  size="large"
                  variant="contained"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  startIcon={<WhatsAppIcon />}
                >
                  Quero assinar
                </Button>

                <Button size="large" variant="outlined" href={config.appLink} startIcon={<LoginIcon />}>
                  Entrar no sistema
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="md">
          <Card sx={{ borderRadius: 5, textAlign: 'center' }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Stack spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={logoHorizontal}
                  alt={config.brandName}
                  sx={{
                    width: { xs: 210, sm: 260 },
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
                <Chip label="Comece agora" color="primary" />
                <Typography variant="h4" fontWeight={900}>
                  Pare de perder orçamento e ganhe agilidade no atendimento
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 700 }}>
                  Organize seus orçamentos em um sistema simples, rápido e profissional.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                  <Button size="large" variant="contained" href={whatsappLink} target="_blank" rel="noreferrer">
                    Quero falar no WhatsApp
                  </Button>

                  <Button size="large" variant="outlined" href={config.appLink} startIcon={<LoginIcon />}>
                    Entrar no sistema
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'center', md: 'center' }}
            textAlign={{ xs: 'center', md: 'left' }}
          >
            <Box
              component="img"
              src={logoHorizontal}
              alt={config.brandName}
              sx={{
                width: { xs: 180, sm: 210 },
                maxWidth: '100%',
                height: 'auto',
                filter: 'brightness(0) invert(1)'
              }}
            />
            <Typography variant="body2" sx={{ opacity: 0.92 }}>
              Desenvolvido por ArchangelSoft - Todos os Direitos Reservados
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}