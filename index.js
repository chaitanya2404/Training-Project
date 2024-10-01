const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'trainings.txt');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Task 1: List each completed training with a count of how many people have completed it
const trainingCounts = {};

data.forEach(person => {
  person.completions.forEach(completion => {
    const trainingName = completion.name;
    if (!trainingCounts[trainingName]) {
      trainingCounts[trainingName] = 0;
    }
    trainingCounts[trainingName]++;
  });
});

fs.writeFileSync('task1.json', JSON.stringify(trainingCounts, null, 2));

// Task 2: List people who completed specific trainings in the fiscal year 2024
const fiscalYearTrainings = ["Electrical Safety for Labs", "X-Ray Safety", "Laboratory Safety Training"];
const fiscalYear2024 = { start: new Date('2023-07-01'), end: new Date('2024-06-30') };

const peopleInFiscalYear = data.map(person => {
  const relevantCompletions = person.completions.filter(completion => {
    const completionDate = new Date(completion.timestamp);
    return fiscalYearTrainings.includes(completion.name) &&
           completionDate >= fiscalYear2024.start && completionDate <= fiscalYear2024.end;
  });
  return relevantCompletions.length > 0 ? { name: person.name, completions: relevantCompletions } : null;
}).filter(person => person);

fs.writeFileSync('task2.json', JSON.stringify(peopleInFiscalYear, null, 2));

// Task 3: List people with expired or expiring trainings within one month of October 1st, 2023
const targetDate = new Date('2023-10-01');
const oneMonthLater = new Date(targetDate);
oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

const expiredOrExpiringSoon = data.map(person => {
  const relevantCompletions = person.completions.filter(completion => {
    if (!completion.expires) return false;
    const expirationDate = new Date(completion.expires);
    return expirationDate < targetDate || (expirationDate >= targetDate && expirationDate <= oneMonthLater);
  }).map(completion => ({
    ...completion,
    status: new Date(completion.expires) < targetDate ? 'expired' : 'expires soon'
  }));

  return relevantCompletions.length > 0 ? { name: person.name, completions: relevantCompletions } : null;
}).filter(person => person);

fs.writeFileSync('task3.json', JSON.stringify(expiredOrExpiringSoon, null, 2));

console.log('Tasks completed. Check the JSON output files.');
