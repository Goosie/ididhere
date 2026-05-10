import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { gansjeTippyHandler } from './routes/gansjeTippy';

const app = new Hono();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173').split(',');

app.use(
  '*',
  cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : allowedOrigins[0]),
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400,
  }),
);

app.post('/api/gansjeTippy', gansjeTippyHandler);

app.get('/health', (c) => c.json({ ok: true }));

const port = Number(process.env.PORT ?? 3000);
console.log(`GansjeTippy backend luistert op poort ${port} 🪿`);

export default {
  port,
  fetch: app.fetch,
};
