<template>
  <div class="home">
    <button
      class="p-3 bg-green-400 hover:bg-green-600 duration-200 rounded-lg"
      @click="$socket.emit('start-game')"
    >
      Start Game
    </button>
    <button
      class="p-3 bg-purple-400 hover:bg-purple-600 duration-200 rounded-lg"
      @click="startHotseat"
    >
      Start Hotseat Game
    </button>
    <VTable :headers="headers" :items="items" @click:row="joinGame" />
  </div>
</template>

<script>
// @ is an alias to /src
import Game from "@/components/Game.vue";
import { VTable } from "vuetensils";

export default {
  name: "Home",
  data: () => ({
    gameList: [],
  }),
  computed: {
    headers() {
      return [
        {
          key: "id",
          text: "ID",
        },
        {
          key: "connectionCount",
          text: "Player Count",
        },
      ];
    },
    items() {
      return this.gameList.map((game) => ({
        ...game,
        connectionCount: game.connections.length,
      }));
    },
  },
  methods:{
    joinGame(game) {
      this.$socket.emit("enter-game", game.id);
    },
    startHotseat() {
      this.$router.push("/play")
    }
  },
  mounted() {
    this.$socket.on("update-game-list", (list) => {
      console.log(list);
      this.gameList = list;
    });
    // this.$socket.emit('start-game')

    this.$socket.on("enter-game", (id) => {
      this.$store.dispatch('updateGameId', id)

      this.$router.push("/play")
    });
  },
  components: {
    Game,
    VTable,
  },
};
</script>
