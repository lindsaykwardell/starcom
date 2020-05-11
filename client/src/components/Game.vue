<template>
  <div class="flex">
    <div class="bar">
      <div class="bar-content flex flex-col">
        <div class="flex-grow">
          <div class="flex">
            <button
              class="p-1 bg-blue-400 hover:bg-blue-600 duration-200 flex-1"
              @click="draw(activePlayer, decks.politics)"
            >
              Politics ({{ decks.politics.length }}/40)
            </button>
            <button
              class="p-1 bg-red-400 hover:bg-red-600 duration-200 flex-1"
              @click="draw(activePlayer, decks.industry)"
            >
              Industry ({{ decks.industry.length }}/40)
            </button>
            <button
              class="p-1 bg-green-400 hover:bg-green-600 duration-200 flex-1"
              @click="draw(activePlayer, decks.science)"
            >
              Science ({{ decks.science.length }}/40)
            </button>
          </div>

          <Dialog :show="showDiscard" @toggle="toggleDiscard">
            <template v-slot:button
              ><h6 class="text-white">
                Discard ({{ discard.length }})
              </h6></template
            >
            <template v-slot:header>All Discarded Cards</template>
            <p v-if="discard.length <= 0">
              No cards have been placed in discard yet.
            </p>
            <Card
              v-for="card in discard"
              :key="card.id"
              :card="card"
              class="inline lg"
            />
          </Dialog>
          <Card :card="discard[0]" class="m-auto" />
          <Dialog :show="showStack" @toggle="toggleStack">
            <template v-slot:button
              ><h4 class="text-white">
                Current Actions ({{ stack.length }})
              </h4></template
            >
            <template v-slot:header>All Cards to Resolve</template>
            <p v-if="stack.length <= 0">No cards have been played yet.</p>
            <Card
              v-for="card in stack"
              :key="card.id"
              :card="card"
              class="inline lg"
            />
          </Dialog>
          <Card :card="stack[0]" class="md m-auto" loc="stack" />
        </div>
        <div class="flex-shrink relative">
          <Card
            v-if="
              hoveredCard &&
                hoveredCard.type &&
                hoveredCard.type.includes('System')
            "
            class="horizontal-lg"
            :card="hoveredCard"
          />
          <Card v-else class="lg" :card="hoveredCard" loc="hover" />
          <DamageDice
            v-if="hoveredCard.damage"
            :damage="hoveredCard.damage"
            size="3x"
          />
        </div>
      </div>
    </div>
    <div class="flex-grow bg-black h-screen">
      <div v-if="shouldBoardDisplay && systems" class="board relative">
        <template v-if="!showCombat">
          <div class="flex justify-around mt-6">
            <System
              @move:ship="sync"
              :system.sync="systems[0]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around  w-4/5 m-auto">
            <System
              @move:ship="sync"
              :system.sync="systems[1]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[2]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around">
            <System
              @move:ship="sync"
              :system.sync="systems[3]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[4]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[5]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-between">
            <System
              @move:ship="sync"
              :system.sync="systems[6]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[7]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[8]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[9]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around">
            <System
              @move:ship="sync"
              :system.sync="systems[10]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[11]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[12]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around w-4/5 m-auto">
            <System
              @move:ship="sync"
              :system.sync="systems[13]"
              group="board"
              @explored="onExplore"
            />
            <System
              @move:ship="sync"
              :system.sync="systems[14]"
              group="board"
              @explored="onExplore"
            />
          </div>
          <div class="flex justify-around">
            <System
              @move:ship="sync"
              :system.sync="systems[15]"
              group="board"
              @explored="onExplore"
            />
          </div>
        </template>
        <template v-else>
          <div class="flex justify-around items-center board-height">
            <System
              @move:ship="sync"
              group="combat"
              :system.sync="systems[combatSystemLoc]"
              combat
            />
          </div>
        </template>
        <button
          class="next-turn-button"
          @click="showCombat ? endCombat() : nextTurn()"
        >
          {{ showCombat ? "End Combat" : "Pass Turn" }}
        </button>
        <div class="active-player-stats flex">
          <div
            class="flex-1 mr-3 bg-red-400 p-1 rounded-lg duration-200"
            :class="
              activePlayer === 'player1' ? 'bg-red-400 shadow-lg' : 'bg-red-900'
            "
          >
            Credits: {{ players.player1.credits }}<br />
            Total Devlopments: {{ getPlayerDevelopmentCount("player1") }}
          </div>
          <div
            class="flex-1 bg-blue-400 p-1 rounded-lg duration-200"
            :class="
              activePlayer === 'player2'
                ? 'bg-blue-400 shadow-lg'
                : 'bg-blue-900'
            "
          >
            Credits: {{ players.player2.credits }}<br />
            Total Devlopments: {{ getPlayerDevelopmentCount("player2") }}
          </div>
          <button
            class="p-2 bg-gray-700 hover:bg-gray-800 text-white ml-5 rounded-full duration-200 w-48"
            @click="showTechnology = !showTechnology"
          >
            Show {{ showTechnology ? "Hand" : "Technology" }}
          </button>
        </div>
        <div class="d20">
          <font-awesome size="4x" :icon="['fa', 'dice-d20']" :class="dieRoll" />
        </div>
      </div>
      <div class="hand" v-if="shouldBoardDisplay">
        <DropZone
          :list.sync="showTechnology ? technology : hand"
          group="hand"
        />
      </div>
    </div>
    <div
      v-if="showContextMenu && contextCard"
      v-clickout="onClickout"
      class="context-menu"
      :style="contextCoordinates"
    >
      <div v-for="option in currentContextMenu" :key="option.action" class="">
        <button
          v-if="
            !option.condition ||
              option.condition({
                card: contextCard,
                system: systems[contextLoc],
                activePlayer,
                players,
                inCombat: showCombat,
              })
          "
          class="hover:bg-gray-600 p-2 w-full text-left"
          @click="performAction(option)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import DropZone from "@/components/DropZone/DropZone";
