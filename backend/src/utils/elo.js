const K = 32;

export function izracunajElo(rejtingA, rejtingB, pobjednikJeA) {
  const ocekivanoA = 1 / (1 + Math.pow(10, (rejtingB - rejtingA) / 400));
  const ocekivanoB = 1 - ocekivanoA;

  const scoreA = pobjednikJeA ? 1 : 0;
  const scoreB = pobjednikJeA ? 0 : 1;

  const noviA = Math.round(rejtingA + K * (scoreA - ocekivanoA));
  const noviB = Math.round(rejtingB + K * (scoreB - ocekivanoB));

  return {
    noviRejtingA: noviA,
    noviRejtingB: noviB,
    promjenaA: noviA - rejtingA,
    promjenaB: noviB - rejtingB,
  };
}
