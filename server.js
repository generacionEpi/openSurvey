const express = require('express');
const cors = require('cors')
const app = express();
const uniqid = require('uniqid')
var bcrypt = require('bcrypt');
var MongoLogin = require('./db')
var GmailLogin = require('./email')
var http = require('http');
var https = require('https');
var nodemailer = require('nodemailer');

app.use(cors());
app.use(express.json());

var fs = require('fs');

//Load up certificates for SSL Encryption (To enable HTTPS)
/*
var privateKey = fs.readFileSync('/etc/letsencrypt/live/unime.io/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/unime.io/fullchain.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};*/

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const { text } = require('express');
var url = 'mongodb://'+MongoLogin.credentials.username+':'+MongoLogin.credentials.password+'@localhost:27017//?authSource=admin';
//var url = 'mongodb://leonardmelnik.com:27017/mydb';

//mongodb://216.250.126.175:27017,216.250.126.175:27018/mydb?replicaSet=rs0

const saltRounds = 10;
var salt = '$2b$10$X4kv7j5ZcG39WgogSl16au'

var transporter = nodemailer.createTransport({
    service: 'gmail',
    port : 465,
    secure : "true",
    auth: {
      user: GmailLogin.credentials.email,
      pass: GmailLogin.credentials.password
    }
  });
 
MongoClient.connect(url, function(err, db) {

    if (err) throw err;
    var dbo = db.db("openSurvey");

    console.log("Connected to database")
    app.use(async (req, res, next) =>{
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log(ip, req.path)
        next()
    })
    //dbo.collection("accounts").find({email : req.session.user.email}).toArray()

    app.get('/questions', async (req, res) => {
        if(req.headers.token){
            var results = await dbo.collection("accounts").find({token : req.headers.token}).toArray()
            if(results[0]){
                //Token has been confirmed
                var projection = {
                    _id : 0,
                    evalId: 1, 
                    name : 1,
                    dept : 1,
                    num : 1,
                    year : 1,
                    ["stats."+req.body.stats] : 1
                }
                console.log(projection)
                var evaluations = await dbo.collection("evaluations").find(req.body.search,{projection: projection}).toArray()
                console.log()
                res.send({status: true,
                data: evaluations
              });
            }else{
                res.send({status: false, message: "Token not authorized", token : req.headers.token});
            }
    
            
        }else{
            res.send({status: false, message: "No token provided"});
        }
      
      
    });
app.use('/getQuestions', async (req, res) => {
    var results = await dbo.collection("questions").find({}).toArray()

    res.send(results)
  
});
app.use('/deleteQuestion', async (req, res) => {
    var results = await dbo.collection("questions").deleteOne({id : req.body.id})

    res.send(results)
  
});
app.use('/getResults', async (req, res) => {
    var results = await dbo.collection("results").find({}).toArray()

    res.send(results)

});
app.post('/removeResult', async (req, res) => {
 
    var results = await dbo.collection("results").deleteOne({id : req.body.id})
    console.log("we got here")
    res.send(results)
    

  
});
app.post('/addResult', async (req, res) => {
    var newResult = req.body
    newResult.id = uniqid()
    var results = await dbo.collection("results").insertOne(newResult)
    console.log("we got here")
    res.send(results)
    

  
});
app.post('/setResultCondition', async (req, res) => {
    var newCondition = req.body.obj
    newCondition.id = uniqid()

    var results = await dbo.collection("results").updateOne({id:req.body.id},{ $push: { results: newCondition} })
    console.log("we got here")
    res.send(results)
    

  
});
app.post('/submitResults', async (req, res) => {
    var mailOptions = {
        from: 'leonardmelnik@gmail.com',
        to: req.body.email,
        subject: 'Your self assessment results',
        text: 'That was easy!'
      };
    delete req.body.email
    console.log("Submiting results")
    console.log(req.body)
    var IDSofOptions = Object.keys(req.body)
    for(i=0;i<Object.keys(req.body).length;i++){
        console.log("Pass", i)
        var results = await dbo.collection("results").find({id : IDSofOptions[i]}).toArray()
        thisOption = results[0]
        var textForThis = ''
        for(x=0;x<thisOption.results.length;x++){
            if( thisOption.results[x]['range0'] < parseFloat(req.body[IDSofOptions[i]]) &&   parseFloat(req.body[IDSofOptions[i]]) <= thisOption.results[x]['range1']){
                mailOptions.text = mailOptions.text + "\n" + thisOption.results[x].result
            }


        }

    }

    
   
    
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send({status : false, msg : "An error has occured"})

        } else {
            console.log("message sent")
          res.send({status : true, msg : "Results have been sent to your email"})

        }
      });
     
  
});

app.use('/login', async (req, res) => {
    if(req.body.username && req.body.password){
        var password = req.body.password
        if(req.body.username.indexOf(' ') > -1 || req.body.username.indexOf(' ')>req.body.username.length||password.indexOf(' ') > -1 || password.indexOf(' ')>password.length){
            res.send({status: false, message: "You cannot have spaces in your email or password"});
    
        }else{
            var email = req.body.username.toLowerCase()
            var passwordHashed = await bcrypt.hash(req.body.password, salt)
            var results = await dbo.collection("accounts").find({email : email, password : passwordHashed}).toArray()
         
            if(results[0]){
                var token = await bcrypt.hash(uniqid(), salt)
                dbo.collection("accounts").updateOne({email : email, password : passwordHashed},{$set : {token : token}})
                var searchData = await dbo.collection("searchData").find({})
        
                res.send(
                    {status: true,
                    token: token,
                    searchData : searchData[0]
                  });
            }else{
                res.send({status: false, message: "Incorrect Username or Password"});
            }
        }
       
    }
   
  
});

app.use('/register', async (req, res) => {
    var email = req.body.username.toLowerCase()
    var password = req.body.password
    if(email.indexOf(' ') > -1 || email.indexOf(' ')>email.length ||password.indexOf(' ') > -1 || password.indexOf(' ')>password.length){
        res.send({status: false, message: "You cannot have spaces in your email or password"});

    }else{
        var passwordHashed = await bcrypt.hash(req.body.password, salt)
        var results = await dbo.collection("accounts").find({email : email, password : passwordHashed}).toArray()
        if(!results[0]){
            var userObj = {
                email : email,
                password : passwordHashed,
                id : uniqid(),
                emailVerify : uniqid(),
                verified : false
            }
            dbo.collection("accounts").insertOne(userObj)
            res.send({status: true,
                msg: 'Account has been created, please log in'
              });
        }else{
            res.send({status: false, message: "Account already exists with email"});
        }
    }
  
  
});
app.use('/addQuestion', async (req, res) => {
    var question = req.body.question
    var notes = req.body.notes
    dbo.collection("questions").insertOne({question : question, notes : notes, id: uniqid()})  
    res.send(true)
});


  
  //var httpsServer = https.createServer(credentials, app);
  app.listen(8080)

})