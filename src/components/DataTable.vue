<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="10">{{ title }}</v-col>
        <v-col cols="2" class="d-flex justify-end">
          <v-btn
            variant="outlined"
            color="secondary"
            @click="newReg"
            size="small"
            >Novo Cadastro<v-icon icon="mdi-plus-thick" end></v-icon
          ></v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <DataTableSearch
      :fields="filters"
      v-if="showSearch"
      @updateFilter:filter="updateFilter"
    >
    </DataTableSearch>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
      hide-default-footer
      no-data-text="Sem registros para exibir"
      items-per-page="-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td v-if="keys.indexOf('Ativo') >= 0">
            <v-icon
              icon="mdi-circle"
              color="success"
              v-if="item.Ativo"
            ></v-icon>
            <v-icon icon="mdi-circle" color="error" v-else></v-icon>
          </td>
          <td
            v-for="key in keys.filter((x) => x !== 'Ativo' && x !== 'Id')"
            :key="key"
          >
            {{ item[key] }}
          </td>
          <td>
            <DataTableActions
              :id="item.Id"
              :ativo="item.Ativo"
              :showEdit="showEdit"
              :showInactivate="showInactivate"
              :showResetPassword="showResetPassword"
              :showPermission="showPermission"
              @edit:id="edit"
              @inactivate:id="inactivate"
              @resetPassword:id="resetPassword"
              @permissions:id="permissions"
            ></DataTableActions>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-divider></v-divider>
    <DataTableFooter
      :footer="footer"
      @updateFooter:fields="updateFooter"
    ></DataTableFooter>
  </v-card>
</template>

<script>
import DataTableSearch from "./DataTableSearch.vue";
import DataTableFooter from "./DataTableFooter.vue";
import DataTableActions from "./DataTableActions.vue";

export default {
  name: "DataTable",
  components: {
    DataTableSearch,
    DataTableFooter,
    DataTableActions,
  },
  props: {
    showSearch: false,
    items: {
      type: Array,
      required: true,
    },
    filters: {
      type: Array,
      required: true,
    },
    title: "",
    footer: {
      type: Object,
      required: true,
    },
    showEdit: { type: Boolean, required: true, default: false },
    showInactivate: { type: Boolean, required: true, default: false },
    showResetPassword: { type: Boolean, required: false, default: false },
    showPermission: { type: Boolean, required: false, default: false },
  },
  methods: {
    updateFilter(data) {
      this.$emit("updateFilter:filter", data);
    },
    updateFooter(data) {
      this.$emit("updateFooter:fields", data);
    },
    edit(id) {
      this.$emit("edit:id", id);
    },
    inactivate(id) {
      this.$emit("inactivate:id", id);
    },
    resetPassword(id) {
      this.$emit("resetPassword:id", id);
    },
    permissions(id) {
      this.$emit("permissions:id", id);
    },
    newReg() {
      this.$emit("newReg");
    },
  },
  computed: {
    keys() {
      return this.items.length ? Object.keys(this.items[0]) : [];
    },
    headers() {
      var h = this.keys
        .filter((x) => x !== "Id")
        .map((key) => ({
          title: key === "Ativo" ? "" : key,
        }));

      h.push({ title: "Ações" });
      return h;
    },
  },
};
</script>