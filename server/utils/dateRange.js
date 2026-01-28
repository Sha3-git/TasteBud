/**
 * ranges must receive the users time zone in their local time 
 * local time = UTC - tzOffsetMinutes
 * so UTC = Local Time + tzOffsetMinutes
 */


function dayRange(date, tzOffsetMinutes) {
  const [year, month, day] = date.split("-").map(Number);
  
  const userLocalStart = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  const userLocalEnd = Date.UTC(year, month - 1, day, 23, 59, 59, 999);
  
  const start = new Date(userLocalStart + tzOffsetMinutes * 60000);
  const end = new Date(userLocalEnd + tzOffsetMinutes * 60000);
  
  return { start, end };
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

function monthRange(year, month, tzOffsetMinutes) {
  // User's local first day of month
  const userLocalStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  // User's local last day of month
  const userLocalEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
  
  // Convert to UTC for database query
  const start = new Date(userLocalStart.getTime() + tzOffsetMinutes * 60000);
  const end = new Date(userLocalEnd.getTime() + tzOffsetMinutes * 60000);
  
  return { start, end };
}
function yearRange(year) {
  const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
  return { start, end };
}


module.exports = { dayRange, weekRange, monthRange, yearRange };
