
$(document).on("click", function(){
	alert("GUYS LET'S MAKE OUR APP ALIVE!. WE CAN DO IT!!");
});

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

//signup email authentication
$("#signup").on("click", function() {
  $("#signUpForm").css("display", "block");

});

$("#signUpSubmit").on("click", function() {

  var database = firebase.database();
  var email = $("#exampleInputEmail1").val().trim();
  var password = $("#exampleInputPassword1").val().trim();

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    console.log(error.code);
    console.log(error.message);
  });
  $("#signUpForm").css("display", "none");
});

$("#login").on("click", function() {
  $("#loginForm").css("display", "block");

});
$("#loginSubmit").on("click", function() {
      var email = $("#exampleLoginEmail1").val().trim();
      var password = $("#exampleLoginPassword1").val().trim();
      var auth = firebase.auth();
      auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
      });

      $("#loginForm").css("display", "none");
});

//Need to work on signout--login changes state to logout when user is connected
      // auth.signOut().then(function() {
      //   console.log("Logged out!")
      // }, function(error) {
      //   console.log(error.code);
      //   console.log(error.message);
      // });

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

//podcast API
      var queryURL = 'http://gpodder.net/api/2/tag/news/5.json';
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

