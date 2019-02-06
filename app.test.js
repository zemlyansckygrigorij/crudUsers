const request = require("supertest");
const assert = require("assert");
const fs = require("fs");
let app = require("./app").app;
let users = JSON.parse(fs.readFileSync("users.json", "utf8")); 

let user = {
   id: users.length+1,
   name:"test",
   age :111
};

describe("Express Tests", function(){
	
	    it("should return NotFound with status 404", function(done){
         
        request(app)
            .get("/error")
            .expect(404)
            .expect("NotFound")
            .end(done);
    });
  
    it("should return all users ", function(done){
         
        request(app)
            .get("/users")
            .expect(function(response){
                assert.deepEqual(response.body, users);
            })
            .end(done);
    });
	it("should insert test user ", function(done){
         
        request(app)
            .post("/api/users")
			.send(user)
            .expect(function(){
				let usersNew = JSON.parse(fs.readFileSync("users.json", "utf8")); 	
				assert.deepEqual(usersNew[usersNew.length-1], user);
            })
            .end(done);
    });
	it("should edit test user ", function(done){
        user.name = "test1";
		user.age = 1;
		
        request(app)
            .put("/api/users")
			.send(user)
            .expect(function(){
				let usersNew = JSON.parse(fs.readFileSync("users.json", "utf8")); 	
				assert.deepEqual(usersNew[usersNew.length-1], user);
            })
            .end(done);
    });
	it("should delete test user ", function(done){
        user.name = "test1";
		user.age = 1;
		
        request(app)
            .delete("/api/users/"+user.id)
			.send(user)
            .expect(function(){
				let usersNew = JSON.parse(fs.readFileSync("users.json", "utf8")); 	
				 assert.equal(usersNew.length, users.length);
            })
            .end(done);
    });
	
});
