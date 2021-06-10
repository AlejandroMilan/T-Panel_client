<template>
  <div>
    <span
      v-if="!comments || !comments.length"
      class="text-body-1 text--secondary"
      >No se han agregado comentarios a esta reparación.</span
    >
    <div v-else>
      <v-card
        v-for="(comment, index) in comments"
        :key="index"
        outlined
        class="mb-2"
      >
        <div>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ comment.author.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                fullDate(comment.date)
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
        <v-card-text>{{ comment.content }}</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { getFullDateWithHour } from "@/helpers/date.helper";

export default {
  name: "commentsList",

  props: {
    comments: { type: Array, default: null },
  },

  methods: {
    fullDate(isoDate) {
      return getFullDateWithHour(isoDate);
    },
  },
};
</script>
