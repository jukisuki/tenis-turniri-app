import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listTurniri = async (_req, res) => {
  const turniri = await prisma.turnir.findMany({
    orderBy: { datum: 'asc' },
    include: { _count: { select: { prijave: { where: { status: 'ODOBREN' } } } } },
  });
  res.json(turniri);
};

export const getTurnir = async (req, res) => {
  const turnir = await prisma.turnir.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      prijave: {
        where: { status: 'ODOBREN' },
        include: { igrac: { select: { id: true, ime: true, prezime: true, rejting: true } } },
      },
      mecevi: {
        include: {
          igrac1: { select: { id: true, ime: true, prezime: true } },
          igrac2: { select: { id: true, ime: true, prezime: true } },
          pobjednik: { select: { id: true, ime: true, prezime: true } },
        },
        orderBy: { datum: 'asc' },
      },
    },
  });
  if (!turnir) return res.status(404).json({ error: 'Turnir nije pronađen' });
  res.json(turnir);
};

export const createTurnir = async (req, res) => {
  const { naziv, datum, rokPrijave, kategorija, maxIgraca, opis } = req.body;
  const turnir = await prisma.turnir.create({
    data: { naziv, datum: new Date(datum), rokPrijave: new Date(rokPrijave), kategorija, maxIgraca: Number(maxIgraca), opis },
  });
  res.status(201).json(turnir);
};

export const updateTurnir = async (req, res) => {
  const { naziv, datum, rokPrijave, kategorija, maxIgraca, opis, status } = req.body;
  const turnir = await prisma.turnir.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(naziv && { naziv }),
      ...(datum && { datum: new Date(datum) }),
      ...(rokPrijave && { rokPrijave: new Date(rokPrijave) }),
      ...(kategorija && { kategorija }),
      ...(maxIgraca && { maxIgraca: Number(maxIgraca) }),
      ...(opis !== undefined && { opis }),
      ...(status && { status }),
    },
  });
  res.json(turnir);
};

export const deleteTurnir = async (req, res) => {
  await prisma.turnir.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
};
