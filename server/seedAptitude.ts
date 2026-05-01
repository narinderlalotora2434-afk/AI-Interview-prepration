// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const realQuestions = [
  // --- Quantitative Aptitude (10 Questions) ---
  {
    category: "Quantitative Aptitude",
    difficulty: "Beginner",
    topic: "Time and Work",
    type: "MCQ",
    questionText: "A can do a piece of work in 10 days, and B can do it in 15 days. How long will they take if both work together?",
    options: JSON.stringify(["5 days", "6 days", "8 days", "9 days"]),
    correctAnswer: "6 days",
    explanation: "A's 1 day work = 1/10, B's 1 day work = 1/15. Together = 1/10 + 1/15 = 5/30 = 1/6. So, 6 days."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Intermediate",
    topic: "Percentage",
    type: "MCQ",
    questionText: "If 20% of a number is 120, what is 120% of that number?",
    options: JSON.stringify(["480", "720", "360", "600"]),
    correctAnswer: "720",
    explanation: "If 20% = 120, then 100% = 600. 120% of 600 = 720."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Advanced",
    topic: "Profit and Loss",
    type: "MCQ",
    questionText: "A man buys a cycle for Rs. 1400 and sells it at a loss of 15%. What is the selling price of the cycle?",
    options: JSON.stringify(["Rs. 1090", "Rs. 1160", "Rs. 1190", "Rs. 1202"]),
    correctAnswer: "Rs. 1190",
    explanation: "S.P. = 85% of 1400 = 0.85 * 1400 = 1190."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Beginner",
    topic: "Average",
    type: "MCQ",
    questionText: "The average of first five multiples of 3 is:",
    options: JSON.stringify(["3", "9", "12", "15"]),
    correctAnswer: "9",
    explanation: "Multiples are 3, 6, 9, 12, 15. Sum = 45. Average = 45/5 = 9."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Intermediate",
    topic: "Ratio",
    type: "MCQ",
    questionText: "If A:B = 2:3 and B:C = 4:5, then A:B:C is:",
    options: JSON.stringify(["8:12:15", "2:3:5", "8:10:15", "4:6:10"]),
    correctAnswer: "8:12:15",
    explanation: "Multiply first ratio by 4 and second by 3 to make B same. A:B = 8:12, B:C = 12:15. So 8:12:15."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Advanced",
    topic: "Probability",
    type: "MCQ",
    questionText: "Two dice are thrown simultaneously. What is the probability of getting a sum of 7?",
    options: JSON.stringify(["1/6", "5/36", "1/12", "7/36"]),
    correctAnswer: "1/6",
    explanation: "Total outcomes = 36. Sum of 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes. Probability = 6/36 = 1/6."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Beginner",
    topic: "Simple Interest",
    type: "MCQ",
    questionText: "Find the simple interest on Rs. 5000 at 10% per annum for 2 years.",
    options: JSON.stringify(["Rs. 500", "Rs. 800", "Rs. 1000", "Rs. 1200"]),
    correctAnswer: "Rs. 1000",
    explanation: "S.I. = (P * R * T) / 100 = (5000 * 10 * 2) / 100 = 1000."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Intermediate",
    topic: "Ages",
    type: "MCQ",
    questionText: "The sum of the ages of a father and his son is 45 years. Five years ago, the product of their ages was 34. The father's age is:",
    options: JSON.stringify(["35 years", "36 years", "39 years", "40 years"]),
    correctAnswer: "36 years",
    explanation: "Let ages be x and 45-x. (x-5)(45-x-5) = 34 => (x-5)(40-x) = 34. x=36 or x=9. Father is 36."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Beginner",
    topic: "Profit and Loss",
    type: "MCQ",
    questionText: "If cost price is $120 and selling price is $150, what is the profit %?",
    options: JSON.stringify(["20%", "25%", "30%", "15%"]),
    correctAnswer: "25%",
    explanation: "Profit = 30. Profit % = (30/120)*100 = 25%."
  },
  {
    category: "Quantitative Aptitude",
    difficulty: "Intermediate",
    topic: "Time and Distance",
    type: "MCQ",
    questionText: "A train 120m long crosses a pole in 8 sec. What is its speed?",
    options: JSON.stringify(["15 m/s", "12 m/s", "10 m/s", "20 m/s"]),
    correctAnswer: "15 m/s",
    explanation: "Speed = Distance / Time = 120 / 8 = 15 m/s."
  },

  // --- Logical Reasoning (10 Questions) ---
  {
    category: "Logical Reasoning",
    difficulty: "Beginner",
    topic: "Number Series",
    type: "MCQ",
    questionText: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
    options: JSON.stringify(["(1/3)", "(1/8)", "(2/8)", "(1/16)"]),
    correctAnswer: "(1/8)",
    explanation: "Each number is half of the previous one."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Intermediate",
    topic: "Coding-Decoding",
    type: "MCQ",
    questionText: "If 'TIGER' is coded as 'SUHDS', how is 'HORSE' coded?",
    options: JSON.stringify(["GNQRB", "GNQRD", "GNRQD", "GQNRD"]),
    correctAnswer: "GNQRD",
    explanation: "Each letter is replaced by its preceding letter."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Advanced",
    topic: "Syllogism",
    type: "MCQ",
    questionText: "Statements: All bags are pockets. All pockets are pouches. Conclusions: I. All bags are pouches. II. Some pouches are bags.",
    options: JSON.stringify(["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"]),
    correctAnswer: "Both I and II follow",
    explanation: "Direct logical deduction from statements."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Beginner",
    topic: "Analogy",
    type: "MCQ",
    questionText: "Odometer is to mileage as compass is to:",
    options: JSON.stringify(["Speed", "Hiking", "Needle", "Direction"]),
    correctAnswer: "Direction",
    explanation: "Compass measures direction."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Beginner",
    topic: "Blood Relations",
    type: "MCQ",
    questionText: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
    options: JSON.stringify(["His own", "His son's", "His father's", "His nephew's"]),
    correctAnswer: "His son's",
    explanation: "The man in the photo is his son."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Intermediate",
    topic: "Direction Sense",
    type: "MCQ",
    questionText: "A person walks 3km north, then 4km east. How far from start?",
    options: JSON.stringify(["5 km", "7 km", "1 km", "4 km"]),
    correctAnswer: "5 km",
    explanation: "Pythagorean theorem: 3, 4, 5."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Advanced",
    topic: "Seating Arrangement",
    type: "MCQ",
    questionText: "A is next to B, C is next to D. A and C are at ends. Who is next to C?",
    options: JSON.stringify(["B", "D", "E", "None"]),
    correctAnswer: "D",
    explanation: "Logic dictates D must be next to C."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Beginner",
    topic: "Classification",
    type: "MCQ",
    questionText: "Odd one out: Snake, Lizard, Crocodile, Whale",
    options: JSON.stringify(["Snake", "Lizard", "Crocodile", "Whale"]),
    correctAnswer: "Whale",
    explanation: "Whale is a mammal, others are reptiles."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Intermediate",
    topic: "Calendar",
    type: "MCQ",
    questionText: "If Jan 1, 2001 was Monday, what was Jan 1, 2002?",
    options: JSON.stringify(["Tuesday", "Wednesday", "Thursday", "Friday"]),
    correctAnswer: "Tuesday",
    explanation: "Non-leap year has 1 odd day."
  },
  {
    category: "Logical Reasoning",
    difficulty: "Advanced",
    topic: "Clocks",
    type: "MCQ",
    questionText: "Angle between hands at 5:15?",
    options: JSON.stringify(["52.5°", "67.5°", "72.5°", "64°"]),
    correctAnswer: "67.5°",
    explanation: "|30(5) - 5.5(15)| = 67.5."
  },

  // --- Verbal Ability (10 Questions) ---
  {
    category: "Verbal Ability",
    difficulty: "Beginner",
    topic: "Synonyms",
    type: "MCQ",
    questionText: "Synonym of 'ABANDON':",
    options: JSON.stringify(["Forsake", "Keep", "Cherish", "Enforce"]),
    correctAnswer: "Forsake",
    explanation: "To abandon is to forsake."
  },
  {
    category: "Verbal Ability",
    difficulty: "Intermediate",
    topic: "Grammar",
    type: "MCQ",
    questionText: "Error: 'Neither of the two candidates are qualified.'",
    options: JSON.stringify(["Neither", "two candidates", "are", "qualified"]),
    correctAnswer: "are",
    explanation: "Should be 'is' for singular 'Neither'."
  },
  {
    category: "Verbal Ability",
    difficulty: "Advanced",
    topic: "Idioms",
    type: "MCQ",
    questionText: "Meaning of 'To burn the candle at both ends'?",
    options: JSON.stringify(["To work very hard", "To be extravagant", "To be rich", "To be poor"]),
    correctAnswer: "To work very hard",
    explanation: "Working very late and early."
  },
  {
    category: "Verbal Ability",
    difficulty: "Beginner",
    topic: "Antonyms",
    type: "MCQ",
    questionText: "Opposite of 'ENORMOUS':",
    options: JSON.stringify(["Tiny", "Huge", "Soft", "Average"]),
    correctAnswer: "Tiny",
    explanation: "Tiny is opposite of enormous."
  },
  {
    category: "Verbal Ability",
    difficulty: "Intermediate",
    topic: "Sentence Completion",
    type: "MCQ",
    questionText: "He is so _______ that he believes everything.",
    options: JSON.stringify(["Gullible", "Innocent", "Ignorant", "Stupid"]),
    correctAnswer: "Gullible",
    explanation: "Gullible people are easily fooled."
  },
  {
    category: "Verbal Ability",
    difficulty: "Advanced",
    topic: "Reading Comprehension",
    type: "MCQ",
    questionText: "Tone of 'alarming', 'critical', 'devastating'?",
    options: JSON.stringify(["Optimistic", "Pessimistic", "Objective", "Urgent"]),
    correctAnswer: "Urgent",
    explanation: "Suggests immediate concern."
  },
  {
    category: "Verbal Ability",
    difficulty: "Beginner",
    topic: "Spelling",
    type: "MCQ",
    questionText: "Correct spelling:",
    options: JSON.stringify(["Accommodate", "Acomodate", "Accomodate", "Acommodate"]),
    correctAnswer: "Accommodate",
    explanation: "Double 'c' and double 'm'."
  },
  {
    category: "Verbal Ability",
    difficulty: "Intermediate",
    topic: "Active/Passive",
    type: "MCQ",
    questionText: "Passive: 'The committee is reviewing the report.'",
    options: JSON.stringify(["The report is being reviewed.", "The report was reviewed.", "The report is reviewed.", "The report will be reviewed."]),
    correctAnswer: "The report is being reviewed.",
    explanation: "Present continuous becomes 'is being + V3'."
  },
  {
    category: "Verbal Ability",
    difficulty: "Advanced",
    topic: "One Word",
    type: "MCQ",
    questionText: "Person who hates mankind:",
    options: JSON.stringify(["Misanthrope", "Philanthropist", "Misogynist", "Misogamist"]),
    correctAnswer: "Misanthrope",
    explanation: "Misanthrope = Hater of humans."
  },
  {
    category: "Verbal Ability",
    difficulty: "Beginner",
    topic: "Synonyms",
    type: "MCQ",
    questionText: "Synonym of 'GENUINE':",
    options: JSON.stringify(["Authentic", "Fake", "Hidden", "Common"]),
    correctAnswer: "Authentic",
    explanation: "Genuine = Authentic."
  },

  // --- Data Interpretation (10 Questions) ---
  {
    category: "Data Interpretation",
    difficulty: "Beginner",
    topic: "Pie Charts",
    type: "MCQ",
    questionText: "Food is 90° in pie chart. What % is it?",
    options: JSON.stringify(["20%", "25%", "30%", "15%"]),
    correctAnswer: "25%",
    explanation: "90/360 * 100 = 25%."
  },
  {
    category: "Data Interpretation",
    difficulty: "Intermediate",
    topic: "Bar Graphs",
    type: "MCQ",
    questionText: "50 tons in 2020, 60 tons in 2021. % increase?",
    options: JSON.stringify(["10%", "20%", "25%", "15%"]),
    correctAnswer: "20%",
    explanation: "10/50 * 100 = 20%."
  },
  {
    category: "Data Interpretation",
    difficulty: "Advanced",
    topic: "Line Graphs",
    type: "MCQ",
    questionText: "Highest ratio: 1.2, 0.8, 1.5, 1.1?",
    options: JSON.stringify(["2018", "2019", "2020", "2021"]),
    correctAnswer: "2020",
    explanation: "1.5 is the highest."
  },
  {
    category: "Data Interpretation",
    difficulty: "Beginner",
    topic: "Averages",
    type: "MCQ",
    questionText: "Average of 40, 50, 60, 70, 80?",
    options: JSON.stringify(["50", "60", "70", "65"]),
    correctAnswer: "60",
    explanation: "Sum=300, 300/5=60."
  },
  {
    category: "Data Interpretation",
    difficulty: "Intermediate",
    topic: "Mixed Graphs",
    type: "MCQ",
    questionText: "Sales $1000, margin 10%. Profit?",
    options: JSON.stringify(["$10", "$100", "$50", "$200"]),
    correctAnswer: "$100",
    explanation: "10% of 1000 = 100."
  },
  {
    category: "Data Interpretation",
    difficulty: "Advanced",
    topic: "Data Sufficiency",
    type: "MCQ",
    questionText: "Value of n? (1) n is prime. (2) n is even.",
    options: JSON.stringify(["1 suff", "2 suff", "Both suff", "Neither suff"]),
    correctAnswer: "Both suff",
    explanation: "Only 2 is both even and prime."
  },
  {
    category: "Data Interpretation",
    difficulty: "Beginner",
    topic: "Tables",
    type: "MCQ",
    questionText: "Scores 80, 90, 100. Average?",
    options: JSON.stringify(["85", "90", "95", "80"]),
    correctAnswer: "90",
    explanation: "Average is 90."
  },
  {
    category: "Data Interpretation",
    difficulty: "Intermediate",
    topic: "Percentages",
    type: "MCQ",
    questionText: "15% is 75. Total?",
    options: JSON.stringify(["400", "500", "600", "750"]),
    correctAnswer: "500",
    explanation: "75/0.15 = 500."
  },
  {
    category: "Data Interpretation",
    difficulty: "Advanced",
    topic: "Ratios",
    type: "MCQ",
    questionText: "Ratio 3:2. Boys 300. Girls?",
    options: JSON.stringify(["100", "150", "200", "250"]),
    correctAnswer: "200",
    explanation: "3x=300, 2x=200."
  },
  {
    category: "Data Interpretation",
    difficulty: "Beginner",
    topic: "Basic Math",
    type: "MCQ",
    questionText: "5 apples $10. 12 apples?",
    options: JSON.stringify(["$20", "$24", "$22", "$25"]),
    correctAnswer: "$24",
    explanation: "$2 per apple."
  },

  // --- Coding Aptitude (10 Questions) ---
  {
    category: "Coding Aptitude",
    difficulty: "Intermediate",
    topic: "Bitwise",
    type: "MCQ",
    questionText: "Value of 5 & 3?",
    options: JSON.stringify(["1", "2", "3", "7"]),
    correctAnswer: "1",
    explanation: "101 & 011 = 001."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Beginner",
    topic: "Variables",
    type: "MCQ",
    questionText: "Valid variable name?",
    options: JSON.stringify(["2var", "var_name", "var-name", "var name"]),
    correctAnswer: "var_name",
    explanation: "Underscores are allowed."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Advanced",
    topic: "Time Complexity",
    type: "MCQ",
    questionText: "Complexity of Binary Search?",
    options: JSON.stringify(["O(n)", "O(n^2)", "O(log n)", "O(1)"]),
    correctAnswer: "O(log n)",
    explanation: "Binary search is log n."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Intermediate",
    topic: "Arrays",
    type: "MCQ",
    questionText: "Index of last element of size N?",
    options: JSON.stringify(["N", "N-1", "N+1", "1"]),
    correctAnswer: "N-1",
    explanation: "Zero-indexed."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Advanced",
    topic: "Stacks",
    type: "MCQ",
    questionText: "Stack principle?",
    options: JSON.stringify(["FIFO", "LIFO", "FILO", "None"]),
    correctAnswer: "LIFO",
    explanation: "Last-In First-Out."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Beginner",
    topic: "Booleans",
    type: "MCQ",
    questionText: "(true || false) && false?",
    options: JSON.stringify(["true", "false", "Error", "Undef"]),
    correctAnswer: "false",
    explanation: "Result is false."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Intermediate",
    topic: "Strings",
    type: "MCQ",
    questionText: "Length of 'hello'?",
    options: JSON.stringify(["4", "5", "6", "0"]),
    correctAnswer: "5",
    explanation: "5 characters."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Advanced",
    topic: "Queues",
    type: "MCQ",
    questionText: "Queue principle?",
    options: JSON.stringify(["FIFO", "LIFO", "FILO", "None"]),
    correctAnswer: "FIFO",
    explanation: "First-In First-Out."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Beginner",
    topic: "Data Types",
    type: "MCQ",
    questionText: "NOT a primitive?",
    options: JSON.stringify(["int", "float", "string", "array"]),
    correctAnswer: "array",
    explanation: "Array is an object."
  },
  {
    category: "Coding Aptitude",
    difficulty: "Intermediate",
    topic: "Inheritance",
    type: "MCQ",
    questionText: "Class deriving from another?",
    options: JSON.stringify(["Encaps", "Poly", "Inherit", "Abstr"]),
    correctAnswer: "Inheritance",
    explanation: "Inheritance is the term."
  }
];

async function seed() {
  console.log("Clearing old aptitude questions...");
  await prisma.aptitudeQuestion.deleteMany();
  
  console.log("Seeding high-quality aptitude questions...");
  let count = 0;
  for (const q of realQuestions) {
    await prisma.aptitudeQuestion.create({ data: q });
    count++;
  }
  
  console.log(`Seeding complete. Added ${count} questions to the database.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
