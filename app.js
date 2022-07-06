const express = require('express')
const bodyParser = require('body-parser')
const ejs = require("ejs");
const mongoose = require("mongoose")

const app = express()
const port = 3000

app.set('view engine', "ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use("/public", express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)


app.route("/articles")

   .get((req, res)=>{
    Article.find({}, function (err, docs) {
        if(err){
            res.send(err);
        }
        console.log(docs);
        res.send(docs)
    })
})
  .post((req, res) => {
    const manga = new Article({
        title: req.body.title,
        content: req.body.content
    })
    manga.save( (err) => {
        if(err){
            res.send("Successfully added new Article.")
        }
        else{
            res.send(err)
        }
    } )
})
.delete(function (req, res) { 
    Article.deleteMany((err)=> {  
        if(!err){
            res.send("Succesfully deleted all articles")
        }else{
            res.send(err);
        }
    });
 });








app.route("/articles/:articleTitle")

   .get((req,res)=>{
    
     Article.findOne({title: req.params.articleTitle}, (err,doc)=>{
    if(doc){
        res.send(doc)
    }else{
        res.send("No articles matching that title was found.")
    }
     });
    })

    .put((req, res)=>{
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title , content: req.body.content},
            {overwrite:true}, (err, results) => {
             if(!err){
                res.send("Successfully updated article.")
             }else{
                res.send(err)
            }
        });
    })

     .patch((req,res)=>{
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title},
            {$set: req.body}, (err) => {
             if(!err){
                res.send("Successfully updated article.")
             }
        });
     })
     .delete((req,res)=>{
        Article.deleteOne({title:req.params.articleTitle}, (err) => {
            if(!err){
                res.send("Successfully deleted article.")
            } else{
                res.send(err)
            }
        })
     });



app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