import System from "@/components/System/System";
import Card from "@/components/Card/Card";
import DamageDice from "@/components/Dice/DamageDice";
import Dialog from "@/components/Dialog/Dialog";
import { clickout } from "vuetensils/src/directives";
import Vue from "vue";

import {
  DECK_POLITICS,
  DECK_INDUSTRY,
  DECK_SCIENCE,
  DECK_SYSTEM,
  CARD_LIST,
  HOMEWORLD,
  HAND_CONTEXT_MENU,
  DISCARD_CONTEXT_MENU,
  DAMAGE_CONTEXT_MENU,
  SCOUT,
  POLITICS,
  INDUSTRY,
  SCIENCE,
  TECHNOLOGY,
  DAMAGEABLE,
  generateResolveContextMenu,
  generateCombatContextMenu,
  mapCard,
} from "@/lib/core-v1";
import Deck from "@/models/Deck";

import EventBus from "@/util/EventBus";

const PLAYER_1 = "player1";
const PLAYER_2 = "player2";

export default {
  name: "game",
  display: "Game",
  data() {
    return {
      me: PLAYER_2,
      nextId: 0,
      dieValue: 0,
      showBoard: true,
      showCombat: false,
      isSyncingFromServer: false,
      combatSystemLoc: 0,
      showDiscard: false,
      showTechnology: false,
      showStack: false,
      showContextMenu: false,
      players: {
        player1: {
          credits: 0,
          hand: [],
          technology: [],
        },
        player2: {
          credits: 0,
          hand: [],
          technology: [],
        },
      },
      activePlayer: PLAYER_1,
      contextCard: null,
      contextLoc: 0,
      contextCoordinates: {
        x: 0,
        y: 0,
      },
      hoveredCard: {
        img: "",
      },
      systems: [],
      discard: [],
      stack: [],
      decks: {
        politics: [],
        industry: [],
        science: [],
        system: [],
      },
    };
  },
  computed: {
    hotseatMode() {
      return this.$store.state.gameId === null
    },
    shouldBoardDisplay() {
      return this.showBoard && !this.showDiscard && !this.showStack;
    },
    activePlayerDevelopmentCount() {
      return this.systems
        .filter((system) => system.card.controlledBy === this.activePlayer)
        .reduce((total, system) => system.card.developmentLevel + total, 0);
    },
    hand: {
      get() {
        return this.players[this.me].hand;
      },
      set(val) {
        this.players[this.me].hand = val;
      },
    },
    technology() {
      return this.players[this.me].technology;
    },
    nonActivePlayer() {
      return this.me === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    },
    notMe() {
      return this.me === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    },
    dieRoll() {
      console.log(this.dieValue);

      if (this.dieValue <= 5) {
        return "industry";
      } else if (this.dieValue > 5 && this.dieValue <= 10) {
        return "politics";
      } else if (this.dieValue > 10 && this.dieValue <= 15) {
        return "science";
      } else if (this.dieValue > 15 && this.dieValue <= 18) {
        return "tax";
      } else {
        return "pirates";
      }
    },
    currentContextMenu() {
      console.log(this.contextCard);
      if (this.contextLoc === "stack" && this.contextCard.stepContextMenu) {
        const stepMenu = this.contextCard.stepContextMenu[
          this.contextCard.step
        ]({
          ...this.contextCard.stepContext,
          card: this.contextCard,
          systems: this.systems,
          activePlayer: this.me,
          nonActivePlayer: this.notMe,
          players: this.players,
          discard: this.discard,
          stack: this.stack,
        });

        console.log(stepMenu);

        return stepMenu;
      }

      if (!this.showCombat || !this.contextCard.combatContextMenu) {
        // return this.contextCard.contextMenu;
      } else {
        return this.contextCard.combatContextMenu({
          card: this.contextCard,
          system: this.systems[this.combatSystemLoc],
          players: this.players,
        });
      }

      if (this.contextCard.buildShipContextMenu) {
        return [
          ...this.contextCard.contextMenu,
          ...this.contextCard.buildShipContextMenu({
            card: this.contextCard,
            activePlayer: this.me,
            players: this.players,
            systems: this.systems,
          }),
        ];
      }

      return this.contextCard.contextMenu;
    },
  },
  methods: {
    rollDie() {
      this.dieValue = Math.floor(Math.random() * 21);
    },
    playerControlsDomain(player, domain) {
      for (const system of this.systems) {
        if (
          system.card.controlledBy === player &&
          system.card.domain === domain
        ) {
          return true;
        }
      }

      return false;
    },
    toggleDiscard(val) {
      this.showDiscard = val;
      this.showBoard = !val;
    },
    toggleStack(val) {
      this.showStack = val;
      this.showBoard = !val;
    },
    getPlayerDevelopmentCount(player) {
      return this.systems
        .filter((system) => system.card.controlledBy === player)
        .reduce((total, system) => system.card.developmentLevel + total, 0);
    },
    getNextId() {
      this.nextId = this.nextId + 1;
      return this.nextId;
    },
    draw(player, deck) {
      if (typeof deck === "string") {
        if (deck === INDUSTRY) deck = this.decks.industry;
        if (deck === POLITICS) deck = this.decks.politics;
        if (deck === SCIENCE) deck = this.decks.science;
      }

      if (this.players[player].hand.length < 8) {
        const nextCard = deck.pop();
        this.players[player].hand = [
          ...this.players[player].hand,
          {
            ...nextCard,
            id: this.getNextId(),
            contextMenu: [
              //...nextCard.contextMenu,
              ...HAND_CONTEXT_MENU,
            ],
          },
        ];

        this.sync();
      } else {
        alert("Too many cards in hand!");
      }
    },
    destroy(destroyedCard) {
      if (destroyedCard.onDestroy) {
        const shouldContinueToDestroy = destroyedCard.onDestroy();
        if (!shouldContinueToDestroy) return;
      }

      if (destroyedCard.damageAssignedTo) {
        this.unassignCombatDamage(destroyedCard);
      }

      this.discard = [
        {
          ...destroyedCard,
          contextMenu: [...DISCARD_CONTEXT_MENU],
          damage: 0,
        },
        ...this.discard,
      ];

      this.systems.forEach((system) => {
        system[this.me] = system[this.me].filter(
          (card) => card.id !== destroyedCard.id
        );

        system[this.notMe] = system[this.notMe].filter(
          (card) => card.id !== destroyedCard.id
        );
      });

      this.sync();
    },
    onClickout() {
      this.showContextMenu = false;
    },
    toggleContextMenu(card, loc, event) {
      // Opens the context menu on the specified coordinates,

      this.contextCoordinates = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
      };
      this.showContextMenu = true;
      this.contextCard = card;
      this.contextLoc = loc;
    },
    onExplore(card) {
      card.explored = true;
      if (card.onExplore) {
        card.onExplore({
          card,
          system: this.systems[card.loc],
          activePlayer: this.me,
          players: this.players,
        });
      }

      this.sync();
    },
    performAction(option) {
      const keys = option.action.split(":");
      switch (keys[0]) {
        case "build":
          const card = { ...CARD_LIST.find((c) => c.id == keys[1]) };
          if (card) {
            this.systems[this.contextLoc][this.me] = [
              ...this.systems[this.contextLoc][this.me],
              { ...card, id: this.getNextId() },
            ];
            if (option.cost) {
              this.players[this.me].credits -= option.cost;
            } else {
              this.players[this.me].credits -= card.cost;
            }
          }
          break;
        case "build-in":
          this.systems[keys[1]][this.me] = [
            ...this.systems[keys[1]][this.me],
            { ...this.contextCard, contextMenu: [...DAMAGE_CONTEXT_MENU] },
          ];

          this.stack = this.stack.filter(
            (card) => card.id !== this.contextCard.id
          );
          break;
        case "develop":
          this.contextCard.controlledBy = this.me;

          if (
            this.contextCard.developmentLevel <
            this.contextCard.maxDevelopmentLevel
          ) {
            let cost = this.systems[this.contextLoc].card.developmentLevel * 2;
            if (cost === 0) cost = 1;
            this.players[this.me].credits -= cost;
            this.systems[this.contextLoc].card.developmentLevel++;
          }

          break;
        case "damage":
          this.contextCard.damage =
            this.contextCard.damage + parseInt(keys[1], 10);
          break;
        case "repair":
          this.contextCard.damage =
            this.contextCard.damage - parseInt(keys[1], 10);

          this.players[this.me].credits -= 2;
          break;
        case "destroy":
          this.destroy(this.contextCard);
          break;
        case "hand":
          switch (keys[1]) {
            case "play":
              if (this.players[this.me].credits >= this.contextCard.cost) {
                this.players[this.me].credits -= this.contextCard.cost;

                this.stack = [
                  {
                    ...this.contextCard,
                    contextMenu: generateResolveContextMenu({
                      card: this.contextCard,
                      systems: this.systems,
                      activePlayer: this.me,
                      players: this.players,
                    }),
                  },
                  ...this.stack,
                ];

                this.players[this.me].hand = this.players[this.me].hand.filter(
                  (card) => card.id !== this.contextCard.id
                );
              } else {
                alert("You don't have enough credits!");
              }

              break;
            case "discard":
              this.discard = [
                { ...this.contextCard, contextMenu: [...DISCARD_CONTEXT_MENU] },
                ...this.discard,
              ];

              this.players[this.me].hand = this.players[this.me].hand.filter(
                (card) => card.id !== this.contextCard.id
              );
              break;
            case "return":
              this.players[this.me].hand = [
                ...this.players[this.me].hand,
                { ...this.contextCard, contextMenu: [...HAND_CONTEXT_MENU] },
              ];

              this.players[this.me].credits += this.contextCard.cost;

              this.discard = this.discard.filter(
                (card) => card.id !== this.contextCard.id
              );
              this.stack = this.stack.filter(
                (card) => card.id !== this.contextCard.id
              );
              break;
            case "resolve":
              this.resolveCardOnStack();
              break;
          }
          break;
        case "combat":
          this.showCombat = true;
          this.combatSystemLoc = this.contextLoc;
          break;
        case "assign-damage":
          this.assignCombatDamage(this.contextCard, parseInt(keys[1], 10));
          break;
        case "unassign-damage":
          this.unassignCombatDamage(this.contextCard);
          break;
        case "step":
          // Perform the custom function in the step.
          // Store the value in the contextStepResponse (merge all data together)
          // Increment the step
          // If it's the last step, run 'resolve'

          const result = option.stepAction();
          console.log(result);
          this.contextCard.stepContext = {
            ...this.contextCard.stepContext,
            ...result,
          };
          this.contextCard.step++;
          if (
            this.contextCard.stepContextMenu.length <= this.contextCard.step
          ) {
            this.resolveCardOnStack();
          }
          break;
        default:
        // Do nothing
      }

      this.showContextMenu = false;
      this.sync();
    },
    resolveCardOnStack() {
      // Reset step data
      if (this.contextCard.step) {
        this.contextCard.step = 0;
        this.contextCard.stepContext = {};
      }

      if (this.contextCard.type === TECHNOLOGY) {
        this.players[this.me].technology = [
          ...this.players[this.me].technology,
          this.contextCard,
        ];
      } else {
        this.discard = [
          {
            ...this.contextCard,
            contextMenu: [...DISCARD_CONTEXT_MENU],
          },
          ...this.discard,
        ];
      }

      this.stack = this.stack.filter((card) => card.id !== this.contextCard.id);

      // Destroy any dead ships
      this.cleanUpDestroyedShips();
      this.sync();
    },
    assignCombatDamage(attackingCard, targetId) {
      Vue.set(attackingCard, "damageAssignedTo", targetId);
      this.systems[this.combatSystemLoc].player1.forEach((card) => {
        if (card.id === targetId) {
          card.damage += attackingCard.attack;
        }
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        if (card.id === targetId) {
          card.damage += attackingCard.attack;
        }
      });
    },
    unassignCombatDamage(attackingCard) {
      this.systems[this.combatSystemLoc].player1.forEach((card) => {
        if (card.id === attackingCard.damageAssignedTo) {
          card.damage -= attackingCard.attack;
        }
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        if (card.id === attackingCard.damageAssignedTo) {
          card.damage -= attackingCard.attack;
        }
      });

      Vue.set(attackingCard, "damageAssignedTo", undefined);
    },
    endCombat() {
      console.log("Fired!");
      this.showCombat = false;

      this.systems[this.combatSystemLoc].player1.forEach((card) => {
        card.damageAssignedTo = undefined;
      });

      this.systems[this.combatSystemLoc].player2.forEach((card) => {
        card.damageAssignedTo = undefined;
      });

      this.cleanUpDestroyedShips();
      this.sync();
    },
    cleanUpDestroyedShips() {
      this.systems.forEach((system) => {
        system.player1.forEach((card) => {
          if (card.damage >= card.hp) this.destroy(card);
        });

        system.player2.forEach((card) => {
          if (card.damage >= card.hp) this.destroy(card);
        });
      });
    },
    nextTurn() {
      // Clean up destroyed ship
      this.cleanUpDestroyedShips();

      // Conquest
      this.systems.forEach((system) => {
        if (
          system.card.controlledBy === this.notMe &&
          system[this.me].length > 0 &&
          system[this.notMe].length === 0
        ) {
          system.card.controlledBy = this.me;
          system.card.developmentLevel = 1;
        }
      });

      // End of turn effects end.
      this.systems.forEach((system) => {
        system.player1.forEach((card) => {
          if (card.onTurnEnd) {
            card.onTurnEnd({
              card,
              system,
              systems: this.systems,
              activePlayer: this.me,
              players: this.players,
            });
          }
        });
        system.player2.forEach((card) => {
          if (card.onTurnEnd) {
            card.onTurnEnd({
              card,
              system,
              systems: this.systems,
              activePlayer: this.me,
              players: this.players,
            });
          }
        });
      });

      // Next player
      this.activePlayer = this.activePlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
      if (this.hotseatMode) this.me = this.me === PLAYER_1 ? PLAYER_2 : PLAYER_1;

      // Gain credits
      this.players[
        this.activePlayer
      ].credits += this.activePlayerDevelopmentCount;

      // Check for "At start of turn" effects

      this.players[this.activePlayer].technology.forEach((technology) => {
        if (technology.onTurnStart) {
          technology.onTurnStart({
            card: technology,
            systems: this.systems,
            activePlayer: this.activePlayer,
            players: this.players,
          });
        }
      });

      this.systems.forEach((system) => {
        if (system.card.controlledBy === this.me && system.card.onTurnStart) {
          system.card.onTurnStart({
            card: system.card,
            system: system,
            systems: this.systems,
            activePlayer: this.activePlayer,
            players: this.players,
          });
        }
        system[this.me].forEach((card) => {
          if (card.onTurnStart) {
            card.onTurnStart({
              card: card,
              system: system,
              systems: this.systems,
              activePlayer: this.activePlayer,
              players: this.players,
            });
          }
        });
      });

      // Roll the new turn die
      this.rollDie();

      let domain;

      switch (this.dieRoll) {
        case "industry":
          domain = INDUSTRY;
          break;
        case "politics":
          domain = POLITICS;
          break;
        case "science":
          domain = SCIENCE;
          break;
      }

      // If it came up with a domain, draw a card if player has matching system
      if (domain) {
        if (this.playerControlsDomain(this.activePlayer, domain)) {
          this.draw(this.activePlayer, domain);
        }
      }

      this.sync();
    },
    createGame() {
      console.log("Creating a game");
      if (this.hotseatMode) {
        console.log("Entering hotseat mode, game state will not sync")
      }
      this.me = "player1";

      this.decks.politics = this.shuffle(DECK_POLITICS);
      this.decks.industry = this.shuffle(DECK_INDUSTRY);
      this.decks.science = this.shuffle(DECK_SCIENCE);
      this.decks.system = this.shuffle(DECK_SYSTEM);

      const systems = [];
      for (let i = 0; i < 16; i++) {
        systems.push({
          card:
            i === 0 || i === 15
              ? {
                  ...HOMEWORLD,
                  loc: i,
                  controlledBy: i === 0 ? PLAYER_2 : PLAYER_1,
                  explored: false,
                }
              : { ...this.decks.system.pop(), loc: i, controlledBy: null },
          player1: [],
          player2: [],
        });
      }

      systems[0].player2.push({ ...SCOUT, id: this.getNextId() });
      systems[0].card.explored = true;
      systems[15].player1.push({ ...SCOUT, id: this.getNextId() });
      systems[15].card.explored = true;

      this.systems = systems;
      this.showBoard = true;

      this.players.player1.credits++;

      this.sync();
    },
    sync() {
      if (this.$store.state.gameId) {
        console.log("Syncing up");
        this.$socket.emit("sync", {
          id: this.$store.state.gameId,
          state: {
            showCombat: this.showCombat,
            combatSystemLoc: this.combatSystemLoc,
            players: this.players,
            activePlayer: this.activePlayer,
            systems: this.systems,
            discard: this.discard,
            stack: this.stack,
            decks: this.decks,
            dieValue: this.dieValue,
            nextId: this.nextId,
          },
        });
      }
    },
    shuffle(cards) {
      let deck = [...cards];
      let i = 0;
      let j = 0;
      let temp = null;
      for (i = deck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
      }
      return deck;
    },
  },
  mounted() {
    this.$socket.on("sync", (state) => {
      if (this.$store.state.gameId) {
        console.log("Syncing Down");
        if (!state) {
          return this.createGame();
        }
        this.nextId = state.nextId;
        this.showCombat = state.showCombat;
        this.combatSystemLoc = state.combatSystemLoc;
        this.players = {
          player1: {
            credits: state.players.player1.credits,
            hand: state.players.player1.hand.map((card) => ({
              ...mapCard(card),
              contextMenu: [...HAND_CONTEXT_MENU],
            })),
            technology: state.players.player1.technology.map(mapCard),
          },
          player2: {
            credits: state.players.player2.credits,
            hand: state.players.player2.hand.map((card) => ({
              ...mapCard(card),
              contextMenu: [...HAND_CONTEXT_MENU],
            })),
            technology: state.players.player2.technology.map(mapCard),
          },
        };
        this.activePlayer = state.activePlayer;
        this.systems = state.systems.map((system) => ({
          card: mapCard(system.card),
          player1: system.player1.map(mapCard),
          player2: system.player2.map(mapCard),
        }));
        this.discard = state.discard.map((card) => ({
          ...mapCard(card),
          contextMenu: [...DISCARD_CONTEXT_MENU],
        }));
        this.stack = state.stack.map(mapCard);
        this.decks = {
          politics: state.decks.politics.map(mapCard),
          science: state.decks.science.map(mapCard),
          industry: state.decks.industry.map(mapCard),
          system: state.decks.system.map(mapCard),
        };
        this.dieValue = state.dieValue;
      } else {
        this.createGame();
      }
    });

    this.$socket.emit("entered", this.$store.state.gameId);

    EventBus.$on("card:hover", (card) => {
      if (!this.showDiscard) this.hoveredCard = card;
    });

    EventBus.$on("card:context", ({ card, loc, event }) => {
      if (loc !== "hover") this.toggleContextMenu(card, loc, event);
    });
  },
  components: {
    DropZone,
    System,
    Card,
    DamageDice,
    Dialog,
  },
  directives: {
    clickout,
  },
};
</script>

