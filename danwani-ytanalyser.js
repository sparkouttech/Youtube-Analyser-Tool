var totalViews, totalSubs, channelId, uploadId, viewsThreeMonths, likesThreeMonths, commentsThreeMonths, subscribersGained, estimatedRevenue=0, averageViewPercentage, averageViewTotal=0, mostWatchedId;

var d = new Date();
var todayString = d.toISOString().split("T")[0];
d.setMonth(d.getMonth() - 3);
var threeMonthString = d.toISOString().split("T")[0];

//Add user to mailing list
function addToMailingList() {
  var user = GoogleAuth.currentUser.get();
  $('#mce-EMAIL').val(user.getBasicProfile().getEmail());
  $('#mce-NAME').val(user.getBasicProfile().getEmail());
  $('#mce-CHANNEL').val('https://www.youtube.com/channel/' + channelId);
  $('#mce-YT_DATA').val('totalViews, totalSubs, channelId, uploadId, viewsThreeMonths, likesThreeMonths, commentsThreeMonths, subscribersGained, estimatedRevenue, averageViewPercentage, averageViewTotal, mostWatchedId \n' + totalViews+','+totalSubs+','+channelId+','+uploadId+','+viewsThreeMonths+','+likesThreeMonths+','+commentsThreeMonths+','+subscribersGained+','+estimatedRevenue+','+averageViewPercentage+','+averageViewTotal+','+mostWatchedId)
  $('#mc_embed_signup').show();
}

//This is used to grab basic channel data for last 90 days.
//We set total views and other stats can be grabbed if necessary later on
function requestChannelReportForLast90Days() {
  var request = gapi.client.youtubeAnalytics.reports.query({
    "ids": "channel==MINE",
    "startDate": threeMonthString,
    "endDate": todayString,
    "metrics": "views,likes,comments,subscribersGained"
    //"metrics": "estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,views,comments,likes,dislikes"
  });
  request.execute(function(response) {
    viewsThreeMonths = response.rows[0][0];
    likesThreeMonths = response.rows[0][1];
    commentsThreeMonths = response.rows[0][2];
    subscribersGained = response.rows[0][3];
    // estimatedRevenue = response.rows[0][4];

    /*
    if (viewsThreeMonths > 0) {
      $('#views-to-subs').html('You\'ve had ' + Math.round(viewsThreeMonths / totalSubs * 100) / 100 + ' views per subscription');
    } else {
      $('#views-to-subs').html('You\'ve had no views for this time period');
    }
    Math.round(viewsThreeMonths / totalSubs) > 0.005 ? $('#views-to-subs-success').show() : $('#views-to-subs-warning').show();
*/
    if (likesThreeMonths > 0) {
      $('#likes-to-views').html(likesThreeMonths+' likes = '+Math.round(likesThreeMonths/viewsThreeMonths*100 * 100) / 100+'% of total views.');
    } else {
      $('#likes-to-views').html('You\'ve had no likes for this time period');
    }
    if(Math.round(likesThreeMonths/viewsThreeMonths) > 0.04) {
      $('#likes-to-views-success').show();
      $('#likes-to-views').addClass('alert-success');
    } else {
      $('#likes-to-views-warning').show();
      $('#likes-to-views').addClass('alert-warning');
    }

    if (commentsThreeMonths > 0) {
      $('#comments-to-views').html(commentsThreeMonths + ' = ' + Math.round(commentsThreeMonths / viewsThreeMonths * 100 * 100) / 100 + '% of total views.');
    } else {
      $('#comments-to-views').html('You\'ve had no comments for this time period');
    }
    if (Math.round(commentsThreeMonths / viewsThreeMonths) > 0.005){
      $('#comments-to-views-success').show();
      $('#comments-to-views').addClass('alert-success');
    } else {
      $('#comments-to-views-warning').show();
      $('#comments-to-views').addClass('alert-warning');
    }


    if (subscribersGained > 0) {
      $('#subscribers-gained').html(subscribersGained + ' = ' + Math.round(subscribersGained / (totalSubs-subscribersGained) * 100 * 100) / 100 + '% growth.');
    } else {
      $('#subscribers-gained').html('You\'ve had no new subscribers for this time period');
    }
    if (Math.round(subscribersGained / (totalSubs-subscribersGained)) > 0.2) {
      $('#subscribers-gained-success').show();
      $('#subscribers-gained').addClass('alert-success');
    } else {
      $('#subscribers-gained-warning').show();
      $('#subscribers-gained').addClass('alert-warning');
    }

    // $('#estimated-revenue').html('You’ve earned an estimated $'+estimatedRevenue);
  });
}

