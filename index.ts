import express, { Request, Response } from 'express';

const app = express();
const port = 4000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World 123');
});

app.listen(port, () => {
  console.log(`Website backend is running on port ${port}`);
});
