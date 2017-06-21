
$(document).ready(function() {
  // $(".panel").hide();

  $("#flip").click(function() {
    $("#mypanel").toggle("fast");
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

  //store firebase db and auth in global variables
  var database = firebase.database();
  var auth = firebase.auth();
  var email = "";
  var password = "";
  var interest = "";
  // var datatopic = "";
  //
  //creates user -- signup email authentication
  $("#signup").on("click", function() {
    $("#signUpForm").css("display", "block");
  });

  console.log("Hello World!!");
  $("#signUpSubmit").on("click", function() {
    event.preventDefault();

    email = $("#exampleInputEmail1").val().trim();
    password = $("#exampleInputPassword1").val().trim();
    interest = $("#exampleInputInterest1").val().trim();

    var newuser = auth.createUserWithEmailAndPassword(email, password);

    newuser.then(function(user) {
      var ref = database.ref("/user/" + user.uid);

      ref.set({
        email: email,
        password: password,
        uid: user.uid,
        interest: interest
      })

    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });

    $("#signUpForm").css("display", "none");
    auth.signOut();
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

    loginuser.then(function() {
      window.location.href = 'main.html';

    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    })

    $("#loginForm").css("display", "none");
    $("#logout").show();
  });

  getContent();

  $("#logout").on("click", function() {
    $("#panel").hide();
    $("#login").show();
    var logoutuser = auth.signOut();
    logoutuser.then(function() {
      console.log("Logged out!");
      window.location.href = "index.html"
    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });
  });



  auth.onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.uid + "is now signed in")
      $(".panel").show();
			getPodcast();
    } else {
      console.log("no user is signed in")
      $(".panel").hide();
    }
  });

  // podcast API
var queryURL = 'http://gpodder.net/api/2/tag/' + datatopic + '/5.json';

	
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


            $("#pod-div").append(podRow);
          };
        });

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
  	
	

  


  function getContent() {

    auth.onAuthStateChanged(function(user) {

      if (user) {
        var ref = database.ref("/user/" + user.uid);

        ref.on("value", function(snapshot) {

          var datatopic = snapshot.val().interest;
          console.log(datatopic);
          //podcast API call
          var queryURL = 'http://gpodder.net/api/2/tag/' + datatopic + '/5.json';

          $.ajax({
              url: queryURL,
              userAgent: "First-Project-App",
              method: 'GET',
            })
            .done(function(response) {

              console.log(response);
              console.log(queryURL);

              var podcasts = response;

              $("#pod-div").empty();

              for (var i = 0; i < podcasts.length; i++) {
                console.log(podcasts[i].url);

                var podRow = $("<div class='pod-row margin-top'>");
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
          //Books API CALL
          var GbooksAPIkey = "AIzaSyAdRit-J3O3HY3ojccN4WDrf1Zqa-mVcgw"
          var booksQueryURL = "https://www.googleapis.com/books/v1/volumes?q=" + datatopic + "&langRestrict=en&maxResults=5&orderBy=newest&key=" + GbooksAPIkey;

          $.ajax({
              url: booksQueryURL,
              method: 'GET',
            })
            .done(function(response) {

              console.log(response);
              console.log(booksQueryURL);

              var books = response;

              $("#book-div").empty();

              for (var i = 0; i < books.length; i++) {
                console.log(books[i].url);

                var booksRow = $("<div class='books-row margin-top'>");
                var image = $("<img src=" + books[i].scaled_logo_url + ">");
                var booksURL = $("<a class='podlink' href=" + books[i].url + ">" + books[i].title + "</a>");
                var savebtn = $("<button class='btn btn-danger btn-sm pull-right'>save<button>");
                savebtn.attr("data-title", books[i].title).attr("data-url", books[i].url);

                booksRow.append(image);
                booksRow.append(booksURL);
                booksRow.append(savebtn);

                $("#books-div").append(booksRow);
              };
            });
          //books API End

          // youtube API ===================================================

          var searchTopic= 'atlanta';
          var order = 'date';
          var videoID;
          var queryURL = 'https://www.googleapis.com/youtube/v3/search?maxResults=5&part=snippet&q='+searchTopic+'&order='+order+'&type=video&videoEmbeddable=true&key=AIzaSyCnbcvaas-tjIurM5-936c9S3mT5dJgTIo';
          $.ajax({
            url:queryURL,
            method:'GET',
            dataType: 'jsonp'
          })

          .done(function(response){
          console.log(response);
          console.log(response.items);

            // var results = data.items;
            for (var i = 0; i < response.items.length; i++) {
              var youtubeDiv = $("<iframe class='youtube' allowfullscreen>");
              youtubeDiv.css({"width": "200px", "height": "140px", "display":"block"});
              var videoIdList = response.items[i].id.videoId;
              var url = 'https://www.youtube.com/embed/' + videoIdList;
              console.log(url);
              // grabbing the title for every video
              var videoTitle = response.items[i].snippet.title;
              console.log(videoTitle);
              youtubeDiv.attr("src", url);
              $("#displayedVideo").append(youtubeDiv);
              }
          })

          .fail(function(err){
            console.log(err.statusText);
          })
          // youtube ends=======================================================
        })
        console.log(user.uid + "is now signed in")
        $(".panel").show();

      } else {
        console.log("no user is signed in")
        $("#pod-div").empty();
        // $(".panel").hide();
      }
    });
  }

});

