import Vue from "vue";

Vue.filter("clickupHours", function(seconds) {
  let time_spent = Number.parseInt(seconds);
  return isNaN(time_spent) ? 0 : time_spent / 3600000 + "h";
});

Vue.filter("clickupHoursInteger", function(seconds) {
  let time_spent = Number.parseInt(seconds);
  return isNaN(time_spent) ? 0 : time_spent / 3600000;
});

Vue.filter("freshbooksDate", function(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date
    .getDate()
    .toString()
    .padStart(2, "0");

  return year + "-" + month + "-" + day;
});
