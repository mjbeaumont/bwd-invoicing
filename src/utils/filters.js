import Vue from "vue";

Vue.filter("clickupHours", function(seconds) {
  let time_spent = Number.parseInt(seconds);
  return isNaN(time_spent) ? 0 : time_spent / 3600000 + "h";
});
