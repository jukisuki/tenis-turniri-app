import { PrismaClient, Uloga, StatusTurnira } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const igracHash = await bcrypt.hash('igrac123', 10);

  const admin = await prisma.korisnik.upsert({
    where: { email: 'admin@tenisklub.hr' },
    update: {},
    create: {
      ime: 'Admin',
      prezime: 'Klub',
      email: 'admin@tenisklub.hr',
      lozinkaHash: adminHash,
      uloga: Uloga.ADMIN,
      rejting: 1200,
    },
  });

  const igraci = await Promise.all([
    prisma.korisnik.upsert({
      where: { email: 'ivan.horvat@email.hr' },
      update: {},
      create: { ime: 'Ivan', prezime: 'Horvat', email: 'ivan.horvat@email.hr', lozinkaHash: igracHash, rejting: 1150 },
    }),
    prisma.korisnik.upsert({
      where: { email: 'marko.kovac@email.hr' },
      update: {},
      create: { ime: 'Marko', prezime: 'Kovač', email: 'marko.kovac@email.hr', lozinkaHash: igracHash, rejting: 1080 },
    }),
    prisma.korisnik.upsert({
      where: { email: 'petra.novak@email.hr' },
      update: {},
      create: { ime: 'Petra', prezime: 'Novak', email: 'petra.novak@email.hr', lozinkaHash: igracHash, rejting: 1320 },
    }),
  ]);

  await prisma.turnir.createMany({
    skipDuplicates: true,
    data: [
      {
        naziv: 'Proljetno klupsko natjecanje 2025',
        datum: new Date('2025-05-20'),
        rokPrijave: new Date('2025-05-10'),
        kategorija: 'Otvorena',
        maxIgraca: 32,
        opis: 'Godišnje proljetno natjecanje otvoreno za sve članove kluba.',
        status: StatusTurnira.OTVOREN,
      },
      {
        naziv: 'Ljetni kup 2025',
        datum: new Date('2025-07-15'),
        rokPrijave: new Date('2025-07-01'),
        kategorija: 'Amateri',
        maxIgraca: 16,
        opis: 'Ljetni turnir za amatere do 1200 ELO bodova.',
        status: StatusTurnira.OTVOREN,
      },
    ],
  });

  await prisma.vijest.createMany({
    skipDuplicates: true,
    data: [
      {
        naslov: 'Dobrodošli na stranicu Tenis Kluba!',
        sadrzaj: 'Dragi članovi, sa zadovoljstvom predstavljamo novu web stranicu kluba. Ovdje možete pratiti rezultate, rejtinge i prijavljati se na turnire.',
        autorId: admin.id,
      },
      {
        naslov: 'Prijave za Proljetno natjecanje su otvorene',
        sadrzaj: 'Obavještavamo sve članove da su prijave za Proljetno klupsko natjecanje 2025 otvorene. Rok za prijave je 10. svibnja 2025. Prijavite se što prije!',
        autorId: admin.id,
      },
    ],
  });

  console.log('Seed uspješno završen!');
  console.log(`Admin: admin@tenisklub.hr / admin123`);
  console.log(`Igrači: *.@email.hr / igrac123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
