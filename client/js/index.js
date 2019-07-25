//const hostUrl = "http://localhost:5000/";
const hostUrl = "https://spmcgrath-url-shortener.herokuapp.com/";

function urlSubmit() {
  let textValue = $("#original_url").val();

  const urlObject = JSON.stringify({
    original_url: $("#original_url").val()
  });

  $.ajax({
    url: hostUrl + "api/shorturl/new",
    type: "POST",
    data: urlObject,
    contentType: "application/json",
    beforeSend: () => {
      $("#submittedUrl").html(textValue);
      $("#responseDiv").empty();
    },
    /*Server is sending back an object, not a JSON. Data format is:
    { 
      _id: (MongoDB id)
      original_url: "www.reddit.com", 
    }*/
    error: data => {
      $("#responseDiv").html(data.responseText);
    },
    success: data => {
      const newLink = hostUrl + "api/shorturl/" + data._id;
      $("#responseDiv").append('<a id="newLink" />');
      $("#newLink").attr("href", newLink);
      $("#newLink").html(newLink);
      $("#responseDiv").append(
        '<button id="copyButton" class="btn btn-default" onclick="copyUrl()">Copy Url</button>'
      );
      $("#original_url").val("");
    }
  });
}

function copyUrl() {
  //Make temporary textinput, set value to shorturl, copy text from there, and remove textinput
  //CSS sets textinpu position as absolute and opacity: 0 to not affect display of page
  //Seemingly no better way to do this
  $("body").append('<input id="tempInput" />');
  $("#tempInput").attr("value", $("#newLink").html());
  $("#tempInput").select();
  document.execCommand("copy");
  $("#tempInput").remove();
}