/*
  Stat - 3% of your total traffic comes via YouTube search.
       - The average view completion across your videos is 27%
  Calc - get top ten videos, get average view percentage and then sources for those, calculate % from youtube search
  Docs - https://developers.google.com/youtube/analytics/sample-requests#channel-traffic-source-reports
  Sample requests:
  https://youtubeanalytics.googleapis.com/v2/reports?dimensions=video&endDate=2017-06-30&ids=channel%3D%3DMINE&maxResults=20&metrics=views&sort=-views&startDate=2014-05-01
  https://youtubeanalytics.googleapis.com/v2/reports?dimensions=insightTrafficSourceDetail&endDate=2017-06-30&filters=video%3D%3DdR0_4QX6zmk%2CbNO9dnwsAqg%2C0E-4f_KXeIE%2CREDgif1Wc_c%2CdmNzD1U80b0%3BinsightTrafficSourceType%3D%3DEXT_URL&ids=channel%3D%3DMINE&maxResults=20&metrics=views&sort=-views&startDate=2014-05-01
 */
function requestTrafficSourcesForTopVideos() {
  var request = gapi.client.youtubeAnalytics.reports.query({
    "ids": "channel==MINE",
    "dimensions": "video",
    "startDate": threeMonthString,
    "endDate": todayString,
    "maxResults" : 20,
    "metrics": "views,averageViewPercentage",
    "sort" : "-views"
  });
  request.execute(function(response) {
    mostWatchedId = response.result.rows[0][0];
    if (mostWatchedId) {
      $('#most-watched').html("<iframe id=\"ytplayer\" type=\"text/html\" width=\"640\" height=\"360\"src=\"https://www.youtube.com/embed/" + mostWatchedId + "?autoplay=1\" frameborder=\"0\"></iframe>");
      $('#most-watched-success').show();
    }
    var mostWatchedArray = "";
    for (var i=0; i< response.result.rows.length;i++) {
      mostWatchedArray = mostWatchedArray.concat(response.result.rows[i][0]).concat(',');
      averageViewTotal += response.result.rows[i][2];
    }
    averageViewPercentage = averageViewTotal/response.result.rows.length;
    mostWatchedArray = mostWatchedArray.slice(0, -1);

    var request2 = gapi.client.youtubeAnalytics.reports.query({
      "ids": "channel==MINE",
      "dimensions": "insightTrafficSourceDetail",
      "filters" : "video==".concat(mostWatchedArray).concat(';insightTrafficSourceType==EXT_URL'),
      "startDate": threeMonthString,
      "endDate": todayString,
      "maxResults" : 20,
      "metrics": "views",
      "sort" : "-views"
    });

    request2.execute(function(response2) {
      var youtubeSearchViews=0, searchViewTotal=0;
      for (var j=0; j < response2.result.rows.length; j++) {
        if(response2.result.rows[j][0] == "YouTube") {
          youtubeSearchViews= response2.result.rows[j][1];
        }
        searchViewTotal += response2.result.rows[j][1];  //might need to parse string toint!
      }
      if (youtubeSearchViews > 0) {
        $('#youtube-searches').html(Math.round(youtubeSearchViews / searchViewTotal * 100 * 100) / 100 + '%');
      }
      if (Math.round(youtubeSearchViews / searchViewTotal) > 0.1){
        $('#youtube-searches-success').show();
        $('#youtube-searches').addClass('alert-success');
      } else {
        $('#youtube-searches-warning').show();
        $('#youtube-searches').addClass('alert-warning');
      }

      $('#average-view-percentage').html(Math.round(averageViewPercentage) + '%');
      if(Math.round(averageViewPercentage) > 50) {
        $('#average-view-percentage-success').show();
        $('#average-view-percentage').addClass('alert-warning');
      } else {
        $('#average-view-percentage-warning').show();
        $('#average-view-percentage').addClass('alert-success');
      }

      addToMailingList();
    });
  });
}

//Stat - 13% of your total video views are from subscribers.
//Calc - get total views and total subscribers, calculate %
function requestChannelReport() {
  // See https://developers.google.com/youtube/v3/docs/channels/list
  var request = gapi.client.youtube.channels.list({
    mine: true,
    part: 'snippet, contentDetails, statistics'
  });
  request.execute(function(response) {
    uploadId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
    channelId = response.result.items[0].id;
    totalViews = response.result.items[0].statistics.viewCount;
    totalSubs = response.result.items[0].statistics.subscriberCount;
    var channelName = response.result.items[0].snippet.title;
    var channelUrl = response.result.items[0].snippet.customUrl;
    if (channelUrl) {
      $('#channelid').html('<a target=\"_blank\" href=\"https://www.youtube.com/' + channelUrl + '\">' + channelName + '</a>');
    } else if (channelId) {
      $('#channelid').html('<a target=\"_blank\" href=\"https://www.youtube.com/channel/' + channelId + '\">' + channelName + '</a>');
    } else {
      $('#channelid').html('No channel found for this account');
    }
    //Then we call all other queries, as they rely on some of this data
    requestChannelReportForLast90Days();
    requestTrafficSourcesForTopVideos();
  });
}