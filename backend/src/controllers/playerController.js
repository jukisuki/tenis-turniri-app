import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listIgraci = async (_req, res) => {
  const igraci = await prisma.korisnik.findMany({
    where: { uloga: 'IGRAC' },
    select: { id: true, ime: true, prezime: true, rejting: true, createdAt: true },
    orderBy: { rejting: 'desc' },
  });
  res.json(igraci);
};

export const getIgrac = async (req, res) => {
  const igrac = await prisma.korisnik.findUnique({
    where: { id: Number(req.params.id) },
    select: {
      id: true, ime: true, prezime: true, email: true,
      rejting: true, telefon: true, createdAt: true,
      prijave: {
        include: { turnir: { select: { id: true, naziv: true, datum: true } } },
        orderBy: { createdAt: 'desc' },
      },
      mecheviKaoIgrac1: {
        include: {
          igrac2: { select: { id: true, ime: true, prezime: true } },
          pobjednik: { select: { id: true } },
          turnir: { select: { id: true, naziv: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      mecheviKaoIgrac2: {
        include: {
          igrac1: { select: { id: true, ime: true, prezime: true } },
          pobjednik: { select: { id: true } },
          turnir: { select: { id: true, naziv: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      historijaRejtinga: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
  if (!igrac) return res.status(404).json({ error: 'Igrač nije pronađen' });
  res.json(igrac);
};

export const updateIgrac = async (req, res) => {
  const id = Number(req.params.id);
  if (req.user.id !== id && req.user.uloga !== 'ADMIN')
    return res.status(403).json({ error: 'Nemate dozvolu' });

  const { ime, prezime, telefon } = req.body;
  const igrac = await prisma.korisnik.update({
    where: { id },
    data: {
      ...(ime && { ime }),
      ...(prezime && { prezime }),
      ...(telefon !== undefined && { telefon }),
    },
    select: { id: true, ime: true, prezime: true, email: true, rejting: true, telefon: true },
  });
  res.json(igrac);
};

export const deleteIgrac = async (req, res) => {
  await prisma.korisnik.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
};
