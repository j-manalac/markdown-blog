const mongoose = require('mongoose');
//converts markdown to html
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require ('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHTML: {
        type: String,
        required: true
    }
});

articleSchema.pre('validate', function (next) {
    //create slug from title
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }
    if (this.markdown) {
        //convert markdown to sanitized html
        //get rid of any malicious code
        this.sanitizedHTML = dompurify.sanitize(marked(this.markdown));
    }
    next();
});

module.exports = mongoose.model('Article', articleSchema);