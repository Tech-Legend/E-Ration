const express=require('express');
const app=express();
app.use(express());
app.use(express.static('Webpage'))
const fs=require('fs');
const output=fs.readFileSync(__dirname+'/Webpage/ration.html','utf-8');
const place=fs.readFileSync(__dirname+'/Webpage/RationPlace.html','utf-8');
const output2=fs.readFileSync(__dirname+'/Webpage/quantity.html','utf-8');
const quantityslot=fs.readFileSync(__dirname+"/Webpage/QuantitySlot.html",'utf-8');
const output3=fs.readFileSync(__dirname+'/Webpage/ok.html','utf-8');
const output4=fs.readFileSync(__dirname+"/Webpage/display.html","utf-8");
const display=fs.readFileSync(__dirname+"/Webpage/slotbooked.html",'utf-8')
const exist=fs.readFileSync(__dirname+"/Webpage/already.html",'utf-8')
var mongoose=require('mongoose')
var bodyparser=require('body-parser')
app.use(bodyparser.json())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({
    extended:true
}))
app.set('view engine','ejs')
app.set('views','./views')
mongoose.connect("mongodb://0.0.0.0:27017/ration",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
function openmenu(){
    document.getElementById("credentials").style.visibility="visible";
}
var db=mongoose.connection
db.on('error',()=>console.log('connection error'))
db.once('open',()=>{
    console.log("connected to db")
})
var fname;
function generateNumber() {
    let number = '';
    let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 10; i++) {
      number += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return number;
}
function notify(){
    alert("your Query has been submitted successfully")
}
var lamb;
app.get('/',(req,res)=>{
   return res.redirect('/home.html');
})
app.get('/query',(req,res)=>{
    const q=req.query;
    var ins={
        "email":q.email,
        "subject":q.subject,
        "message":q.message
    }
    db.collection("Queries").insertOne(ins,(err,data)=>{
        if(err) throw err;
        console.log(data);
   
    })
    res.redirect('/home.html');
})
app.get('/signin',(req,res)=>{
    res.redirect('/login.html')
})

app.get('/register',(req,res)=>{
    const name=req.query;
    var user={
          "firstname":name.firstname,
          "username": name.username,
          "address": name.address,
          "email": name.email,
          "phone": name.phone,
          "membercount": name.membercount,
          "cardtype": name.cardname,
          "cardnumber": name.cardnumber,
          "password": name.pswd
    }
    var x,items;
    console.log(name.cardnumber);
    if(name.cardname === "AAY Card")
    {
        x="AAY"
         items={
            "name": name.firstname,
  "membercount": name.membercount,
  "rice": 35,
  "sugar": 2,
  "wheat": 7,
  "rice_per_kg": 0,
  "sugar_per_kg": 13.25,
  "kerosene_per_kg": 14,
  "wheat_per_kg": 7.5,
  "password": name.pswd,
  "username": name.username,
  "kerosene": 8
        }
    }
    else if(name.cardname === "Police Card")
    {
        x="Police";
        items={
            "name": name.firstname,
  "membercount": name.membercount,
  "rice": 35,
  "sugar": 2,
  "wheat": 7,
  "rice_per_kg": 0,
  "sugar_per_kg": 13.25,
  "kerosene_per_kg": 14,
  "wheat_per_kg": 7.5,
  "password": name.pswd,
  "username": name.username,
  "kerosene": 8
        }
    }
    else if(name.cardname === "Sugar Card")
    {
        x="Sugar";
         items={
            "name": name.firstname,
            "membercount": name.membercount,
            "rice": 0,
            "kerosene": 8,
            "sugar": 5,
            "wheat": 7,
            "rice_per_kg": 0,
            "sugar_per_kg": 5,
            "kerosene_per_kg": 8,
            "wheat_per_kg": 7,
            "password": name.pswd,
            "username": name.username
        }
    }
    else if(name.cardname ==="Rice Card")
   {
    x="Rice";
     items={
        "name": name.firstname,
  "membercount": name.membercount,
  "rice": name.membercount*5,
  "kerosene": 8,
  "sugar": 5,
  "wheat": 7,
  "rice_per_kg": 0,
  "sugar_per_kg": 5,
  "kerosene_per_kg": 8,
  "wheat_per_kg": 7,
  "password": name.pswd,
  "username": name.username
    }
   }
   console.log(x);
   db.collection(x).insertOne(items,(err,data)=>{
    if(err)
    console.log(err);
    else
    console.log(data);
   })


    
    db.collection('UserLogs').insertOne(user,(err,data)=>{
        if (err)
        console.log(error);
        else
        console.log(data);
    })

    res.redirect('/home.html');
}
)
var cardType;
var userlog;

app.get('/login',(req,res)=>{
    const val=req.query;
    const card=val.carddet;
    console.log(val);
    db.collection('UserLogs').findOne({'cardnumber':card},(err,data)=>{
        if(err)
        console.log(err);
        else{
           
            if(data == null || data.password !=val.password)
            // res.redirect('/failure.html');
           res.redirect('/failure.html')
            else{
            res.redirect(`/store?cardnumber=${card}`);
            cardType=data.cardtype;
            userlog=data.username;
            firstname=data.firstname;
        }
    }
    })
})
var loud;
app.get('/store',(req,res)=>{
    // res.redirect('/know.html');
db.collection('UserLogs').findOne({'username':userlog},(err,data)=>{
    fname=data.firstname;
})
    res.render('knowyourstore',{name:firstname})
     loud=req.query;
console.log(loud);
})
var placedetail;
app.get('/rationplace',(req,res)=>{
    
   db.collection('rationplaces').findOne({"Area_Name":req.query.placename},(err,data)=>{
    var namess;
    if(err)
    console.log(err);
    else
    {
       
        placedetail=req.query.placename;
        let o=place.replace('{%areaname%}',data.Area_Name);
        o=o.replace('{%purice%}',data.PU_Rice);
        o=o.replace('{%contactname%}',fname);
        o=o.replace('{%parice%}',data.PA_Rice);
        o=o.replace('{%totalrice%}',data.Total_Rice);
        o=o.replace('{%sugar%}',data.Sugar);
        o=o.replace('{%wheat%}',data.Wheat);
        o=o.replace('{%oil%}',data.Oil);
        res.send(o);
    }
   })
   
})

app.get('/quantitystore',(req,res)=>{
    placedetail=req.query.placename;
    console.log(placedetail);
    console.log(loud.cardnumber);
    console.log(cardType);
    console.log(userlog);
    console.log(firstname);
   
    var local;
    if(cardType=='AAY Card')
    local="AAY";
    else if(cardType==='Rice Card')
    local="Rice";
    else if(cardType==='Police Card')
    local="Police";
    
    console.log(local);
lamb=local;
    db.collection(lamb).findOne({"username":userlog},(err,data)=>{
if(err)
console.log(err)
else{
    let oup=quantityslot.replace('{%sugaramount%}',data.sugar);
    oup=oup.replace('{%wheatamount%}',data.wheat);
    oup=oup.replace('{%contactname%}',fname)
    oup=oup.replace("{%oilamount%}",data.kerosene);
oup=oup.replace('{%riceamount%}',data.rice);
res.send(oup);
}
    })
   })
   var userproductsdetail;
   app.get('/confirm',(req,res)=>{

    var local;
    if(cardType=='AAY Card')
    local="AAY";
    else if(cardType==='Rice Card')
    local="Rice";
    else if(cardType==='Police Card')
    local="Police";
    

        const detail=req.query;
    db.collection(local).findOne({"username":userlog},(err,data)=>{
        if(err)
        console.log(err)
        else{
            userproductsdetail=detail;
            console.log(data);
            console.log(detail);
            console.log(data.sugar-detail.sugar);
            console.log(data.wheat-detail.wheat);
            console.log(data.kerosene-detail.oil);
            console.log((detail.parice+detail.purice))
            console.log(detail.purice);
            console.log(detail.parice);
            console.log(data.rice);
            var total=parseInt(detail.sugar*data.sugar_per_kg+detail.wheat+data.wheat_per_kg+detail.rice*data.rice_per_kg+detail.oil*data.kerosene_per_kg);
            if((data.sugar-detail.sugar)<0 || (data.wheat-detail.wheat)<0 || (data.kerosene-detail.oil)<0 || (data.rice-(parseInt(detail.parice)+parseInt(detail.purice)))<0)
            {
              res.redirect('/warning.html');
            }
            else{
                
                let o=output4.replace('{%sugaramount%}',detail.sugar);
                o=o.replace('{%wheatamount%}',detail.wheat);
                o=o.replace('{%cardnumber%}',loud.cardnumber);
                o=o.replace('{%cardplace%}',placedetail)
                o=o.replace('{%cardholder%}',userlog)
                o=o.replace('{%parice%}',detail.parice);
                o=o.replace('{%purice%}',detail.purice);
                o=o.replace('{%oil%}',detail.oil);
                o=o.replace('{%total%}',total)
                res.send(o);

            }
        }
    })
   })
   
   var hours,minutes,daycount,days,ack;
   app.get('/bookslot',(req,res)=>{
    db.collection('ConfirmLogs').findOne({"cardnumber":loud.cardnumber},(err,data)=>{
        if(err)
        console.log(err)
        else{
            if(data!=null){
            let o=exist.replace('{%acknowledge%}',data.acknowledgement);
             o=o.replace('{%hour1%}',((data.hour<10)?'0'+parseInt(data.hour):data.hour))
             o=o.replace('{%hour2%}',(data.hour<10)?'0'+parseInt(data.hour):data.hour);
             o=o.replace('{%ack%}',ack)
             o=o.replace("{%day%}",data.day)
             o=o.replace('{%min1%}',((data.minute<10)?'0'+data.minute:data.minute)+(((data.hour<=12)?"am":"pm")));
             o=o.replace('{%min2%}',((data.minute<10)?'0'+parseInt(data.minute+2):data.minute+2)+(((data.hour<=12)?"am":"pm")));
             res.send(o)
        }
            else{
                var local;
                if(cardType=='AAY Card')
                local="AAY";
                else if(cardType==='Rice Card')
                local="Rice";
                else if(cardType==='Police Card')
                local="Police";
                ack=generateNumber();
                var x=["Monday","Tuesday","Wednesday","Thrusday","Friday","Saturday"]
               db.collection(local).updateOne({'username':userlog},{$inc:{rice:-(parseInt(userproductsdetail.purice)+parseInt(userproductsdetail.parice)),sugar:-userproductsdetail.sugar,wheat:-userproductsdetail.wheat,kerosene:-userproductsdetail.oil}});
            //    db.collection('rationplaces').updateOne({'Area_Name':placedetail},{$inc:{PU_Rice:-userproductsdetail.purice,PA_Rice:-userproductsdetail.parice,Total_Rice:-(parseInt(userproductsdetail.parice)+parseInt(userproductsdetail.purice)),Sugar:-userproductsdetail.sugar,Wheat:-userproductsdetail.wheat,Oil:-userproductsdetail.oil}});
            db.collection('rationitems').updateOne({"Area_Name":placedetail},{$inc:{PU_Rice:parseInt(userproductsdetail.purice),PA_Rice:parseInt(userproductsdetail.parice),Total_rice:parseInt(userproductsdetail.parice)+parseInt(userproductsdetail.purice),Sugar:parseInt(userproductsdetail.sugar),Wheat:parseInt(userproductsdetail.wheat),Oil:parseInt(userproductsdetail.oil)}});
            
            db.collection('Time').findOne({"day":{$ne:null}},(err,data)=>{
                if(err)
                console.log(err)
                else{
                
            // time=data;
            hours=data.hour;
            minutes=data.minute;
            days=data.day;
            daycount=data.daycount;
            if(minutes==58)
            {
            hours+=1;
            minutes=0;
            }
            if(minutes==30 && hours==12){
            daycount=(daycount+1)/6;
            days=x[daycount];
            }
            
            minutes+=2
            console.log(hours,minutes,daycount,days)
            db.collection('Time').updateOne({"day":{$ne:null}},{$set:{"day":days,"hour":hours,"minute":minutes,"daycount":daycount}})
                }
               
                
            })
            res.redirect('/lemma');
            }
        }
    })
    
   })
app.get('/lemma',(req,res)=>{
    res.redirect('/show');
})

app.get('/dashboard',(req,res)=>{
    db.collection('UserLogs').findOne({"cardnumber":loud.cardnumber},(err,data)=>{
        if(err) throw err;
        else{
            var user={
                "fname":data.firstname,
                "name":data.firstname,
                "mobile":data.phone,
                "card":data.cardtype,
                "cardnumber":data.cardnumber,
                "member":data.membercount,
                "username":data.username,
                "email":data.email,
                "address":data.address
            }
            res.render('sample',{data:user});
        }
    })
})
app.get('/show',(req,res)=>{
    var users={
        "name":userlog,
        "cardnumber":loud.cardnumber,
        "hour":hours,
        "minute":minutes,
        "acknowledgement":ack,
        "day":days
    }
    db.collection('ConfirmLogs').insertOne(users,(err,data)=>{
        if(err)
        console.log(err)
        else
        console.log(data);
    })
    let o=display.replace('{%hour1%}',((hours<10)?'0'+parseInt(hours):hours));
    o=o.replace('{%hour2%}',(hours<10)?'0'+parseInt(hours):hours);
    o=o.replace('{%ack%}',ack)
    o=o.replace("{%day%}",days)
    o=o.replace('{%min1%}',((minutes<10)?'0'+minutes:minutes)+(((hours<=12)?"am":"pm")));
    o=o.replace('{%min2%}',(((minutes+2)<10)?'0'+parseInt(minutes+2):minutes+2)+(((hours<=12)?"am":"pm")));
    res.send(o)
})
app.listen(5000,()=>{
    console.log('port has started at 5000......');
})