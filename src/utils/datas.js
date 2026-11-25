function dataValidaISO(dataStr) {
  if (typeof dataStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
    return false;
  }
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const dt = new Date(Date.UTC(ano, mes - 1, dia));
  return (
    dt.getUTCFullYear() === ano &&
    dt.getUTCMonth() === mes - 1 &&
    dt.getUTCDate() === dia
  );
}

function mesCorrenteIntervalo() {
  const agora = new Date();
  const ano = agora.getUTCFullYear();
  const mes = agora.getUTCMonth();
  const inicio = new Date(Date.UTC(ano, mes, 1)).toISOString().slice(0, 10);
  const fim = new Date(Date.UTC(ano, mes + 1, 0)).toISOString().slice(0, 10);
  return { inicio, fim };
}

function calcularPeriodoAnterior(inicioStr, fimStr) {
  const [a1, m1, d1] = inicioStr.split('-').map(Number);
  const [a2, m2, d2] = fimStr.split('-').map(Number);

  const dtInicio = new Date(Date.UTC(a1, m1 - 1, d1));
  const dtFim = new Date(Date.UTC(a2, m2 - 1, d2));

  const ultimoDiaMesFim = new Date(Date.UTC(a2, m2, 0)).getUTCDate();
  if (a1 === a2 && m1 === m2 && d1 === 1 && d2 === ultimoDiaMesFim) {
    const antInicio = new Date(Date.UTC(a1, m1 - 2, 1)).toISOString().slice(0, 10);
    const antFim = new Date(Date.UTC(a1, m1 - 1, 0)).toISOString().slice(0, 10);
    return { inicio: antInicio, fim: antFim };
  }

  const umDiaMs = 24 * 60 * 60 * 1000;
  const duracaoDias = Math.round((dtFim - dtInicio) / umDiaMs) + 1;
  const antFim = new Date(dtInicio.getTime() - umDiaMs).toISOString().slice(0, 10);
  const antInicio = new Date(dtInicio.getTime() - duracaoDias * umDiaMs).toISOString().slice(0, 10);
  return { inicio: antInicio, fim: antFim };
}

module.exports = { dataValidaISO, mesCorrenteIntervalo, calcularPeriodoAnterior };