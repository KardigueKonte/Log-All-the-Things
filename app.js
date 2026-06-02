const express = require('express');
const fs = require('fs');// file sys module, reading files: fs.readFile(), writing files: fs.writeFile(), directory ops: fs.mkdir(),file info: fs.stat()
const app = express();

app.use((req, res, next) => {
// write your logging code here
const agent = req.headers['user-agent'].replace(/,/g, '');
const time = new Date().toISOString();
const method = req.method;
const resource = req.url;
const version = `HTTP/${req.httpVersion}`;
res.on('finish', () => {
const status = res.statusCode;
const logEntry = `${agent},${time},${method},${resource},${version},${status}`;
console.log(logEntry);
fs.appendFile('logs.csv', logEntry + '\n', (err) => {
    if (err) throw err;
});
});
next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
res.send('ok');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
fs.readFile('logs.csv', 'utf8', (err, data) => {
  if (err) throw err;
  const lines = data.trim().split('\n');
  const logs = lines.map(line => {
    const [Agent, Time, Method, Resource, Version, Status] = line.split(',');
    return { Agent, Time, Method, Resource, Version, Status };
  });
  res.json(logs);
});
});

module.exports = app;
