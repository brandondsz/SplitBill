function splitBill(totalCost, fixedCost, totalDays, persons) {
  const dailyVariableCost = (totalCost - fixedCost) / totalDays;

  // Initialize charges with each person's fixed cost share
  for (const person of persons) {
    person.charge = fixedCost / persons.length;
  }

  // For each day, split the variable cost among present people
  for (let day = 0; day < totalDays; day++) {
    const present = persons.filter(p => !p.absentDays.includes(day));
    if (present.length === 0) {
      // Nobody present — split equally among all
      const share = dailyVariableCost / persons.length;
      for (const person of persons) {
        person.charge += share;
      }
    } else {
      const share = dailyVariableCost / present.length;
      for (const person of present) {
        person.charge += share;
      }
    }
  }

  for (const person of persons) {
    console.log(person.name + ': ' + person.charge.toFixed(2));
  }
}

// --- Tests ---

function test(name, totalCost, fixedCost, totalDays, persons) {
  console.log(`\n=== ${name} ===`);
  // Reset charges
  for (const p of persons) p.charge = 0;
  splitBill(totalCost, fixedCost, totalDays, persons);
  const total = persons.reduce((sum, p) => sum + p.charge, 0);
  console.log('Total: ' + total.toFixed(2));
  console.log('Matches totalCost: ' + (Math.abs(total - totalCost) < 0.01));
}

// 1. Basic: no absences, equal split
test('No absences', 300, 0, 30, [
  { name: 'Alice', absentDays: [] },
  { name: 'Bob', absentDays: [] },
  { name: 'Charlie', absentDays: [] },
]);

// 2. One person absent some days
test('One person absent 10 days', 300, 0, 30, [
  { name: 'Alice', absentDays: [] },
  { name: 'Bob', absentDays: [0,1,2,3,4,5,6,7,8,9] },
  { name: 'Charlie', absentDays: [] },
]);

// 3. With fixed cost
test('With fixed cost', 300, 90, 30, [
  { name: 'Alice', absentDays: [] },
  { name: 'Bob', absentDays: [0,1,2,3,4,5,6,7,8,9] },
  { name: 'Charlie', absentDays: [] },
]);

// 4. Everyone absent on one day
test('Everyone absent day 0', 300, 0, 30, [
  { name: 'Alice', absentDays: [0] },
  { name: 'Bob', absentDays: [0] },
  { name: 'Charlie', absentDays: [0] },
]);

// 5. Only one person
test('Single person', 300, 50, 30, [
  { name: 'Alice', absentDays: [0,1,2] },
]);

// 6. All absent every day
test('Everyone absent every day', 300, 0, 3, [
  { name: 'Alice', absentDays: [0,1,2] },
  { name: 'Bob', absentDays: [0,1,2] },
]);

// 7. Zero total cost
test('Zero total cost', 0, 0, 30, [
  { name: 'Alice', absentDays: [] },
  { name: 'Bob', absentDays: [] },
]);

// 8. totalCost equals fixedCost (no variable cost)
test('All fixed cost', 100, 100, 30, [
  { name: 'Alice', absentDays: [0,1,2,3,4] },
  { name: 'Bob', absentDays: [] },
]);

// 9. One day only
test('Single day', 100, 10, 1, [
  { name: 'Alice', absentDays: [] },
  { name: 'Bob', absentDays: [0] },
]);

// 10. Zero days
test('Zero days', 100, 0, 0, [
  { name: 'Alice', absentDays: [] },
  { name: 'Bob', absentDays: [] },
]);

// 11. Empty persons array
test('No persons', 300, 0, 30, []);

// 12. fixedCost > totalCost (negative variable cost)
test('Fixed > Total', 100, 200, 30, [
  { name: 'Alice', absentDays: [] },
  { name: 'Bob', absentDays: [] },
]);