<style lang="postcss" scoped>
.board {
  padding: 1rem;
  background: linear-gradient(
    rgb(41, 40, 40),
    rgb(24, 18, 36),
    rgb(18, 18, 59)
  );
  height: calc(100vh - 175px);
  overflow: hidden;
}

.board-height {
  height: calc(100vh - 175px);
}

.bar {
  width: 300px;
  position: relative;

  & .bar-content {
    position: fixed;
    left: 0;
    width: 300px;
    height: 100vh;
    background: linear-gradient(0.25turn, black, #222);
  }
}

.hand {
  position: fixed;
  bottom: 0;
  width: calc(100% - 300px);
  height: 175px;
  /* overflow-y: scroll; */
  background: black;
}

.context-menu {
  @apply bg-gray-900 text-white rounded;
  position: absolute;
  border: 1px solid white;
}

.next-turn-button {
  @apply absolute p-3 bg-green-900 rounded-lg shadow-md text-white duration-200;
  bottom: 10px;
  right: 10px;

  &:hover {
    @apply bg-green-600;
  }
}

.active-player-stats {
  @apply absolute text-white text-left;
  bottom: 10px;
  left: 10px;
}

.d20 {
  @apply absolute bg-white p-2 rounded-full;
  top: 20px;
  right: 20px;

  & .industry {
    @apply text-red-600;
  }

  & .politics {
    @apply text-blue-600;
  }

  & .science {
    @apply text-green-600;
  }

  & .tax {
    @apply text-yellow-600;
  }

  & .pirates {
    @apply text-black;
  }
}
</style>
