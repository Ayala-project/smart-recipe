const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// נתיב לקבלת שאלה
app.get('/get_question', (req, res) => {
  const question = { question: 'What is your favorite color?', code: 123 };
  console.log('Sending question to client:', question);
  res.json(question);
});

// נתיב לקבלת שאלה חדשה
app.get('/get_question', (req, res) => {
  const question = { question: 'What is your favorite hobby?', code: 789 };
  console.log('Sending new question to client:', question);
  res.json(question);
});

// נתיב לקבלת מתכונים
app.get('/get_recipes', (req, res) => {
  const recipes = ['Recipe 1', 'Recipe 2', 'Recipe 3'];
  console.log('Sending recipes to client:', recipes);
  res.json(recipes);
});

// נתיב לשליחת תשובה
app.post('/submit_answer', (req, res) => {
  const { answer, code } = req.body;
  console.log('Received answer:', answer, 'for code:', code);

  if (answer === 'fetch') {
    // החזרת שאלה או מתכונים
    if (code === 123) {
      res.json({ question: 'What is your favorite color?' });
    } else {
      res.json({ recipes: ['Recipe 1', 'Recipe 2', 'Recipe 3'] });
    }
  } else {
    // טיפול בתשובה שנשלחה
    console.log('Answer submitted successfully.');
    res.json({ success: true });
  }
});

// נתיב לשליחת תמונה
app.post('/get_similar_images', (req, res) => {
  console.log('Received image for processing');
  const result = {
    question: 'What is your favorite food?',
    code: 456,
  };
  res.json({ result });
});

// הפעלת השרת
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
