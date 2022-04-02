<template>
  <div>
    <v-card v-if="!comments || !comments.length" tile flat>
      <v-card-text>
        <span class="secondary--text"
          >No se han agregado comentarios a esta reparación.</span
        >
      </v-card-text>
    </v-card>
    <div v-else>
      <commentCard
        v-for="(comment, index) in comments"
        :key="index"
        :comment="comment"
      ></commentCard>
    </div>
  </div>
</template>

<script>
import commentCard from "./commentCard.vue";

export default {
  name: "commentsList",

  props: {
    comments: { type: Array, default: null },
  },

  components: {
    commentCard,
  },
};
</script>
