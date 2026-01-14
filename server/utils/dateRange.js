function dayRange(date) {
  const [year, month, day] = date.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return { start, end }
}

function weekRange(weekDate) {
  const date = new Date(weekDate);
  const day = date.getUTCDay();
  const diff = date.getUTCDate() - day;

  const start = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    diff,
    0, 0, 0, 0
  ));
  const end = new Date(Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate() + 6,
    23, 59, 59, 999
  ));
  return { start, end };
  
}

function monthRange(year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function yearRange(year) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

module.exports = { dayRange, weekRange, monthRange, yearRange };
