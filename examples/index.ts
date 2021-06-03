import express from 'express';
import asyncHandler from '../src';

const app = express();

function foo() {
  return new Promise((resolve) => setTimeout(resolve, 10));
}

app.get(
  '/',
  asyncHandler(async function (req, res) {
    await foo();
    res.send('ok');
  }),
);

app.listen(() => {
  console.log('application started.');
});
