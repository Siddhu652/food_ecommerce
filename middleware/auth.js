const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const app = express();
app.use(express.json());

