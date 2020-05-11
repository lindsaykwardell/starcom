<template>
  <div class="play">
    <Game />
  </div>
</template>

<script>
// @ is an alias to /src
import Game from "@/components/Game.vue";

export default {
  name: "Play",
  components: {
    Game,
  },
};
</script>
