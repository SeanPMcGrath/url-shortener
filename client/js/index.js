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

  $.get("http://localhost:5000/api/shorturls", function(data) {
    $("#newLink").append("Data: " + data);
  });

  // $.ajax({
  //   url: "http://localhost:5000/api/shorturl/new",
  //   type: "POST",
  //   data: urlObject,
  //   dataType: "JSON",
  //   beforeSend: () => {
  //     $("#newLink").append("<br>beforeSend<br>");
  //   },
  //   error: () => {
  //     $("#newLink").append("<br>error<br>");
  //   },
  //   success: () => {
  //     $("#newLink").append("<br>success<br>");
  //   }
  // });

  //$("#newLink").append(urlObject);
}
