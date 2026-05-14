import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import tournamentRoutes from './routes/tournaments.js';
import playerRoutes from './routes/players.js';
import matchRoutes from './routes/matches.js';
import registrationRoutes from './routes/registrations.js';
import newsRoutes from './routes/news.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/turniri', tournamentRoutes);
app.use('/api/igraci', playerRoutes);
app.use('/api/mecevi', matchRoutes);
app.use('/api/prijave', registrationRoutes);
app.use('/api/vijesti', newsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Interna greška servera' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend pokrenut na portu ${PORT}`));
