import { prisma } from './prisma';
import nodemailer from 'nodemailer';
import express from 'express';

const app = express();
app.use(express.json());

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5e1ac7d987c837",
    pass: "dc1c3ecb6eb762"
  }
});

app.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body;
  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot
    },
  });

  await transport.sendMail({
    from: 'Equipe Feedget <oi@feedget.com>',
    to: 'Hugo Simões <hugo.lfs@hotmail.com>',
    subject: 'Novo feedback',
    html: [
      `<div style="font-family: sans-serif; font-size? 16px; color: #111">`,
      `<p>Tipo do feedback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`
    ].join('\n'),
  });
  return res.status(201).json({ data: feedback });
});

app.listen(3333, () => {
  console.log('HTTP server running!');
});