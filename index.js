const express=require('express')
const bodyParser=require('body-parser')
const app=express()
const mysql=require("mysql");
const cors=require('cors');

const db=mysql.createPool({
	host:'localhost',
	user:'root',
	password:'password',
	database:'code_db',

});

db.query("Truncate code_db.scrape_contest;");

var request=require("request");
var ch=require("cheerio");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post("/register",(req,res)=>{

	const fullname=req.body.fullname;
	const email=req.body.email;
	const username=req.body.username;
	const password=req.body.password;

	const sqlInsert=
	"INSERT into login (fullname,email,username,password) VALUES (?,?,?,?);";
	db.query(sqlInsert,[fullname,email,username,password],(err,result)=>{
		console.log(err);
	});
});



app.post("/login",(req,res)=>{

	const username=req.body.username;
	const password=req.body.password;
	
	db.query("SELECT * from login where username=? AND password=?",
		[username,password],(err,result)=>{
		if (err){
			res.send({err: err});
		}
		if (result){
				res.send(result);
		}
		else{
			res.send({message:"No user found!"});
		
		}

	});
});

//Scraping

var url2="https://codeforces.com/contests";
	request(url2,function(err,request,html){
	if(!err){
		//connection.connect();
		//console.log("Connected to MySQL");
		var $=ch.load(html);
		
		$("#pageContent > div.contestList > div.datatable > div:nth-child(6) > table > tbody > tr ").each((index,ele)=>{ 
			tds2=$(ele).find("td");
			var l2=$(ele).find('a.red-link').attr('href');
			//if(l2=='contestsunidentified'){
			//	l2='Registeration not started'
			//}
			
				var contest=$(tds2[0]).text().trim();
				//Contest:$(tds[1]).text().trim(),
				var start=$(tds2[2]).text().trim();
				//Duration:$(tds2[3]).text().trim(),
				var link=url2;

			if(contest!=""){
				var sql="INSERT INTO scrape_contest (name,start_time,link) VALUES (?,?,?);";
				db.query(sql,[contest,start,link], function(err,result){
				if (err) throw err;
					console.log("Inserted!");	
			});
		}
			
		});

		}
	});2
	var url="https://www.codechef.com/contests";
	
	request(url,function(err,request,html){
	if(!err){
		//connection.connect();
		//console.log("Connected to MySQL");
		var $=ch.load(html);
		$("#primary-content > div > div:nth-child(16) > table > tbody > tr ").each((index,element)=>{
			tds=$(element).find("td");
			var l=$(element).find('a').attr('href');
			
				//var contest=$(tds[0]).text();
				var contest=$(tds[1]).text().trim();
				var start=$(tds[2]).text();
				//EndTime:$(tds[3]).text(),
				var link=url+l;
			
				var sql="INSERT INTO scrape_contest (name,start_time,link) VALUES (?,?,?);";
				db.query(sql,[contest,start,link], function(err,result){
				if (err) throw err;
				console.log("Inserted!");
			});

		});
		$("#primary-content > div > div:nth-child(19) > table > tbody > tr ").each((index,element)=>{
			tds=$(element).find("td");
			var l=$(element).find('a').attr('href');
			
				//var contest=$(tds[0]).text();
				var contest=$(tds[1]).text().trim();
				var start=$(tds[2]).text();
				//EndTime:$(tds[3]).text(),
				var link=url+l;
			
				var sql="INSERT INTO scrape_contest (name,start_time,link) VALUES (?,?,?);";
				db.query(sql,[contest,start,link], function(err,result){
				if (err) throw err;
				console.log("Inserted!");
			});

		});

	}
});

app.get("/scrape",function(req,res){
	
	
	db.query("SELECT * FROM scrape_contest;", (err,results,fields) => {
		if(err) throw err;
		res.send(results);
	});
});


app.listen(3001,() => {
	console.log("Server at port 3001");
});