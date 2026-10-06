const express = require('express');
const cors = require('cors');

const usersRoutes = require('./routes/users');
const profileRoutes = require('./routes/profile');
const authenticationsRoutes = require('./routes/authentications');
const companiesRoutes = require('./routes/companies');
const categoriesRoutes = require('./routes/categories');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const bookmarksRoutes = require('./routes/bookmarks');

const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');

const documentsRoutes = require('./routes/documents');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/profile', profileRoutes);
app.use('/authentications', authenticationsRoutes);
app.use('/companies', companiesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/jobs', jobsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/bookmarks', bookmarksRoutes);


app.use('/documents', documentsRoutes);

// Harus PALING AKHIR
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;