// function urlSubmit(originalUrl) {
//   urlObject = {
//     original_url: originalUrl
//   };
// }

// $("#urlSubmit").click(() => {
//   alert("Button was clicked");
// });

function initialSetting() {
  $("#testDiv").html("JavaScript ran");
  $("form").attr("onsubmit", "urlSubmit()");
  $("#urlSubmit").attr("value", "Submitify");
}
initialSetting();

function urlSubmit() {
  $("#testDiv").html("JavaScript button ran");
  alert("Button was clicked");
}
