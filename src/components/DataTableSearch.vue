<template>
  <v-expansion-panels color="secondary">
    <v-expansion-panel title="Filtros">
      <v-expansion-panel-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filter.key"
                  :items="filters"
                  item-title="descricao"
                  item-value="campoID"
                  label="Filtrar por"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filter.value"
                  :disabled="!filter.key || filter.key.length <= 0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filter.orderBy"
                  item-title="descricao"
                  item-value="campoID"
                  :items="ordering"
                  label="Ordenar por"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-switch
                  label="Ascendente"
                  color="primary"
                  v-model="filter.asc"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-end">
              <v-col cols="3">
                <v-select
                  v-model="filter.status"
                  item-title="value"
                  item-value="key"
                  :items="statusList"
                  label="Status"
                ></v-select>
              </v-col>
              <v-col cols="6"></v-col>
              <v-col cols="3" class="mt-5">
                <v-btn
                  class="mr-2"
                  @click="clear"
                  variant="outlined"
                  color="secondary"
                  >Limpar</v-btn
                >
                <v-btn @click="search" variant="outlined" color="secondary"
                  >Filtrar</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "DataTableSearch",
  props: {
    fields: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filter: {
        key: "",
        value: "",
        orderBy: "",
        asc: true,
        status: true,
      },
      statusList: [
        { key: null, value: "Todos" },
        { key: true, value: "Ativos" },
        { key: false, value: "Inativos" },
      ],
    };
  },
  methods: {
    search() {
      this.$emit("updateFilter:filter", this.filter);
    },
    clear() {
      this.filter = {
        key: "",
        value: "",
        orderBy: "",
        asc: true,
      };
    },
  },
  computed: {
    filters() {
      return this.fields.filter((x) => x.pesquisa);
    },
    ordering() {
      return this.fields.filter((x) => x.ordena);
    },
  },
};
</script>