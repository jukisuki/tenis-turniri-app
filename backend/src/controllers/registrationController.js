import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const prijavaInclude = {
  igrac: { select: { id: true, ime: true, prezime: true, email: true, rejting: true } },
  turnir: { select: { id: true, naziv: true, datum: true, kategorija: true } },
};

export const listPrijave = async (req, res) => {
  const { turnirId, status } = req.query;
  const prijave = await prisma.prijava.findMany({
    where: {
      ...(turnirId && { turnirId: Number(turnirId) }),
      ...(status && { status }),
    },
    include: prijavaInclude,
    orderBy: { createdAt: 'desc' },
  });
  res.json(prijave);
};

export const prijaviSe = async (req, res) => {
  const { turnirId } = req.body;
  const igracId = req.user.id;

  const turnir = await prisma.turnir.findUnique({ where: { id: Number(turnirId) } });
  if (!turnir) return res.status(404).json({ error: 'Turnir nije pronađen' });
  if (turnir.status !== 'OTVOREN') return res.status(400).json({ error: 'Prijave nisu otvorene' });
  if (new Date() > turnir.rokPrijave) return res.status(400).json({ error: 'Rok za prijave je prošao' });

  const brojOdobrenih = await prisma.prijava.count({ where: { turnirId: Number(turnirId), status: 'ODOBREN' } });
  if (brojOdobrenih >= turnir.maxIgraca) return res.status(400).json({ error: 'Turnir je popunjen' });

  const prijava = await prisma.prijava.create({
    data: { igracId, turnirId: Number(turnirId) },
    include: prijavaInclude,
  });
  res.status(201).json(prijava);
};

export const odobriPrijavu = async (req, res) => {
  const prijava = await prisma.prijava.update({
    where: { id: Number(req.params.id) },
    data: { status: 'ODOBREN' },
    include: prijavaInclude,
  });
  res.json(prijava);
};

export const odbijPrijavu = async (req, res) => {
  const prijava = await prisma.prijava.update({
    where: { id: Number(req.params.id) },
    data: { status: 'ODBIJEN' },
    include: prijavaInclude,
  });
  res.json(prijava);
};

export const otkaziPrijavu = async (req, res) => {
  const prijava = await prisma.prijava.findUnique({ where: { id: Number(req.params.id) } });
  if (!prijava) return res.status(404).json({ error: 'Prijava nije pronađena' });
  if (prijava.igracId !== req.user.id && req.user.uloga !== 'ADMIN')
    return res.status(403).json({ error: 'Nemate dozvolu' });

  await prisma.prijava.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
};
