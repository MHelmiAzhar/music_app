import dotenv from 'dotenv';
import app from './server/index.js';

dotenv.config();

const host = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});
