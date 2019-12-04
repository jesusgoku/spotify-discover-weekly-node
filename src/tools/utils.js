import { createInterface } from 'readline';

function handleError(err) {
  console.error(err); // eslint-disable-line no-console
}

function handleConsoleAndReturn(data) {
  console.log(data); // eslint-disable-line no-console

  return data;
}

/**
 *
 * @param {Date} initialDate initial
 */
function firstDayOfWeek(initialDate) {
  const d = initialDate ? new Date(initialDate) : new Date();
  const daysSub = d.getDay() === 0 ? -6 : 1 - d.getDay();

  d.setDate(d.getDate() + daysSub);

  return d;
}

function YYYYMMDDFormat(d) {
  const month = d.getMonth() + 1;
  const date = d.getDate();

  return `${d.getFullYear()}${month < 10 ? `0${month}` : month}${date < 10 ? `0${date}` : date}`;
}

function question(questionStr) {
  return new Promise(resolve => {
    const read = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    read.question(`${questionStr}: `, answer => {
      read.close();

      resolve(answer);
    });
  });
}

export { handleError, handleConsoleAndReturn, firstDayOfWeek, YYYYMMDDFormat, question };
