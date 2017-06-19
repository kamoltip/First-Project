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
