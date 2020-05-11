<template>
  <draggable
    v-model="_list"
    :group="group"
    ghost-class="ghost"
    chosen-class="chosen"
    drag-class="drag"
    @end="$emit('end', $event)"
  >
    <div
      role="card-list"
      class="list-group-item"
      v-for="element in list"
      :key="element.id"
    >
      &nbsp;
      <div class="relative">
        <Card :class="cardClass" :card="element" :loc="loc" :combat="combat" />
        <DamageDice v-if="element.damage" :damage="element.damage" :showNumber="cardClass.includes('xs')" />
      </div>
    </div>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
import Card from '@/components/Card/Card'
import DamageDice from '@/components/Dice/DamageDice'

export default {
  name: "dropzone",
  display: "DropZone",
  props: {
    list: {
      type: Array,
      default: () => []
    },
    group: {
      type: String,
      default: "default"
    },
    cardClass: {
      type: String,
      default: ""
    },
    loc: {
      type: Number,
      default: 0
    },
    combat: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _list: {
      get() {
        return this.list
      },
      set(list) {
        this.$emit("update:list", list)
      }
    }
  },
  components: {
    draggable,
    Card,
    DamageDice
  },
};
</script>

<style lang="postcss" scoped>
.list-group-item {
  display: inline-flex;
  flex-direction: column;
  height: 350px;
}
.ghost {
  opacity: 0.5;
}
.chosen {
  opacity: 0.5;
}
.drag {
  opacity: 0.5;
}
</style>
