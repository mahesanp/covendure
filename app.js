const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    let Jsondata = readData();
    posts = Jsondata;

    res.render("home", {allPosts: Jsondata});

});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.post("/update", function(req, res){
    let data = readData();
    let post = {
        city: req.body.titleContent,
        hospital: req.body.postContent,
        seats: req.body.seatsNo,
        oxy: req.body.oxygen,
        icu: req.body.icubeds,
        mobileno: req.body.mobile,
        price: req.body.price,
    };
    data.table.push(post);

    writeData(JSON.stringify(data, null, 2));
    res.redirect("/update");
});

app.get("/update", function(req, res){
    res.render("update");
})

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    if(req.body.password == "qwerty"){
        res.render("update");
    } else{
        res.render("wrongpassword");
    }
})

app.get("/delete", function(req, res){
    let JSONdata = readData();
    res.render("delete", {allPosts: JSONdata});
})

app.post("/edit", function(req, res){
    let editVal = req.body.editVar;
    let Jsondata = readData();

    for(let i=0; i<Jsondata.table.length; i++){
        if(Jsondata.table[i].hospital == editVal){
            var newData = Jsondata.table[i];
            break;
        }
    }
    res.render("edit", {data: newData});
})

app.post("/delete", function(req, res){
    let delVar = req.body.deleteVar;
    let data = readData();

    for(let i=0; i<data.table.length; i++){
        if (data.table[i].hospital == delVar){
            data.table.splice(i, 1);
            break;
        }
    }
    writeData(JSON.stringify(data, null, 2));
    res.redirect("/delete");
})

app.post("/editdata", function(req, res){
    let Jsondata = readData();
    let delHos = req.body.postContent;

    for(let i=0;  i<Jsondata.table.length; i++){
        if(Jsondata.table[i].hospital == delHos){
            Jsondata.table.splice(i, 1);
            break;
        }
    }
    let post = {
        city: req.body.titleContent,
        hospital: req.body.postContent,
        seats: req.body.seatsNo,
        oxy: req.body.oxygen,
        icu: req.body.icubeds,
        mobileno: req.body.mobile,
        price: req.body.price,
    };
    Jsondata.table.push(post);
    writeData(JSON.stringify(Jsondata, null, 2));
    res.redirect("/delete");

})

function writeData(data){
    fs.writeFileSync("data.json", data);
}

function readData(){
    let rawdata = fs.readFileSync("data.json");
    return JSON.parse(rawdata);
}

app.listen(process.env.PORT || 3000, '0.0.0.0',function() {
  console.log("Server started on port 3000");
});
