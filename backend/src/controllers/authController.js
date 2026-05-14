import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const safeKorisnik = (k) => ({
  id: k.id, ime: k.ime, prezime: k.prezime,
  email: k.email, uloga: k.uloga, rejting: k.rejting, telefon: k.telefon,
});

export const register = async (req, res) => {
  const { ime, prezime, email, lozinka, telefon } = req.body;
  if (!ime || !prezime || !email || !lozinka)
    return res.status(400).json({ error: 'Sva polja su obavezna' });

  const postoji = await prisma.korisnik.findUnique({ where: { email } });
  if (postoji) return res.status(409).json({ error: 'Email već postoji' });

  const lozinkaHash = await bcrypt.hash(lozinka, 10);
  const korisnik = await prisma.korisnik.create({
    data: { ime, prezime, email, lozinkaHash, telefon },
  });

  const token = jwt.sign({ id: korisnik.id, uloga: korisnik.uloga }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, korisnik: safeKorisnik(korisnik) });
};

export const login = async (req, res) => {
  const { email, lozinka } = req.body;
  const korisnik = await prisma.korisnik.findUnique({ where: { email } });
  if (!korisnik) return res.status(401).json({ error: 'Pogrešan email ili lozinka' });

  const tocno = await bcrypt.compare(lozinka, korisnik.lozinkaHash);
  if (!tocno) return res.status(401).json({ error: 'Pogrešan email ili lozinka' });

  const token = jwt.sign({ id: korisnik.id, uloga: korisnik.uloga }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, korisnik: safeKorisnik(korisnik) });
};

export const getMe = async (req, res) => {
  const korisnik = await prisma.korisnik.findUnique({ where: { id: req.user.id } });
  if (!korisnik) return res.status(404).json({ error: 'Korisnik nije pronađen' });
  res.json(safeKorisnik(korisnik));
};
