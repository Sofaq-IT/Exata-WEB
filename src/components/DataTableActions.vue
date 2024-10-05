<template>
  <v-container>
    <v-row>
      <v-col cols="3" v-if="showEdit"
        ><v-btn color="warning" variant="text" @click="edit">
          <v-icon>mdi-pencil-outline</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >Editar</v-tooltip
          ></v-btn
        ></v-col
      >
      <v-col cols="3" v-if="showResetPassword && ativo"
        ><v-btn color="primary" variant="text" @click="resetPassword">
          <v-icon>mdi-lock-reset</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >Resetar Senha</v-tooltip
          >
        </v-btn></v-col
      >
      <v-col cols="3" v-if="showPermission && ativo"
        ><v-btn color="primary" variant="text" @click="permissions">
          <v-icon>mdi-list-status</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >Vínculos</v-tooltip
          ></v-btn
        ></v-col
      >
      <v-col cols="3" v-if="showInactivate"
        ><v-btn color="red" variant="text" @click="inactivate"
          ><v-icon>mdi-trash-can-outline</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >Excluir</v-tooltip
          ></v-btn
        ></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DataTableActions",
  props: {
    id: { type: String, required: true },
    ativo: { type: Boolean, required: true },
    showEdit: { type: Boolean, required: true, default: false },
    showInactivate: { type: Boolean, required: true, default: false },
    showResetPassword: { type: Boolean, required: false, default: false },
    showPermission: { type: Boolean, required: false, default: false },
  },
  methods: {
    edit() {
      this.$emit("edit:id", this.id);
    },
    inactivate() {
      this.$emit("inactivate:id", this.id);
    },
    resetPassword() {
      this.$emit("resetPassword:id", this.id);
    },
    permissions() {
      this.$emit("permissions:id", this.id);
    },
  },
};
</script>