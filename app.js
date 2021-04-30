//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const mongoose = require('mongoose');
// const _  = require("lodash");

const app = express();

// app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title : {
    type: String,
    required : true,
  },
  content: {
    type: String,
    required: true,
  },
});

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
const Article = mongoose.model("Article", articleSchema);

//TODO
app.route("/articles")
.get((req, res)=>{
  Article.find({}, function(err, docs){
      if(!err){
        console.log(docs);
        res.send(docs);
      }
  });
})

.post((req, res)=>{

  const article = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  article.save((err)=>{
    if(!err){
      res.send("Die Informationen erfolgreich eingefügt.");
    }else{
      res.send(err);
    }
  });

})

.delete((req, res)=>{
  Article.deleteMany({}, (err)=>{
    if(!err){
      res.send("All articles deleted successfully.");
    }else {
      res.send(err);
    }

  });

});

//detailed modification............................

app.route("/articles/:title")

.get((req, res)=>{
  const s_title = req.params.title;

  Article.findOne({"title" : s_title}, function(err, doc){
      if(!err){
        console.log(doc);
        res.send(doc);
      }
  });

})

.put((req, res)=>{

  // console.log(req.body);

  Article.updateMany({title: req.params.title}, {title: req.body.title, content: req.body.content}, function(err){
  // Article.updateMany({title: req.params.title}, {$set: req.body}, function(err){
    if(!err)
      res.send("updated.");
    else
      res.send(err);
  });

})

.patch((req, res)=>{

  // console.log(req.body);

  Article.updateMany({title: req.params.title}, {$set: req.body}, function(err){
    if(!err)
      res.send("patched.");
    else
      res.send(err);
  });

})

.delete((req, res)=>{

  Article.deleteOne({title: req.params.title}, (err)=>{
    if(!err){
      res.send("article '"+req.params.title+"' deleted successfully.");
    }else {
      res.send(err);
    }

  });

});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
