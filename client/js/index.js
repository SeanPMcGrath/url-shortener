const hostUrl = "http://localhost:5000/";
//const hostUrl = "https://spmcgrath-url-shortener.herokuapp.com/"

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
      $("#responseDiv").append('<a id="newLink2" />');
      $("#newLink2").attr("href", newLink);
      $("#newLink2").html(newLink);
      $("#original_url").val("");
    }
  });
}
