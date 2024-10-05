s<template>
  <v-card>
    <v-card-title>Cadastro de Permissões</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="perfil.descricao"
              label="Descrição"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2>Seções</h2>
          </v-col>
        </v-row>
        <v-divider class="mt-2 mb-2"></v-divider>
        <v-row>
          <v-col cols="3" v-for="s in secoes" :key="s">
            <v-switch
              :label="s.descricao"
              color="primary"
              v-model="s.checked"
              @update:modelValue="
                (checked) => atualizarSecao(s.secaoID, checked)
              "
            ></v-switch>
          </v-col>
        </v-row>        
        <v-row>
          <v-col>
            <h2>Permissões</h2>
          </v-col>
        </v-row>
        <v-divider class="mt-2 mb-2"></v-divider>
        <v-row>
          <v-container>
            <v-expansion-panels color="secondary">
              <v-expansion-panel v-for="c in controllers" :key="c" :title="c">
                <v-expansion-panel-text>
                  <v-table class="w-100">
                    <thead>
                      <tr>
                        <th>Método</th>
                        <th>Controller</th>
                        <th>Action</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="p in permissoes.filter(
                          (x) => x.controller === c
                        )"
                        :key="p.controllerActionID"
                      >
                        <td>{{ p.metodo }}</td>
                        <td>{{ p.controller }}</td>
                        <td>{{ p.action }}</td>
                        <td>
                          <v-switch
                            color="primary"
                            v-model="p.checked"
                            @update:modelValue="
                              (checked) =>
                                atualizarPermissao(
                                  p.controllerActionID,
                                  checked
                                )
                            "
                          ></v-switch>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              color="orange"
              class="mr-2"
              @click="this.$router.push('/interno/perfil')"
              >Voltar</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import ProfileService from "@/services/ProfileService";
export default {
  name: "Profile",
  data() {
    return {
      perfil: {
        perfilID: 0,
        descricao: "",
        ativo: true,
        perfilControllerAction: [],
      },
      permissoes: [],
      secoes: [],
    };
  },
  async created() {
    this.perfil.perfilID = this.$route.params.id ? this.$route.params.id : 0;
    await this.listarSecoes();
    await this.listarPermissoes();    
    await this.carregarDadosPerfil();
  },
  computed: {
    controllers() {
      const items = [];

      this.permissoes.forEach((x) => {
        items.push(x.controller);
      });

      return [...new Set(items)];
    },
  },
  methods: {
    async carregarDadosPerfil() {
      try {
        const response = await ProfileService.getById(this.perfil.perfilID);
        this.perfil = response.data;
        this.marcarPermissoes();
        this.marcarSecoes();
      } catch (err) {
        console.log(err);
      }
    },
    async listarPermissoes() {
      try {
        const response = await ProfileService.listPermissions();
        this.permissoes = response.data;
        this.permissoes.forEach((p) => (p.checked = false));
      } catch (err) {
        console.log(err);
      }
    },
    async marcarSecoes() {
      const secoesMarcadas = this.perfil.perfilSecao.map(
        (p) => p.secaoID
      );

      this.secoes.forEach(
        (p) =>
          (p.checked =
            secoesMarcadas.indexOf(p.secaoID) >= 0
              ? true
              : false)
      );
    },
    async marcarPermissoes() {
      const permissoesConcedidas = this.perfil.perfilControllerAction.map(
        (p) => p.controllerActionID
      );

      this.permissoes.forEach(
        (p) =>
          (p.checked =
            permissoesConcedidas.indexOf(p.controllerActionID) >= 0
              ? true
              : false)
      );
    },
    async atualizarPermissao(controllerActionID, checked) {
      try {
        await ProfileService.updatePermission(
          {
            perfilID: this.perfil.perfilID,
            controllerActionID: controllerActionID,
          },
          checked
        );
      } catch (err) {
        console.log(err);
      }
    },
    async listarSecoes() {
      try {
        const response = await ProfileService.getSections();
        this.secoes = response.data;
        this.secoes.forEach((s) => (s.checked = false));
      } catch (err) {
        console.log(err);
      }
    },
    async atualizarSecao(secaoID, checked) {
      try {
        await ProfileService.updateSection(
          {
            perfilID: this.perfil.perfilID,
            secaoID: secaoID,
          },
          checked
        );
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>