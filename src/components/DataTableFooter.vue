<template>
  <v-container>
    <v-row class="d-flex justify-end">
      <v-col cols="6" class="mt-5">
        Exibindo
        {{
          footer.RegistrosPorPagina > footer.TotalRegistros
            ? footer.TotalRegistros
            : footer.RegistrosPorPagina
        }}
        de {{ footer.TotalRegistros }} registro(s)
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="fields.qtyItems"
          :items="[5, 10, 25, 50, 100]"
          label="Registros por página"
          @update:modelValue="search"
        ></v-select>
      </v-col>
      <v-col cols="1"></v-col>
      <v-col cols="3" class="mt-5">
        <v-btn
          variant="text"
          icon="mdi-page-first"
          :disabled="!footer.TemAnterior"
          @click="setPage('first')"
        ></v-btn>
        <v-btn
          variant="text"
          icon="mdi-skip-previous"
          :disabled="!footer.TemAnterior"
          @click="setPage('previous')"
        ></v-btn>
        <v-btn
          variant="text"
          icon="mdi-skip-next"
          :disabled="!footer.TemProximo"
          @click="setPage('next')"
        ></v-btn>
        <v-btn
          variant="text"
          icon="mdi-page-last"
          :disabled="!footer.TemProximo"
          @click="setPage('last')"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DataTableFooter",
  props: {
    footer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      fields: {
        qtyItems: 5,
        page: 1,
      },
    };
  },
  methods: {
    search() {
      this.$emit("updateFooter:fields", this.fields);
    },
    setPage(cmd) {
      switch (cmd) {
        case 'first':
          this.fields.page = 1;
          break;
        
        case 'previous':
          this.fields.page = this.footer.PaginaAtual <= 1 ? 1 : this.footer.PaginaAtual - 1;
          break;
        
        case 'next':
          this.fields.page = this.footer.PaginaAtual >= this.footer.TotalPaginas ? this.footer.TotalPaginas : this.footer.PaginaAtual + 1;
          break;
        
        case 'last':
          this.fields.page = this.footer.TotalPaginas;
          break;
        default:
          this.fields.page = 1;
          break;
      }

      this.search();
    },
  },
};
</script>