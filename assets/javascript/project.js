$(document).ready(function(){
$(".panel").hide();
//Firebase initialize
var config = {
  apiKey: "AIzaSyDxW087mUoLk6smGAHixRd5lLKYBZ4JeA8",
  authDomain: "first-project-5b478.firebaseapp.com",
  databaseURL: "https://first-project-5b478.firebaseio.com",
  projectId: "first-project-5b478",
  storageBucket: "",
  messagingSenderId: "618602692351"
};
firebase.initializeApp(config);

console.log(firebase);

//store firebase db and auth in global variables
var database = firebase.database();
var auth = firebase.auth();
var email = "";
var password = "";

//creates user -- signup email authentication
$("#signup").on("click", function() {
  $("#signUpForm").css("display", "block");
});

$("#signUpSubmit").on("click", function() {
  event.preventDefault();

  email = $("#exampleInputEmail1").val().trim();
  password = $("#exampleInputPassword1").val().trim();

  var newuser = auth.createUserWithEmailAndPassword(email, password);

  newuser.then(function(user) {
      var ref = database.ref("/user/" + user.uid);

      ref.set({
        email: email,
        password: password,
        uid: user.uid,
        interest: "sports"
      })

    })
    .catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });

  $("#signUpForm").css("display", "none");

});

//user login
$("#login").on("click", function() {
  $("#loginForm").css("display", "block");

});
$("#loginSubmit").on("click", function() {
  event.preventDefault();

  email = $("#exampleLoginEmail1").val().trim();
  password = $("#exampleLoginPassword1").val().trim();

  var loginuser = auth.signInWithEmailAndPassword(email, password);

  loginuser.then(function(user) {
      var ref = database.ref("/user/" + user.uid);

      ref.on("value", function(snapshot) {
        // console.log(snapshot.user.uid.val() + "is now logged in");
        console.log(snapshot.val());
				console.log(snapshot.val().email);
        datatopic = snapshot.val().interest;
      })

    })
    .catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    })

  $("#loginForm").css("display", "none");
	$("#logout").show();
});

//Need to work on signout--login changes state to logout when user is connected

$("#login").on("click", function() {
auth.signOut().then(function() {
  console.log("Logged out!")
	$("#panel").hide();
	$("#login").show();
}, function(error) {
  console.log(error.code);
  console.log(error.message);
});
});

auth.onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.uid + "is now signed in")
		$(".panel").show();
  } else {
    console.log("no user is signed in")
		$(".panel").hide();
  }
});



//   newref.push({
//     name : "Jeff",
//     player : 45,
//     color : "black"
//   });
//
//   newref.push({
//     name : "El",
//     player : 75,
//     color : "white"
// });

// podcast API
var datatopic = "";
var queryURL = 'http://gpodder.net/api/2/tag/' + datatopic + '/5.json';
// var queryURL = 'http://mygpo-feedservice.appspot.com/api/2/tech/5.json';

$.ajax({
    url: queryURL,
    userAgent: "First-Project-App",
    method: 'GET',
  })
  .done(function(response) {

    console.log(response);
    console.log(queryURL);

    var podcasts = response;

    for (var i = 0; i < podcasts.length; i++) {
      console.log(podcasts[i].url);

      var podRow = $("<div class='margin-top'>");
      var image = $("<img src=" + podcasts[i].scaled_logo_url + ">");
      var podURL = $("<a class='podlink' href=" + podcasts[i].url + ">" + podcasts[i].title + "</a>");
      var savebtn = $("<button class='btn btn-danger btn-sm pull-right'>save<button>");
      savebtn.attr("data-title", podcasts[i].title).attr("data-url", podcasts[i].url);

      podRow.append(image);
      podRow.append(podURL);
      podRow.append(savebtn);

      $("#pod-div").append(podRow);
    };
  });

});
