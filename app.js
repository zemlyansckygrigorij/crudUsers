const express = require("express");
const fs = require("fs");
const hbs = require("hbs");
const expressHbs = require("express-handlebars");

var bodyParser = require('body-parser')

const app = express();
var jsonParser = bodyParser.json();


app.engine("hbs", expressHbs(
    {
        layoutsDir: "template/layouts", //
        defaultLayout: "layout",
        extname: "hbs",
		partialsDir: __dirname + '/template/partials'//установка пути к частичным представлениям
    }
));

app.set("view engine", "hbs");
app.set("views", "template"); // установка пути к представлениям

let contacts = JSON.parse(fs.readFileSync("personalData.json", "utf8"));
let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

app.use("/contact", function(request, response){ 
    response.render("contact.hbs", contacts);
}); 
 
app.use("/users", function(request, response){
    response.send(users);
});
app.use("/home", function(request, response){
      
    response.render("home.hbs");
});


app.use("/static", express.static(__dirname + "/public"));

// получение списка данных
app.get("/api/users", function(req, res){
    res.send(users);
});

// получение одного пользователя по id
app.get("/api/users/:id", function(req, res){
     
	let user = getUserById(req.params.id);// get user by id
    // отправляем пользователя
    if(user){
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});



app.get("/error", function (request, response){
     
    response.status(404).send("NotFound");
});



// получение отправленных данных
app.post("/api/users", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    let userName = req.body.name;
    let userAge = req.body.age;
    let user = {name: userName, age: userAge};
     
    // находим максимальный id
    let id = Math.max.apply(Math,users.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    user.id = id+1;
    // добавляем пользователя в массив
    users.push(user);
    let data = JSON.stringify(users);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("users.json", data);
    res.send(user);
});
 // удаление пользователя по id
app.delete("/api/users/:id", function(req, res){
      
    let id = req.params.id;
   // var data = fs.readFileSync("users.json", "utf8");
    //var users = JSON.parse(data);
    let index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i<users.length; i++){
        if(users[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        let user = users.splice(index, 1)[0];
        let data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        // отправляем удаленного пользователя
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
// изменение пользователя
app.put("/api/users", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    let userId = req.body.id;
    let userName = req.body.name;
    let userAge = req.body.age;
     
    let user = getUserById(userId);

    // изменяем данные у пользователя
    if(user){
        user.age = userAge;
        user.name = userName;
        let data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
	
	
});


app.listen(3000);
module.exports.app = app;

function getUserById(id){
	let selectUsers = users.filter(function(user ,i,array){
		return user.id == id;
	});
	return selectUsers[0];
}