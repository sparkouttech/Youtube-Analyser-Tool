var GoogleAuth;
//var SCOPE = 'https://www.googleapis.com/auth/yt-analytics.readonly';
var SCOPE = 'https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/youtube.readonly';
//var SCOPE = 'https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/yt-analytics-monetary.readonly https://www.googleapis.com/auth/youtube.readonly';
function handleClientLoad() {
  // Load the API's client and auth2 modules.
  // Call the initClient function after the modules load.
  gapi.load('client:auth2', initClient);
}

function initClient() {
  // Retrieve the discovery document for version 1 of YouTube Analytics API.
  // In practice, your app can retrieve one or more discovery documents.
  var discoveryUrl = [
    "https://youtubeanalytics.googleapis.com/$discovery/rest?version=v2",
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
  ];
  //var discoveryUrl = "https://www.googleapis.com/discovery/v1/apis/youtubeAnalytics/v1/rest";

  // Initialize the gapi.client object, which app uses to make API requests.
  // Get API key and client ID from API Console.
  // 'scope' field specifies space-delimited list of access scopes.
  gapi.client.init({
    'apiKey': 'AIzaSyCIrv5yJgt1aB0BV1OsTHE5TdRM2US3U10',
    'discoveryDocs': discoveryUrl,
    'clientId': '848485716782-6rnr698ak7rhvs02ans9lsiuic0grk64.apps.googleusercontent.com',
    'scope': SCOPE
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);

    // Handle initial sign-in state. (Determine if user is already signed in.)
    var user = GoogleAuth.currentUser.get();
    setSigninStatus();

    // Call handleAuthClick function when user clicks on
    //      "Sign In/Authorize" button.
    $('#sign-in-or-out-button').click(function() {
      handleAuthClick();
    });
    $('#revoke-access-button').click(function() {
      revokeAccess();
    });

    $('#run-analysis-button').click(function() {
      requestChannelReport();
    })
  });
}

function handleAuthClick() {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked 'Sign out' button.
    GoogleAuth.signOut();
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn();
  }
}

function revokeAccess() {
  GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
  var user = GoogleAuth.currentUser.get();
  var isAuthorized = user.hasGrantedScopes(SCOPE);
  if (isAuthorized) {
    $('#sign-in-or-out-button').html('Sign out');
    $('#revoke-access-button').css('display', 'inline-block');
    $('#run-analysis-button').css('display', 'inline-block');
    $('#auth-status').html('See your results below (Last 30 days) &#8595;');
    requestChannelReport();
  } else {
    $('#sign-in-or-out-button').html('Sign In/Authorize');
    $('#revoke-access-button').css('display', 'none');
    $('#run-analysis-button').css('display', 'none');
    $('#auth-status').html('Sign in to see your results now!');
  }
}

function updateSigninStatus(isSignedIn) {
  setSigninStatus();
}