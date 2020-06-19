const express = require('express');
const Article = require('./../models/article');
//create router to create views 
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() });
});
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', { article: new Article() });
});

router.get('/:slug', async (req, res) => {
    //access article
    const article = await Article.findOne({ slug: req.params.slug});
    //check if can find the article; if not, redirect user to homepage
    if (article == null) {
        res.redirect('/');
    }
    //render new page
    //res.status('/articles/show').send({ article: article });
    res.render('articles/show', { article: article });
});
router.post('/', async (req, res, next) => {
    req.article = new Article();
    //go to next function in list
    next();
}, saveArticleAndRedirect('new'));

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    //go to next function in list
    next();
}, saveArticleAndRedirect('edit'));

router.delete('/:id', async (req,res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
            //tell express how to access them - 
            article.title = req.body.title;
            article.description = req.body.description;
            article.markdown = req.body.markdown;
        try {
            //asynch function - if user is able to save
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        }catch (e) {
            //if there is an issue with the article saving, send an error to the user
            res.render(`articles/${path}`, { article: article });
        }
    }
}
//tell app to use the router
//read in the router whenever the file is required
module.exports = router;