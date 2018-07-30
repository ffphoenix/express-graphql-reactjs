require('dotenv').load();
console.log(process.env);
// Base modules
import app, { fpath } from './server/app';
import express from 'express';

app.use(express.static(fpath.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
    res.sendFile(fpath.join(__dirname+'/client/build/index.html'));
});