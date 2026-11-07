const reward = { gold: 10, xp: 20 }

export const CHALLENGES = {
  l1c1: {
    ...reward,
    id: 'l1c1',
    levelId: 1,
    type: 'mcq',
    title: 'Choose the Right Chest',
    prompt:
      'You need a variable whose value can be changed later. Which keyword should you use?',
    options: ['const', 'let', 'final', 'define'],
    correctIndex: 1,
    hint: 'One keyword lets you reassign the value. The other locks it in place.',
    explanation:
      'let creates a variable that can be reassigned. const creates a value that cannot be reassigned. final and define are not JavaScript keywords for variables.',
  },
  l1c2: {
    ...reward,
    id: 'l1c2',
    levelId: 1,
    type: 'complete',
    title: 'Fill the Supply Ledger',
    prompt: 'Declare a variable called gold and give it the value 100.',
    template: '[[0]] gold = [[1]];',
    blanks: [
      { answers: ['let', 'var'], placeholder: 'keyword', width: '7ch', ignoreCase: true },
      { answers: ['100'], placeholder: 'value', width: '5ch' },
    ],
    hint: 'Start with the keyword that declares a changeable variable, then write the number.',
    explanation:
      'let gold = 100; declares a variable named gold and stores the number 100 inside it.',
  },
  l1c3: {
    ...reward,
    id: 'l1c3',
    levelId: 1,
    type: 'arrange',
    title: 'Raise the Banner',
    prompt:
      'Arrange the lines so the hero is declared, promoted, and then printed as King.',
    blocks: [
      { id: 'a', code: 'let hero = "Knight";' },
      { id: 'b', code: 'hero = "King";' },
      { id: 'c', code: 'console.log(hero); // King' },
    ],
    correctOrder: ['a', 'b', 'c'],
    hint: 'A variable must exist before you change it, and you print it last.',
    explanation:
      'First we declare hero with let. Then we reassign it to "King". Finally we print the new value. Order matters in JavaScript.',
  },

  l2c1: {
    ...reward,
    id: 'l2c1',
    levelId: 2,
    type: 'mcq',
    title: 'The Dragon Scroll',
    prompt: 'What does typeof "Dragon" return?',
    options: ['"string"', '"number"', '"boolean"', '"object"'],
    correctIndex: 0,
    hint: 'Text wrapped in quotes is always a string.',
    explanation:
      '"Dragon" is text inside quotes, so it is a string. typeof returns "string".',
  },
  l2c2: {
    ...reward,
    id: 'l2c2',
    levelId: 2,
    type: 'mcq',
    title: 'True or False?',
    prompt: 'Which of these values is a boolean?',
    options: ['"true"', 'true', '1', 'undefined'],
    correctIndex: 1,
    hint: 'A boolean is not text. It has no quotes.',
    explanation:
      'true without quotes is a boolean. "true" with quotes is a string. 1 is a number, and undefined means no value has been set.',
  },
  l2c3: {
    ...reward,
    id: 'l2c3',
    levelId: 2,
    type: 'complete',
    title: 'Forge a Boolean',
    prompt:
      'Complete the code so typeof hasSword prints "boolean".',
    template: 'let hasSword = [[0]];\nconsole.log(typeof hasSword); // "boolean"',
    blanks: [
      {
        answers: ['true', 'false'],
        placeholder: 'value',
        width: '7ch',
        ignoreCase: true,
      },
    ],
    hint: 'Use one of the two boolean values, without quotes.',
    explanation:
      'Both true and false are booleans. Writing "true" with quotes would make it a string instead.',
  },

  l3c1: {
    ...reward,
    id: 'l3c1',
    levelId: 3,
    type: 'mcq',
    title: 'Count the Gold',
    prompt: 'What is the result of 5 + 3 * 2?',
    options: ['16', '11', '13', '10'],
    correctIndex: 1,
    hint: 'Multiplication happens before addition.',
    explanation:
      'JavaScript multiplies before it adds: 3 * 2 = 6, then 5 + 6 = 11.',
  },
  l3c2: {
    ...reward,
    id: 'l3c2',
    levelId: 3,
    type: 'complete',
    title: 'Fill the Coffer',
    prompt: 'Add 5 to the gold variable so the final value is 15.',
    template: 'let gold = 10;\ngold [[0]] 5;\nconsole.log(gold); // 15',
    blanks: [
      { answers: ['+='], placeholder: 'operator', width: '5ch' },
    ],
    hint: 'You need a shortcut operator that adds and stores at the same time.',
    explanation:
      'gold += 5 is a shortcut for gold = gold + 5. It adds 5 to 10 and stores 15 back in gold.',
  },
  l3c3: {
    ...reward,
    id: 'l3c3',
    levelId: 3,
    type: 'debug',
    title: 'The Broken Scale',
    prompt: 'Find the mistake in this code.',
    buggyCode: 'let coins = 10;\n\nif (coins = 10) {\n  console.log("Ten coins");\n}',
    options: [
      'Use === to compare. A single = assigns a value instead.',
      'The variable name coins must be uppercase.',
      'console.log needs a comma after it.',
      '10 should be written as a string.',
    ],
    correctIndex: 0,
    fixedCode: 'let coins = 10;\n\nif (coins === 10) {\n  console.log("Ten coins");\n}',
    hint: 'Look closely at the condition inside the if parentheses.',
    explanation:
      'A single = assigns a value, so the condition always becomes 10 (truthy). Use === to compare two values.',
  },

  l4c1: {
    ...reward,
    id: 'l4c1',
    levelId: 4,
    type: 'mcq',
    title: 'Guard the Gate',
    prompt: 'Which condition is true when age is 18 or older?',
    options: ['age > 18', 'age >= 18', 'age <= 18', 'age = 18'],
    correctIndex: 1,
    hint: 'You want to include exactly 18, not just numbers above it.',
    explanation:
      'age >= 18 means "greater than or equal to 18", so it is true at 18 and above. age > 18 would be false at exactly 18.',
  },
  l4c2: {
    ...reward,
    id: 'l4c2',
    levelId: 4,
    type: 'complete',
    title: 'Sound the Horn',
    prompt: 'Complete the condition so the soldier wins when score is greater than 50.',
    template:
      'let score = 75;\n\nif (score [[0]] 50) {\n  console.log("You win!");\n} else {\n  console.log("Try again");\n}',
    blanks: [{ answers: ['>'], placeholder: '?', width: '4ch' }],
    hint: 'Use the symbol for "greater than".',
    explanation:
      'score > 50 is true for 75, so the if block runs and prints "You win!". The else block runs only when the condition is false.',
  },
  l4c3: {
    ...reward,
    id: 'l4c3',
    levelId: 4,
    type: 'arrange',
    title: 'Light the Torch',
    prompt: 'Arrange the if/else blocks in the correct order.',
    blocks: [
      { id: 'a', code: 'if (torchLit) {' },
      { id: 'b', code: '  console.log("The path is bright");' },
      { id: 'c', code: '} else {' },
      { id: 'd', code: '  console.log("It is dark");' },
      { id: 'e', code: '}' },
    ],
    correctOrder: ['a', 'b', 'c', 'd', 'e'],
    hint: 'The if block comes first, then else, and every { needs a closing }.',
    explanation:
      'An if block runs first when its condition is true. The else block follows and runs when the condition is false. Both blocks need their closing braces.',
  },

  l5c1: {
    ...reward,
    id: 'l5c1',
    levelId: 5,
    type: 'mcq',
    title: 'Count the Hammers',
    prompt: 'How many times does the body of this loop run?',
    code: 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}',
    options: ['2 times', '3 times', '4 times', 'Forever'],
    correctIndex: 1,
    hint: 'The loop runs for i = 0, 1 and 2. Count those values.',
    explanation:
      'i starts at 0 and runs while i < 3: that gives i = 0, 1, 2. So the body runs 3 times.',
  },
  l5c2: {
    ...reward,
    id: 'l5c2',
    levelId: 5,
    type: 'complete',
    title: 'Lay the Foundations',
    prompt: 'Complete the for loop so it repeats while i is less than 5.',
    template:
      'for (let i = 0; i [[0]] 5; i++) {\n  console.log("Building house " + i);\n}',
    blanks: [{ answers: ['<'], placeholder: '?', width: '4ch' }],
    hint: 'You want the loop to keep going while i is smaller than 5.',
    explanation:
      'The condition i < 5 keeps the loop running for i = 0, 1, 2, 3 and 4. When i becomes 5, the loop stops.',
  },
  l5c3: {
    ...reward,
    id: 'l5c3',
    levelId: 5,
    type: 'arrange',
    title: 'The Endless Watch',
    prompt: 'Arrange the while loop so it counts from 1 to 3.',
    blocks: [
      { id: 'a', code: 'let count = 1;' },
      { id: 'b', code: 'while (count <= 3) {' },
      { id: 'c', code: '  console.log(count);' },
      { id: 'd', code: '  count++;' },
      { id: 'e', code: '}' },
    ],
    correctOrder: ['a', 'b', 'c', 'd', 'e'],
    hint: 'Set up the counter, open the loop, print, increase, then close.',
    explanation:
      'The counter starts at 1. While it is 3 or less we print it and increase it. count++ is essential, otherwise the loop never ends.',
  },

  l6c1: {
    ...reward,
    id: 'l6c1',
    levelId: 6,
    type: 'mcq',
    title: 'The Silent Spell',
    prompt: 'What does a function return if it has no return statement?',
    options: ['null', '0', 'undefined', 'An error'],
    correctIndex: 2,
    hint: 'JavaScript gives back a special value when nothing is returned.',
    explanation:
      'When a function does not return a value, it returns undefined. It does not throw an error.',
  },
  l6c2: {
    ...reward,
    id: 'l6c2',
    levelId: 6,
    type: 'complete',
    title: 'Greet the Traveler',
    prompt: 'Complete the function so it returns "Hello, Aria".',
    template:
      'function greet(name) {\n  return "Hello, " [[0]] name;\n}\n\nconsole.log(greet("Aria")); // Hello, Aria',
    blanks: [{ answers: ['+'], placeholder: '?', width: '4ch' }],
    hint: 'Join two strings together with the plus operator.',
    explanation:
      'The + operator joins strings together. "Hello, " + "Aria" becomes "Hello, Aria".',
  },
  l6c3: {
    ...reward,
    id: 'l6c3',
    levelId: 6,
    type: 'complete',
    title: 'The Doubling Spell',
    prompt:
      'Write a function called double that takes a number and returns it multiplied by 2.',
    starterCode: 'function double(number) {\n  // your code here\n}',
    tests: [
      { expr: 'double(2)', expected: 4 },
      { expr: 'double(10)', expected: 20 },
      { expr: 'double(0)', expected: 0 },
    ],
    solution: 'function double(number) {\n  return number * 2;\n}',
    hint: 'Inside the function, return number * 2.',
    explanation:
      'return number * 2 sends the doubled value back to whoever called the function. Without return, the result would be undefined.',
  },

  l7c1: {
    ...reward,
    id: 'l7c1',
    levelId: 7,
    type: 'mcq',
    title: 'First in the Sack',
    prompt: 'What is the index of "sword" in this array?',
    code: 'const items = ["sword", "shield", "potion"];',
    options: ['1', '0', '3', '"sword"'],
    correctIndex: 1,
    hint: 'JavaScript counts array positions starting from zero.',
    explanation:
      'Arrays start counting at index 0. "sword" is the first item, so its index is 0.',
  },
  l7c2: {
    ...reward,
    id: 'l7c2',
    levelId: 7,
    type: 'complete',
    title: 'Fetch the First Hero',
    prompt: 'Complete the code so firstHero holds "Aria".',
    template:
      'let heroes = ["Aria", "Bran", "Cora"];\nlet firstHero = heroes[[0]];\nconsole.log(firstHero); // Aria',
    blanks: [{ answers: ['[0]'], placeholder: 'index', width: '5ch' }],
    hint: 'The first item lives at index 0. Wrap the number in square brackets.',
    explanation:
      'heroes[0] reads the item at index 0, which is "Aria". The brackets are required to access an array item.',
  },
  l7c3: {
    ...reward,
    id: 'l7c3',
    levelId: 7,
    type: 'mcq',
    title: 'Stock the Shelves',
    prompt: 'Which method adds a new item to the end of an array?',
    options: ['push()', 'pop()', 'shift()', 'length()'],
    correctIndex: 0,
    hint: 'Think of pushing something onto the end of a stack.',
    explanation:
      'push() adds an item to the end. pop() removes the last item, shift() removes the first, and length is a property, not a method.',
  },

  l8c1: {
    ...reward,
    id: 'l8c1',
    levelId: 8,
    type: 'mcq',
    title: 'Read the Hero Scroll',
    prompt: 'Given the object below, how do you read the name property?',
    code: 'const hero = { name: "Aria", power: 50 };',
    options: ['hero.name', 'hero->name', 'hero(name)', 'name.hero'],
    correctIndex: 0,
    hint: 'Use a dot between the object name and the property name.',
    explanation:
      'Dot notation hero.name reads the value stored under the name key, which is "Aria".',
  },
  l8c2: {
    ...reward,
    id: 'l8c2',
    levelId: 8,
    type: 'complete',
    title: 'Open the Gate Record',
    prompt: 'Complete the code so it prints "Aria".',
    template:
      'let hero = { name: "Aria", power: 50 };\nconsole.log(hero[[0]]); // Aria',
    blanks: [
      {
        answers: ['.name', "['name']", '["name"]'],
        placeholder: 'property',
        width: '8ch',
      },
    ],
    hint: 'Dot notation is the simplest way to read an object property.',
    explanation:
      'hero.name reads the name property. You can also use hero["name"] with brackets and a string key.',
  },
  l8c3: {
    ...reward,
    id: 'l8c3',
    levelId: 8,
    type: 'debug',
    title: 'Cracks in the Bridge',
    prompt: 'Find the mistake in this object.',
    buggyCode:
      'let castle = {\n  name: "Gold Keep"\n  towers: 4\n};\n\nconsole.log(castle.name);',
    options: [
      'The properties need commas between them.',
      'Objects cannot contain strings.',
      'console.log cannot print object properties.',
      'The object must be declared with const.',
    ],
    correctIndex: 0,
    fixedCode:
      'let castle = {\n  name: "Gold Keep",\n  towers: 4\n};\n\nconsole.log(castle.name);',
    hint: 'Look at the end of the line with "Gold Keep".',
    explanation:
      'Each property inside an object must be separated by a comma. Without the comma, JavaScript does not know where one property ends.',
  },

  l9c1: {
    ...reward,
    id: 'l9c1',
    levelId: 9,
    type: 'debug',
    title: 'The Broken Wall',
    prompt: 'Find the syntax error in this guard function.',
    buggyCode: 'function guard() {\n  console.log("Halt!");\n',
    options: [
      'The function is missing its closing curly brace }.',
      'console.log must be written as Console.log.',
      'The string "Halt!" needs single quotes.',
      'Functions must always return a value.',
    ],
    correctIndex: 0,
    fixedCode: 'function guard() {\n  console.log("Halt!");\n}',
    hint: 'Count the opening and closing braces.',
    explanation:
      'Every { needs a matching }. The function opens with { but never closes, so JavaScript reports a syntax error.',
  },
  l9c2: {
    ...reward,
    id: 'l9c2',
    levelId: 9,
    type: 'debug',
    title: 'The False Alarm',
    prompt: 'This code runs, but the check is wrong. Find the logical error.',
    buggyCode: 'let arrows = 0;\n\nif (arrows = 5) {\n  console.log("Quiver full");\n}',
    options: [
      'Use === to compare. = assigns the value 5 to arrows.',
      'arrows should be declared with const.',
      'The number 5 must be a string.',
      'if statements cannot contain numbers.',
    ],
    correctIndex: 0,
    fixedCode: 'let arrows = 0;\n\nif (arrows === 5) {\n  console.log("Quiver full");\n}',
    hint: 'A comparison needs three equals signs.',
    explanation:
      'The single = assigns 5 to arrows, and the assigned value is truthy, so the message always prints. Use === to compare.',
  },
  l9c3: {
    ...reward,
    id: 'l9c3',
    levelId: 9,
    type: 'mcq',
    title: 'Signal the Alarm',
    prompt: 'Which console method is best for reporting an error message?',
    options: ['console.log()', 'console.error()', 'console.clear()', 'console.table()'],
    correctIndex: 1,
    hint: 'The method name literally says what it is for.',
    explanation:
      'console.error() prints a message as an error, which makes problems easier to spot in the developer console.',
  },

  l10c1: {
    ...reward,
    id: 'l10c1',
    levelId: 10,
    type: 'mcq',
    title: 'The Royal Ledger',
    prompt: 'What does console.log("5" + 3) print?',
    code: 'console.log("5" + 3);',
    options: ['8', '"53"', '53', 'An error'],
    correctIndex: 1,
    hint: 'One value is a string. The + operator joins strings instead of adding.',
    explanation:
      'When one side of + is a string, JavaScript joins the values as text. "5" + 3 becomes the string "53", not the number 8.',
  },
  l10c2: {
    ...reward,
    id: 'l10c2',
    levelId: 10,
    type: 'complete',
    title: 'The Final Treasury',
    prompt:
      'Write a function called sumArray that returns the sum of all numbers in an array.',
    starterCode:
      'function sumArray(numbers) {\n  let total = 0;\n  // loop through numbers and add each one\n  return total;\n}',
    tests: [
      { expr: 'sumArray([1, 2, 3])', expected: 6 },
      { expr: 'sumArray([])', expected: 0 },
      { expr: 'sumArray([10, -2])', expected: 8 },
    ],
    solution:
      'function sumArray(numbers) {\n  let total = 0;\n  for (const number of numbers) {\n    total += number;\n  }\n  return total;\n}',
    hint: 'Use a for...of loop, add each number to total, then return total.',
    explanation:
      'Start total at 0. Loop through every number and add it with +=. Return total after the loop. An empty array correctly returns 0.',
  },
  l10c3: {
    ...reward,
    id: 'l10c3',
    levelId: 10,
    type: 'arrange',
    title: 'The Coronation',
    prompt: 'Arrange the final program so it prints the treasure total, 6.',
    blocks: [
      { id: 'a', code: 'let treasure = 0;' },
      { id: 'b', code: 'for (let i = 1; i <= 3; i++) {' },
      { id: 'c', code: '  treasure += i;' },
      { id: 'd', code: '}' },
      { id: 'e', code: 'console.log(treasure); // 6' },
    ],
    correctOrder: ['a', 'b', 'c', 'd', 'e'],
    hint: 'Start the total, open the loop, add, close the loop, then print.',
    explanation:
      'The loop adds 1 + 2 + 3 into treasure, giving 6. The console.log runs after the loop has finished.',
  },
}

export function getChallengesForLevel(levelId) {
  const ids = {
    1: ['l1c1', 'l1c2', 'l1c3'],
    2: ['l2c1', 'l2c2', 'l2c3'],
    3: ['l3c1', 'l3c2', 'l3c3'],
    4: ['l4c1', 'l4c2', 'l4c3'],
    5: ['l5c1', 'l5c2', 'l5c3'],
    6: ['l6c1', 'l6c2', 'l6c3'],
    7: ['l7c1', 'l7c2', 'l7c3'],
    8: ['l8c1', 'l8c2', 'l8c3'],
    9: ['l9c1', 'l9c2', 'l9c3'],
    10: ['l10c1', 'l10c2', 'l10c3'],
  }
  return (ids[levelId] || []).map((id) => CHALLENGES[id])
}

export const TOTAL_CHALLENGES = Object.keys(CHALLENGES).length
