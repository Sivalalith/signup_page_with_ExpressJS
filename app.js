const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(request,response){
    response.sendFile(__dirname + "/signup.html");
})

app.post("/", function(request,response){
    const fName = request.body.firstName;
    const lName = request.body.lastName;
    const email = request.body.email;

    const userData = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const userDataJson = JSON.stringify(userData);
    const url = "https://us10.api.mailchimp.com/3.0/lists/d73560772f";
    
    // API Key stored as env variable 
    const options = {
        method: "POST",
        auth: `lalith1:${process.env.MAILCHIMP_API_KEY}`
    }

    let req = https.request(url, options, function(res){
        res.on("data", function(){
            if(res.statusCode == "200"){
                response.sendFile(__dirname+"/success.html");
            }
            else{
                response.sendFile(__dirname+"/failure.html");
            }
        })
    })

    req.write(userDataJson);
    req.end();

})

app.post("/failure", function(request,response){
    response.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is listening on port 3000.");
})
