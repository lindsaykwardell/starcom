import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import io from "socket.io-client"
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
  faDiceD20,
} from "@fortawesome/free-solid-svg-icons";

import "@/assets/styles/index.postcss";
import "@fortawesome/fontawesome-svg-core/styles.css";

library.add(
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
  faDiceD20
);

Vue.config.productionTip = false;

Vue.component("font-awesome", FontAwesomeIcon);

Vue.prototype.$socket = io("/")

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
