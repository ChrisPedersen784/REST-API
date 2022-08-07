const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

////////////////////// REQUESTS TARGETTING ALL ARTICLES ///////////////////
app.route("/articles")

//HTTP GET REQUEST
.get(function(req, res){
  //find query to find all the articles inside the database
  Article.find({}, function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

//HTTP POST REQUEST
.post(function(req, res){
  //Use PostMan to see if the http request works
  // console.log(req.body.title);
  // console.log(req.body.content);

//here we can add it into our MongoDB using PostMan
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  // Save it into the database
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully rendered a new article to DB");
    } else {
      res.send(err);
    }
  });
})

//HTTP DELETE REQUEST
.delete(function(req, res){

  Article.deleteMany({}, function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    }
  });
});


////////////////////// REQUESTS TARGETTING A SPECIFIC ARTICLE ///////////////////

app.route("/articles/:articleTitle")

  .get(function(req, res){
    //Here we can target a specific article title with Route parameters
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
        console.log(req.body);
      } else {
        res.send("No articles matching the title");
      }
    });
  })
//HTTP PUT REQUEST
  .put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle}, //filter
    {title: req.body.title, content: req.body.content},//update
    function(err){ //callback
      if(!err){
        res.send("Success");
      }
    }
  );
  })

  .patch(function(req, res){
    Article.updateOne(
      {title: req.params.articleTitle}, //filter
      {$set: req.body},//will only replace the part where the user makes a change
      function(err){
        if(!err)
          res.send("Successfully updated article");
         else
          res.send(err);
        });
  })

  .delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
      if(!err){
        res.send("Successfully deleted article");
      }
    });
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
