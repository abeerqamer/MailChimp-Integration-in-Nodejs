const express = require('express');
const bodyParser = require('body-parser');
const request  = require('request');
const morgan  = require('morgan');
const async   = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');



const app = express();

app.engine('.hbs',expressHbs({defaultLayout: 'layout',extname: '.hbs'}));
app.set('view engine','hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(session({

	resave: true,
	saveUninitialized:true,
	secret:'abeerqamer',
	store: new MongoStore({url:'mongodb://root:123@ds155961.mlab.com:55961/abeer-newsletter'}) 


}));
app.use(flash());

app.route('/')
	
	.get((req,res,next) => {

		res.render('main/home',{message: req.flash('success')});

	})
	.post((req,res,next) => {

		request({

			url: 'https://us14.api.mailchimp.com/3.0/lists/d5d03d4cff/members',
			method:'POST',
			headers:{

				'Authorization': 'randomUser 7625a5f898452c2097ef11762c8540a4-us14',
				'Content-Type': 'application/json'

			},
			json:{

				'email_address': req.body.email,
				'status':'subscribed'
			}


		},function(err,response,body){

			if(err)
			{
				console.log(err);
			}
			else
			{
				req.flash('success','you have successfully registered');
				res.redirect('/');
			}

		});


	});


app.listen(3030, (err) =>{

	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log('Running on port 3030');
	}



});