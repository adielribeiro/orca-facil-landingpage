import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import HistoryIcon from "@mui/icons-material/History";
import CalculateIcon from "@mui/icons-material/Calculate";
import DevicesIcon from "@mui/icons-material/Devices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ConstructionIcon from "@mui/icons-material/Construction";
import BoltIcon from "@mui/icons-material/Bolt";
import HandymanIcon from "@mui/icons-material/Handyman";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import LoginIcon from "@mui/icons-material/Login";

const WHATSAPP_LINK =
  "https://wa.me/5517981686253?text=Ol%C3%A1%2C%20quero%20conhecer%20o%20sistema%20de%20or%C3%A7amentos.";

const APP_LINK = "https://gerador-orcamentos-sigma.vercel.app";

const beneficios = [
  {
    titulo: "Cálculo automático",
    descricao:
      "Some mão de obra, peças e insumos rapidamente e reduza erros no orçamento.",
    icon: <CalculateIcon fontSize="large" />
  },
  {
    titulo: "PDF profissional",
    descricao:
      "Gere um orçamento bonito e organizado para enviar ao cliente em poucos cliques.",
    icon: <PictureAsPdfIcon fontSize="large" />
  },
  {
    titulo: "Histórico salvo",
    descricao:
      "Consulte orçamentos anteriores e não perca informações importantes do atendimento.",
    icon: <HistoryIcon fontSize="large" />
  },
  {
    titulo: "Acesso por login",
    descricao:
      "Cada usuário acessa sua própria conta com segurança e organização.",
    icon: <LoginIcon fontSize="large" />
  },
  {
    titulo: "Celular e computador",
    descricao:
      "Atenda com agilidade no celular e trabalhe com conforto no computador.",
    icon: <DevicesIcon fontSize="large" />
  },
  {
    titulo: "Mais confiança na venda",
    descricao:
      "Passe mais profissionalismo e aumente a confiança do cliente no seu serviço.",
    icon: <CheckCircleIcon fontSize="large" />
  }
];

const nichos = [
  { nome: "Oficinas", icon: <ConstructionIcon /> },
  { nome: "Eletricistas", icon: <BoltIcon /> },
  { nome: "Instaladores", icon: <HandymanIcon /> },
  { nome: "Assistência técnica", icon: <HomeRepairServiceIcon /> },
  { nome: "Marcenaria", icon: <PrecisionManufacturingIcon /> },
  { nome: "Prestadores de serviço", icon: <ConstructionIcon /> }
];

const plano = {
  nome: "Plano Profissional",
  preco: "R$ 119,90 Vitalício",
  descricao:
    "Tudo o que você precisa para criar, salvar e enviar orçamentos com mais rapidez e profissionalismo.",
  itens: [
    "Cadastro de orçamentos",
    "Cálculo automático",
    "Geração de PDF",
    "Envio por WhatsApp e e-mail",
    "Histórico completo",
    "Configurações por usuário",
    "Acesso por login",
    "Uso no celular e computador"
  ]
};

function SectionTitle({ chip, title, subtitle, center = false }) {
  return (
    <Stack
      spacing={1}
      sx={{
        mb: 4,
        textAlign: center ? "center" : "left",
        alignItems: center ? "center" : "flex-start"
      }}
    >
      {chip ? <Chip label={chip} color="primary" variant="outlined" /> : null}
      <Typography variant="h4" fontWeight={800}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 760 }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}

function FeatureCard({ item }) {
  return (
    <Card sx={{ height: "100%", borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ color: "primary.main" }}>{item.icon}</Box>
          <Typography variant="h6">{item.titulo}</Typography>
          <Typography color="text.secondary">{item.descricao}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", background: "#f8fafc" }}>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar
          sx={{
            borderBottom: "1px solid #e5e7eb",
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <Typography variant="h6" fontWeight={800}>
            Gerador de Orçamentos
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              href={APP_LINK}
              startIcon={<LoginIcon />}
            >
              Entrar
            </Button>

            <Button
              variant="contained"
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              startIcon={<WhatsAppIcon />}
            >
              Falar no WhatsApp
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: "grid",
            gap: 4,
            alignItems: "center",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }
          }}
        >
          <Stack spacing={3}>
            <Chip
              label="Orçamentos rápidos e profissionais"
              color="primary"
              variant="outlined"
              sx={{ width: "fit-content" }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.3rem", md: "4rem" },
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
              Calcule mão de obra, peças e insumos automaticamente, gere PDF
              e envie para seus clientes por WhatsApp ou e-mail.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                size="large"
                variant="contained"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
              >
                Quero conhecer
              </Button>

              <Button
                size="large"
                variant="outlined"
                href={APP_LINK}
                startIcon={<LoginIcon />}
              >
                Entrar no sistema
              </Button>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 1 }}
            >
              <Chip label="Cálculo automático" />
              <Chip label="PDF profissional" />
              <Chip label="Histórico salvo" />
            </Stack>
          </Stack>

          <Card sx={{ borderRadius: 5 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Exemplo de orçamento</Typography>

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
                    background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)"
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

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
          <SectionTitle
            chip="Problema"
            title="Você ainda faz orçamento no papel, planilha ou mensagem solta?"
            subtitle="Isso faz você perder tempo, errar valores e passar menos confiança para o cliente."
            center
          />

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }
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
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }
          }}
        >
          {beneficios.map((item) => (
            <FeatureCard key={item.titulo} item={item} />
          ))}
        </Box>
      </Container>

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
          <SectionTitle
            chip="Ideal para"
            title="Feito para quem precisa orçar com rapidez"
            subtitle="Atenda melhor seus clientes e mantenha seus orçamentos organizados."
            center
          />

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" }
            }}
          >
            {nichos.map((item) => (
              <Paper
                key={item.nome}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5
                }}
              >
                <Box sx={{ color: "primary.main" }}>{item.icon}</Box>
                <Typography fontWeight={600}>{item.nome}</Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle
          chip="Plano único"
          title="Uma única opção, completa para o seu negócio"
          subtitle="Sem complicação para escolher. Você entra com tudo o que precisa para organizar e profissionalizar seus orçamentos."
          center
        />

        <Card
          sx={{
            borderRadius: 5,
            border: "2px solid",
            borderColor: "primary.main",
            boxShadow: "0 18px 40px rgba(25, 118, 210, 0.15)"
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
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

              <Divider sx={{ width: "100%" }} />

              <Stack spacing={1.5} sx={{ width: "100%", maxWidth: 520 }}>
                {plano.itens.map((texto) => (
                  <Stack
                    key={texto}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body1">{texto}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ pt: 1 }}
              >
                <Button
                  size="large"
                  variant="contained"
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  startIcon={<WhatsAppIcon />}
                >
                  Quero assinar
                </Button>

                <Button
                  size="large"
                  variant="outlined"
                  href={APP_LINK}
                  startIcon={<LoginIcon />}
                >
                  Entrar no sistema
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#ffffff" }}>
        <Container maxWidth="md">
          <Card sx={{ borderRadius: 5, textAlign: "center" }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Stack spacing={2} alignItems="center">
                <Chip label="Comece agora" color="primary" />
                <Typography variant="h4" fontWeight={900}>
                  Pare de perder orçamento e ganhe agilidade no atendimento
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 700 }}>
                  Organize seus orçamentos em um sistema simples, rápido e profissional.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 1 }}>
                  <Button
                    size="large"
                    variant="contained"
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Quero falar no WhatsApp
                  </Button>

                  <Button
                    size="large"
                    variant="outlined"
                    href={APP_LINK}
                    startIcon={<LoginIcon />}
                  >
                    Entrar no sistema
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}