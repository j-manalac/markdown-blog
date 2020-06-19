const express = require('express');
//connect to database
const mongoose = require('mongoose');
const Article = require('./models/article')
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const app = express();

mongoose.connect('mongodb://localhost/markdownblog', { 
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex: true });

//write all views using ejs
//convert ejs code to html
app.set('view engine', 'ejs');
//tell app to use the router
app.use(express.urlencoded({ extended: false}));
//use method override so can use delete route
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({date: 'desc'});
    res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);

app.listen(5000);