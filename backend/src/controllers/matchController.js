import { PrismaClient } from '@prisma/client';
import { izracunajElo } from '../utils/elo.js';

const prisma = new PrismaClient();

const mecInclude = {
  igrac1: { select: { id: true, ime: true, prezime: true, rejting: true } },
  igrac2: { select: { id: true, ime: true, prezime: true, rejting: true } },
  pobjednik: { select: { id: true, ime: true, prezime: true } },
  turnir: { select: { id: true, naziv: true } },
};

export const listMecevi = async (req, res) => {
  const { turnirId, igracId } = req.query;
  const mecevi = await prisma.mec.findMany({
    where: {
      ...(turnirId && { turnirId: Number(turnirId) }),
      ...(igracId && { OR: [{ igrac1Id: Number(igracId) }, { igrac2Id: Number(igracId) }] }),
    },
    include: mecInclude,
    orderBy: { createdAt: 'desc' },
  });
  res.json(mecevi);
};

export const getMec = async (req, res) => {
  const mec = await prisma.mec.findUnique({ where: { id: Number(req.params.id) }, include: mecInclude });
  if (!mec) return res.status(404).json({ error: 'Meč nije pronađen' });
  res.json(mec);
};

export const createMec = async (req, res) => {
  const { turnirId, igrac1Id, igrac2Id, datum, runda } = req.body;
  const mec = await prisma.mec.create({
    data: {
      turnirId: Number(turnirId),
      igrac1Id: Number(igrac1Id),
      igrac2Id: Number(igrac2Id),
      ...(datum && { datum: new Date(datum) }),
      ...(runda && { runda }),
    },
    include: mecInclude,
  });
  res.status(201).json(mec);
};

export const recordResult = async (req, res) => {
  const id = Number(req.params.id);
  const { pobjednikId, rezultat } = req.body;

  const mec = await prisma.mec.findUnique({
    where: { id },
    include: {
      igrac1: true,
      igrac2: true,
    },
  });
  if (!mec) return res.status(404).json({ error: 'Meč nije pronađen' });
  if (mec.pobjednikId) return res.status(400).json({ error: 'Rezultat je već unesen' });

  const pobjednikJeIgrac1 = Number(pobjednikId) === mec.igrac1Id;
  const elo = izracunajElo(mec.igrac1.rejting, mec.igrac2.rejting, pobjednikJeIgrac1);

  await prisma.$transaction([
    prisma.mec.update({
      where: { id },
      data: { pobjednikId: Number(pobjednikId), rezultat },
    }),
    prisma.korisnik.update({ where: { id: mec.igrac1Id }, data: { rejting: elo.noviRejtingA } }),
    prisma.korisnik.update({ where: { id: mec.igrac2Id }, data: { rejting: elo.noviRejtingB } }),
    prisma.historijaRejtinga.create({
      data: { igracId: mec.igrac1Id, mecId: id, promjena: elo.promjenaA, noviRejting: elo.noviRejtingA },
    }),
    prisma.historijaRejtinga.create({
      data: { igracId: mec.igrac2Id, mecId: id, promjena: elo.promjenaB, noviRejting: elo.noviRejtingB },
    }),
  ]);

  const azuriraniMec = await prisma.mec.findUnique({ where: { id }, include: mecInclude });
  res.json(azuriraniMec);
};

export const deleteMec = async (req, res) => {
  await prisma.mec.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
};
