// function initialSetting() {
//   $("#testDiv").html("JavaScript ran");
//   // $("form").attr("onsubmit", "urlSubmit()");
//   $("#urlSubmit2").attr("value", "Submitify");
// }
// initialSetting();

function urlSubmit() {
  let textValue = $("#original_url").val();
  $("#originalLink").text(textValue);

  const urlObject = JSON.stringify({
    original_url: $("#original_url").val()
  });

  // $.get("http://localhost:5000/api/shorturls", function(data) {
  //   $("#newLink").append("Data: " + data);
  // });

  $.ajax({
    url: "http://localhost:5000/api/shorturl/new",
    type: "POST",
    //data: urlObject,
    data: urlObject,
    contentType: "application/json",
    beforeSend: () => {
      $("#newLink").append("<br>beforeSend<br>");
      $("#newLink").append(urlObject);
      console.log(urlObject);
    },
    /*Server is sending back an object, not a JSON. Data format is:
    { 
      original_url: "www.reddit.com", 
      short_url: 2 
    }*/
    error: data => {
      $("#newLink").append("<br>error<br>");
      $("#newLink").append(JSON.stringify(data));
    },
    success: data => {
      $("#newLink").append("<br>success<br>");
      console.log(data);
      const newLink = "http://localhost:5000/api/shorturl/" + data.short_url;
      $("#newLink").append(newLink);
    }
  });
}
