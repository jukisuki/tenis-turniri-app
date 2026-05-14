import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vijestiInclude = {
  autor: { select: { id: true, ime: true, prezime: true } },
};

export const listVijesti = async (_req, res) => {
  const vijesti = await prisma.vijest.findMany({ include: vijestiInclude, orderBy: { createdAt: 'desc' } });
  res.json(vijesti);
};

export const getVijest = async (req, res) => {
  const vijest = await prisma.vijest.findUnique({ where: { id: Number(req.params.id) }, include: vijestiInclude });
  if (!vijest) return res.status(404).json({ error: 'Vijest nije pronađena' });
  res.json(vijest);
};

export const createVijest = async (req, res) => {
  const { naslov, sadrzaj } = req.body;
  const vijest = await prisma.vijest.create({
    data: { naslov, sadrzaj, autorId: req.user.id },
    include: vijestiInclude,
  });
  res.status(201).json(vijest);
};

export const updateVijest = async (req, res) => {
  const { naslov, sadrzaj } = req.body;
  const vijest = await prisma.vijest.update({
    where: { id: Number(req.params.id) },
    data: { ...(naslov && { naslov }), ...(sadrzaj && { sadrzaj }) },
    include: vijestiInclude,
  });
  res.json(vijest);
};

export const deleteVijest = async (req, res) => {
  await prisma.vijest.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
};
