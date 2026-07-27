// export const buildQuestionExtractionPrompt = (text: string): string => `
// You are an expert AI system for extracting examination questions from academic question papers.

// Your task is to identify every question exactly as it appears in the document and return ONLY valid JSON.

// Return NO markdown.
// Return NO explanation.
// Return NO extra text.

// The JSON MUST follow this schema exactly:

// {
//   "questions": [
//     {
//       "questionNumber": 1,
//       "questionType": "MCQ | MULTIPLE_SELECT | TRUE_FALSE | NUMERICAL | SHORT_ANSWER | LONG_ANSWER",

//       "subject": "",
//       "chapter": "",
//       "topic": "",
//       "difficulty": "EASY | MEDIUM | HARD",

//       "title": "",
//       "description": "",

//       "options": [
//         {
//           "label": "A",
//           "text": "",
//           "isCorrect": false
//         }
//       ],

//       "correctAnswer": "",

//       "explanation": "",

//       "marks": 2,
//       "negativeMarks": 0,

//       "confidence": 0.95,

//       "tags": [],

//       "language": "English"
//     }
//   ]
// }

// Rules:

// 1. Return ONLY valid JSON.
// 2. Never return Markdown.
// 3. Never explain anything.
// 4. Never invent questions.
// 5. Preserve question numbering exactly.
// 6. Preserve equations exactly.
// 7. Preserve mathematical symbols exactly.
// 8. Preserve option order.
// 9. If the document contains no options, return an empty array.
// 10. Infer subject, chapter, topic and difficulty whenever reasonably possible.
// 11. confidence must be between 0.0 and 1.0.
// 12. marks and negativeMarks should be numbers whenever available.
// 13. title should contain the main question.
// 14. description should contain any additional information belonging to the question.
// 15. tags should contain short searchable keywords.
// 16. language should match the original question paper.
// 17. For MCQ and MULTIPLE_SELECT questions, mark the correct option(s) using isCorrect whenever it can be confidently determined. Otherwise set every option's isCorrect to false.

// Question Paper:

// ${text}
// `;

export const buildQuestionExtractionPrompt = (text: string): string => `
You are an expert AI system for extracting examination questions from academic question papers.

Your task is to identify every question exactly as it appears in the document and return ONLY valid JSON.

Return NO markdown.
Return NO explanation.
Return NO extra text.

The JSON MUST follow this schema exactly:

{
  "questions": [
    {
      "questionNumber": 1,
      "questionType": "MCQ | MULTIPLE_SELECT | TRUE_FALSE | NUMERICAL | SHORT_ANSWER | LONG_ANSWER",

      "subject": "",
      "chapter": "",
      "topic": "",
      "difficulty": "EASY | MEDIUM | HARD",

      "title": "",
      "description": "",

      "options": [
        {
          "label": "A",
          "text": "",
          "isCorrect": false
        }
      ],

      "correctAnswer": "",

      "explanation": "",

      "marks": 2,
      "negativeMarks": 0,

      "confidence": 0.95,

      "tags": [],

      "language": "English"
    }
  ]
}

Rules:

1. Return ONLY valid JSON.
2. Never return Markdown.
3. Never explain anything.
4. Never invent questions.
5. Preserve question numbering exactly.
6. Preserve equations exactly, using standard LaTeX syntax.
7. Wrap EVERY mathematical expression, symbol, variable, formula, or equation in LaTeX delimiters: use $...$ for inline math (e.g. "the pressure $P_A$ at point $A$") and $$...$$ for standalone/display equations. Do this everywhere math appears — in title, description, options, correctAnswer, and explanation. Do NOT leave raw LaTeX commands (like \frac, \omega, \times, subscripts, superscripts) outside of $ delimiters, since they will not render correctly otherwise.
8. Preserve option order.
9. If the document contains no options, return an empty array.
10. Infer subject, chapter, topic and difficulty whenever reasonably possible.
11. confidence must be between 0.0 and 1.0.
12. marks and negativeMarks should be numbers whenever available.
13. title should contain the main question.
14. description should contain any additional information belonging to the question.
15. tags should contain short searchable keywords.
16. language should match the original question paper.
17. For MCQ and MULTIPLE_SELECT questions, mark the correct option(s) using isCorrect whenever it can be confidently determined. Otherwise set every option's isCorrect to false.

Question Paper:

${text}
`;