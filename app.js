require('dotenv').load();
console.log('Global server started!');
// Base modules
import app, { fpath } from './server/app';
import express from 'express';
import unless from 'express-unless';


app.use(express.static(fpath.join(__dirname, '/client/build')));
app.get('*', (req, res) => {
    res.sendFile(fpath.join(__dirname+'/client/build/index.html'));
});