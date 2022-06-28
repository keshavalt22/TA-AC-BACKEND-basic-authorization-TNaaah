var express = require('express');
var router = express.Router();
let Article = require('../models/articles');
let Comment = require('../models/comment');
var auth = require('../middlewares/auth');


/* GET article listing. */
router.get('/', function(req, res, next) {
    Article.find({}, (err, articles) => {
      if(err) return next(err);
      res.render('article', {articles: articles});
    })
});

router.get("/new", auth.loggedInUser,(req, res,next) => {
    res.render("addArticle");
  });

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    // Article.findById(id, (err, article) => {
      // if(err) return next(err);
      // res.render("articleDetails", {article});
    // })
    Article
      .findById(id)
      .populate('author', 'name email')
      .exec((err, article) => {
        if(err) return next(err);
        res.render("articleDetails", {article});
      })
});

router.use(auth.loggedInUser);



router.post("/", (req, res, next) => {
  req.body.author = req.user._id;
  Article.create(req.body, (err, createdArticle) => {
    if(err) return next(err);
    res.redirect('/articles');
  });
});

// router.get('/:id', (req, res, next) => {
//   let id = req.params.id;
//   Article.findById(id).populate('comments').exec((err, article) => {
//     if(err) return next(err);
//     res.render('articleDetails', {article})
//   })
// });

router.get("/:id/edit", (req, res, next) => {
  let id = req.params.id;
  Article
  .findById(id)
  .populate('author', '_id')
  .exec((err, article) => {
    if(req.user.id === article.author.id) {
      Article.findById(id, (err, article) => {
        if(err) return next(err);
        res.render('editarticleForm', {article: article});
      });
    } else {
      res.redirect("/articles");
    }
  })
});

router.post("/:id", (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
      if(err) return next(err);
      res.redirect('/articleDetails/' + id);
  })
})

router.get("/:id/delete", (req, res, next) => {
  let id = req.params.id;
  Article
  .findById(id)
  .populate('author', '_id')
  .exec((err, article) => {
    if(req.user.id === article.author.id) {
      Article.findByIdAndDelete(id, (err, article) => {
        if(err) return next(err);
        res.redirect("/articles");
      });
    } else {
      res.redirect("/articles");
    }
  })
})

router.get("/:id/likes", (req, res, next) => {
  let id = req.params.id;
  Article
  .findById(id)
  .populate('author', '_id')
  .exec((err, article) => {
    if(req.user.id === article.author.id) {
      Article.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, article) => {
        if(err) return next(err);
        res.redirect("/articles/" + id)
      })
    } else {
      res.redirect("/articles");
    }
  })
})

router.get("/:id/dislikes", (req, res, next) => {
  let id = req.params.id;
  Article
  .findById(id)
  .populate('author', '_id')
  .exec((err, article) => {
    if(req.user.id === article.author.id) {
      Article.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, article) => {
        if(err) return next(err);
        res.redirect("/articles/" + id)
      })
    } else {
      res.redirect("/articles");
    }
  })
});

router.post("/:id/comments", (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if(err) return next(err);
    Article.findByIdAndUpdate(id, {$push: {comments: comment._id}}, (err, updatedArticle) => {
      if(err) return next(err);
      res.redirect("/articles/" + id)
    })
  })
})

module.exports = router;