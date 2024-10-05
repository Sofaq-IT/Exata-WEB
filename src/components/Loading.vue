<template>
  <v-progress-linear color="secondary" indeterminate v-if="loading"></v-progress-linear>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>