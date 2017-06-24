$(document).ready(function() {

  $("#flip").on("click", function() {

    $('.ui.sidebar')
      .sidebar('toggle');
  });

  $('.icon.button').on('click', function(){
  $('.basic.modal.setting')
  .modal('show')
  setFavoriteTopic();
;
});

  $('.ui.radio.checkbox')
  .checkbox()
;


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
  var name = "";
  var email = "";
  var password = "";
  var interest = "";
  var datatopic = "";

  //
  //creates user -- signup email authentication
  $("#signup").on("click", function() {
    window.location.href = "signup.html";
  });

  // console.log("Hello World!!");
  $("#signUpSubmit").on("click", function(event) {
    event.preventDefault();

    name = $("#signUpName").val().trim();
    email = $("#signUpEmail").val().trim();
    password = $("#signUpPassword").val().trim();

    var newuser = auth.createUserWithEmailAndPassword(email, password);

    newuser.then(function(user) {
      var ref = database.ref("/user/" + user.uid);

      ref.set({
        userName: name,
        email: email,
        uid: user.uid,
        interest: false
      })

    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });

    auth.signOut();
    setTimeout(function() {
      window.location.href = "login.html";
    }, 2000);
  });

  //user login
  $("#login").on("click", function() {
    window.location.href = "login.html";
  });

  $("#signUpLink").on("click", function() {
    window.location.href = "signup.html";
  });

  $("#loginSubmit").on("click", function(event) {
    event.preventDefault();

    email = $("#loginEmail").val().trim();
    password = $("#loginPassword").val().trim();

    var loginuser = auth.signInWithEmailAndPassword(email, password);

    loginuser.then(function() {
      window.location.href = 'main.html';

    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    })

  });



  getContent();

  $("#logout").on("click", function() {

    var logoutuser = auth.signOut();

    logoutuser.then(function() {

      console.log("Logged out!");
      window.location.href = "index.html";

    }).catch(function(error) {

      console.log(error.code);
      console.log(error.message);
    });
  });

  function getContent() {

    auth.onAuthStateChanged(function(user) {

      if (user) {
        var ref = database.ref("/user/" + user.uid);

        ref.on("value", function(snapshot) {

          var datatopic = snapshot.val().interest;

          console.log(datatopic);

          if (datatopic === false) {
            setFavoriteTopic();

          } else {

            getYouTube(datatopic);
            getBooks(datatopic);
            getPodcasts(datatopic);
            getNews(datatopic);
            getMeetup(datatopic);
          }

          console.log(user.uid + "is now signed in");
        });
      } else {

        console.log("no user is signed in");
      }
    });
  };

   function setFavoriteTopic() {
     $('.basic.modal.setting').modal('show');
     $("#firstFavSubmit").on("click", function() {
       var interest = $("#interestEntry").val().trim();
       var user = auth.currentUser;
       var ref = database.ref("/user/" + user.uid);

       ref.update({
         interest: interest,
       })
     $('.basic.modal.setting').modal('hide');
     setTimeout(function() {
       getContent();
     }, 2000);
     });
   };


  //Search topic to populate APIs
  $("#searchSubmit").on("click", function(event) {
    event.preventDefault();

    datatopic = $("#searchInput").val().trim();
    console.log(datatopic);

    getYouTube(datatopic);
    getBooks(datatopic);
    getPodcasts(datatopic);
    getNews(datatopic);
    getMeetup(datatopic);
  });

  /*//////////////////////////////////////
  /////////////////Mauricio API ///////////////
  /*//////////////////////////////////////

  function getYouTube(datatopic) {

    var searchTopic = datatopic.split(" ").join("+");
    var order = 'date';
    var videoID;
    var queryURL = 'https://www.googleapis.com/youtube/v3/search?maxResults=9&part=snippet&&relevanceLanguage=en&q=' + searchTopic + '&order=' + order +  '&order=viewCount'+  '&type=video&videoEmbeddable=true&key=AIzaSyCnbcvaas-tjIurM5-936c9S3mT5dJgTIo';
    $.ajax({
        url: queryURL,
        method: 'GET',
        dataType: 'jsonp'
      })

      .done(function(response) {
        console.log("YouTube: " + queryURL);
        console.log(response);
        console.log(response.items);

        $("#video-div").empty();
        // var results = data.items;
        for (var i = 0; i < response.items.length; i++) {
          var youtubeDiv = $("<iframe class='youtube' allowfullscreen>");
          youtubeDiv.css({
            "width": "250px",
            "height": "160px",
            "display": "block",
            "padding": "10px"
          });

          var videoIdList = response.items[i].id.videoId;
          var url = 'https://www.youtube.com/embed/' + videoIdList;
          console.log(url);
          // grabbing the title for every video
          var videoTitle = response.items[i].snippet.title;
          console.log(videoTitle);
          youtubeDiv.attr("src", url);
          youtubeDiv.addClass("margin-top");
          $("#video-div").append(youtubeDiv);
          $('#ytDiv').on('click', function(){
          $('.basic.modal.yt')
          .modal('show')
  ;
  });
  }
  })

      .fail(function(err) {
        console.log(err.statusText);
  })
  };

  function getBooks(datatopic) {
    var searchTopic = datatopic.split(" ").join("+");
    var GbooksAPIkey = "AIzaSyAdRit-J3O3HY3ojccN4WDrf1Zqa-mVcgw"
    var queryURL = "https://www.googleapis.com/books/v1/volumes?q=" + searchTopic + "&langRestrict=en&maxResults=9&orderBy=newest&key=" + GbooksAPIkey;

    $.ajax({
        url: queryURL,
        method: 'GET',
      })
      .done(function(response) {


        console.log(response);
        console.log("Books: " + queryURL);

        $("#books-div").empty();

        for (var i = 0; i < response.items.length; i++) {
          console.log(response.items[i].volumeInfo.imageLinks.thumbnail);

          var booksRow = $("<div class='books-row margin-top'>");
          var image = $("<img src=" + response.items[i].volumeInfo.imageLinks.smallThumbnail + ">");
          var booksURL = $("<a class='podlink' href=" + response.items[i].volumeInfo.infoLink + ">" + response.items[i].volumeInfo.title + "</a>");
          var savebtn = $("<button class='btn btn-danger btn-sm pull-right'>save<button>");
          savebtn.attr("data-title", response.items[i].volumeInfo.title).attr("data-url", response.items[i].volumeInfo.infoLink);

          booksRow.append(image);
          booksRow.append(booksURL);
          booksRow.append(savebtn);

          $("#books-div").append(booksRow);

        };
      }).fail(function(err) {
        console.log(err.statusText);
      });
  };

  function getNews(datatopic) {

    var searchTopic = datatopic.split(" ").join("+");
    var endpoint = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + searchTopic + '&sort=newest&api_key=a49e8a22035943e9bb2f4928fe15d8fe';
    // params = 'q=' + searchTopic + '&sort=newest&api_key=a49e8a22035943e9bb2f4928fe15d8fe';
      // params = 'q=' + searchTopic + '&sort=newest&api_key=6c06af0cde254bc0a14d82aaa261021c';

    // var url = endpoint;

    $.ajax({
        url: endpoint,
        method: 'GET'
      }).then(function(data) {
        console.log(data);
        console.log("NYT: " + endpoint);
        // book.html("Categorie: " + data.response.docs[0].section_name);
        // source.html("Source: " + data.response.docs[0].source);
        // snippet.html("Description: " + data.response.docs[0].snippet);
        // date.html("Date: " + data.response.docs[0].pub_date);
        $("#nyTime-div").empty();

        var arr = data.response.docs; // array of 10 objects
        for (var i = 0; i < arr.length; i++) {
          var content = $("<div>");
          var web = $("<p>").attr('class', 'web'),
            source = $("<p>").attr('class', 'source'),
            snippet = $("<p>").attr('class', 'snippet'),
            date = $("<p>").attr('class', 'date');

          web.html("URL: " + arr[i].web_url);
          source.html("Source: " + arr[i].source);
          snippet.html("Description: " + arr[i].snippet);
          date.html("Date: " + arr[i].pub_date);
          content.append(date, snippet, source, web);
          $("#nyTime-div").append(content);
        }
      })

      .catch(function(err) {
        console.log(err.statusText);
      });
    // GET, DELETE, POST, PUT
  };

  function getPodcasts(datatopic) {
    var searchTopic = datatopic.split(" ").join("+");
    var queryURL = 'http://gpodder.net/api/2/tag/' + searchTopic + '/5.json';

    $.ajax({
        url: queryURL,
        userAgent: "First-Project-App",
        method: 'GET',
      })
      .done(function(response) {

        console.log(response);
        console.log("Podcast: " + queryURL);


        $("#pod-div").empty();

        for (var i = 0; i < response.length; i++) {
          console.log(response[i].url);

          var podRow = $("<div class='pod-row margin-top'>");
          var image = $("<img src=" + response[i].scaled_logo_url + ">");
          var podURL = $("<a class='podlink' href=" + response[i].url + ">" + response[i].title + "</a>");
          var savebtn = $("<button class='btn btn-danger btn-sm pull-right'>save<button>");
          savebtn.attr("data-title", response[i].title).attr("data-url", response[i].url);

          podRow.append(image);
          podRow.append(podURL);
          podRow.append(savebtn);

          $("#pod-div").append(podRow);
        };
      }).fail(function(err) {
        console.log(err.statusText);
      });
  };

  $('.ui.sticky')
    .sticky({
      context: '#example1'
    });

/*//////////////////////////////////////
/////////////////air API ///////////////
/*//////////////////////////////////////

// meet up api ///////////////////////////////////////////

function getMeetup(datatopic){
var searchTopic = datatopic.split(" ").join("+");
$.ajax({

    url:'https://api.meetup.com/find/groups?page=20&text='+ searchTopic +'&key=4f2661595c402d1f6c515a3b671056',
    method:"GET",
    dataType: "jsonp"
})
.then(function(data){
  console.log(data);
  var arr = data.data; // array of 10 objects
        for(var i = 0; i < arr.length; i++){
            var content = $("<div>").attr('class','box');
            var city = $("<p>").attr('class', 'city'),
                description = $("<p>").attr('class', 'description'),
                link = $("<a>").attr({
                    'class': 'link',
                    "href": arr[i].link
                }),
                name = $("<p>").attr('class', 'name');

            city.html(arr[i].city);
            description.html("description: " + arr[i].description);
            link.html("link: " + arr[i].link);
            name.html("Group Name: " + arr[i].name);
            content.append(city,description,name,link);
            $("#result").append(content);
        }
    })
      .catch(function (err) {
        console.log(err.statusText);
      })
    // GET, DELETE, POST, PUT
};

// 2.twitter ///////////////////////////////////////////////////
function getTwitter(datatopic){
var searchTopic = datatopic.split(" ").join("+");
var queryURL = 'https://twitterpopularapi.herokuapp.com/api?q='+ searchTopic +'&count=9';
$.ajax({
    url: queryURL,
    method:"GET",
    dataType: "jsonp"
})
.then(function(data){
 console.log("Twitter: " + data);
  var arr = data.statuses; // array of 10 objects
        for(var i = 0; i < arr.length; i++){
            var content = $("<div>").attr('class','box');
            var text = $("<p>").attr('class', 'text'),


                name = $("<p>").attr('class', 'name');

            text.html("Latest Tweet: " + arr[i].text);

            content.append(text);
            $("#result").append(content);
        }

    })
.fail(function(err){
  console.log(err.statusText);
})
};

});

 //document end.
