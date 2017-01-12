// This callback function is called when the content script has been
// injected and returned its results

function onPageDetailsReceived( pageDetails ) {
  pageTitle = document.getElementById( 'title' ).value = pageDetails.title;
  currentURL = document.getElementById( 'url' ).value = pageDetails.url;
}

// POST the data to the server using XMLHttpRequest
function nominationTool( e ) {
  e.preventDefault();

  // Google Forms constants
  var GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d/1udxf9C7XeO7rm-SoucjDIv0c8XzGb7VVutsCI8r4s-Y/formResponse?ifq';
  var NAME_FIELD = '&entry.1227505863=';
  var EMAIL_FIELD = '&entry.1975141568=';
  var EVENTNAME_FIELD = '&entry.1518336548=';
  var URL_FIELD = '&entry.1767515686=';
  var TITLE_FIELD = '&entry.180917746=';
  var NOTIFICATION_TOOL_URL = 'http://digital2.library.unt.edu/nomination/eth2016/url/';
  var AGENCY_FIELD = '&entry.1285343614=';
  var AGENCY_ID = '&entry.536064408=';
  var SUBAGENCY_ID = '&entry.1706245913=';
  var ORGANIZATION_ID = '&entry.1076101938=';
  var SUBPRIMER_ID = '&entry.615621344=';

  var title = $( '#title' ).val();
  var name = $( '#name' ).val();
  var email = $( '#email' ).val();
  // make constant for today's event
  // var eventName = "Guerilla Archiving Toronto Dec. 17"
  var eventName = $( '#eventName' ).val();
  var currentURL = $( '#url' ).val();
  var agency = $( '#agency option:selected' ).text();
  var agencyID = $( '#agencyID').val();
  var subAgencyID = $( '#subAgencyID').val();
  var organizationID = $( '#organizationID').val();
  var subprimerID = $( '#subprimerID').val();

  if ( localStorage.name !== name ) {
    localStorage.name = name;
  }
  if ( localStorage.email !== email ) {
    localStorage.email = email;
  }
  if ( localStorage.eventName !== eventName ) {
    localStorage.eventName = eventName;
  }
  if ( localStorage.agency !== agency ) {
    localStorage.agency = agency;
  }

  // Do GET call to post to Google Form and open new tab
  $.get( {
    url: GOOGLE_FORMS_URL + NAME_FIELD + localStorage.name + EMAIL_FIELD + localStorage.email + TITLE_FIELD + title + EVENTNAME_FIELD + 
         localStorage.eventName + URL_FIELD + currentURL + AGENCY_FIELD + agency + AGENCY_ID + agencyID + SUBAGENCY_ID + subAgencyID + ORGANIZATION_ID + organizationID + SUBPRIMER_ID + subprimerID + '&submit=Submit',
    success: function( res ) {
      $( '#success' ).html( "Success!" );
      setTimeout( function() {
          window.location.reload();
        }, 1000 )
        // uncomment this line to also add the URL through the official notificaiton tool.
        // window.open(NOTIFICATION_TOOL_URL + currentURL);
    },
    error: function( err ) {
      $( '#error' ).html( err.statusText || "Error!" );
    }
  } );
}

// When the popup HTML has loaded
window.addEventListener( 'load', function( evt ) {
  // if localStorage.name, localStorage.eventname or localStorage.email exist, autopopulate the form and autofocus
  if ( localStorage.name && localStorage.name !== "null" ) {
    $( '#name' ).val( localStorage.name );
  }
  if ( localStorage.email && localStorage.email !== "null" ) {
    $( '#email' ).val( localStorage.email );
  }
  if ( localStorage.eventName && localStorage.eventName !== "null" ) {
    $( '#eventName' ).val( localStorage.eventName );
  }
  if ( localStorage.agency && localStorage.agency !== "null" ) {
    $( '#agency' ).val( localStorage.agency );
  }

  // Cache a reference to the status display SPAN
  statusDisplay = document.getElementById( 'status-display' );
  // Handle the bookmark form submit event with our nominationTool function
  document.getElementById( 'nominationTool' ).addEventListener( 'submit', nominationTool );
  // Get the event page
  chrome.runtime.getBackgroundPage( function( eventPage ) {
    // Call the getPageInfo function in the event page, passing in
    // our onPageDetailsReceived function as the callback. This injects
    // content.js into the current tab's HTML
    eventPage.getPageDetails( onPageDetailsReceived );
  } );
} );
