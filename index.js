require('dotenv').config();
require('./configs/db.config');
require('./configs/passport.google');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const express = require('express');
const app = express();

const indexRoutes = require('./routes/index.route');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');

app.set('view engine', 'pug');
app.set('views', './views');

// middlewares
app.use(express.static('public'));
app.use(flash());
app.use(
	session({
		secret: process.env.SECRET_STRING_SESSION,
		resave: true,
		saveUninitialized: true,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000 * 3
		}
	})
);

app.use((req, res, next) => {
	res.locals.successMsg = req.flash('successMsg');
	res.locals.errorMsg = req.flash('errorMsg');
	next();
});

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));