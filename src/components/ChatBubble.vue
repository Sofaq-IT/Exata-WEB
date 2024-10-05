<template>
  <v-row :class="alignClass">
    <v-avatar v-if="!isSender" class="mr-2" size="40">
      <img :src="avatarSrc" :alt="avatarAlt" />
    </v-avatar>
    <v-card class="ma-2" :color="cardColor" :dark="isSender" max-width="75%">
      <v-card-text>
        {{ message }}
      </v-card-text>
    </v-card>
    <v-avatar v-if="isSender" class="ml-2" size="40">
      <img :src="avatarSrc" :alt="avatarAlt" />
    </v-avatar>
  </v-row>  
</template>

<script>
export default {
  name: "ChatBubble",
  props: {
    message: {
      type: String,
      required: true,
    },
    isSender: {
      type: Boolean,
      default: false,
    },
    avatarSrc: {
      type: String,
      default: "",
    },
    avatarAlt: {
      type: String,
      default: "Avatar",
    },
  },
  computed: {
    cardColor() {
      return this.isSender ? "primary" : "grey lighten-3";
    },
    alignClass() {
      return this.isSender
        ? "d-flex justify-end align-center"
        : "d-flex justify-start align-center";
    },
  },
};
</script>
