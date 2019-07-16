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

  $.ajax({
    url: "http://localhost:5000/api/shorturl/new",
    type: "POST",
    data: urlObject,
    contentType: "application/json",
    beforeSend: () => {
      $("#originalLink").html(urlObject);
    },
    /*Server is sending back an object, not a JSON. Data format is:
    { 
      original_url: "www.reddit.com", 
      short_url: 2 
    }*/
    error: data => {
      $("#newLink").html("<br>error<br>");
      $("#newLink").append(JSON.stringify(data));
    },
    success: data => {
      $("#newLink").html("<br>success<br>");
      const newLink = "http://localhost:5000/api/shorturl/" + data.short_url;
      $("#newLink").append(newLink);
    }
  });
}
