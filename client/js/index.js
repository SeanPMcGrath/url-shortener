// function initialSetting() {
//   $("#testDiv").html("JavaScript ran");
//   // $("form").attr("onsubmit", "urlSubmit()");
//   $("#urlSubmit2").attr("value", "Submitify");
// }
// initialSetting();

function urlSubmit() {
  let textValue = $("#original_url").val();

  const urlObject = JSON.stringify({
    original_url: $("#original_url").val()
  });

  $.ajax({
    url: "https://spmcgrath-url-shortener.herokuapp.com/api/shorturl/new",
    type: "POST",
    data: urlObject,
    contentType: "application/json",
    beforeSend: () => {
      $("#submittedUrl").html(textValue);
      $("#responseDiv").empty();
    },
    /*Server is sending back an object, not a JSON. Data format is:
    { 
      original_url: "www.reddit.com", 
      short_url: 2 
    }*/
    error: data => {
      $("#responseDiv").html(data.responseText);
    },
    success: data => {
      const newLink =
        "https://spmcgrath-url-shortener.herokuapp.com/api/shorturl/" +
        data.short_url;
      $("#responseDiv").append('<a id="newLink2" />');
      $("#newLink2").attr("href", newLink);
      $("#newLink2").html(newLink);
      $("#original_url").val("");
    }
  });
}
