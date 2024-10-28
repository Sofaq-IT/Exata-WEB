<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app width="300">
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-app-bar-nav-icon
              @click.stop="
                drawer = false;
                mini = true;
              "
            ></v-app-bar-nav-icon>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item
            link
            v-for="item in items"
            :key="item.title"
            @click="navigate(item.link)"
            class="menu-item"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer v-model="mini" app width="60">
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-app-bar-nav-icon
              @click.stop="
                drawer = true;
                mini = false;
              "
            >
            </v-app-bar-nav-icon>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item
            link
            v-for="item in items"
            :key="item.title"
            @click="navigate(item.link)"
            class="menu-item"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
              <v-tooltip activator="parent" location="right">{{
                item.title
              }}</v-tooltip>
            </template>
          </v-list-item>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Seja bem vindo ao Sistema Exata!</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch
        label="Tema Escuro"
        color="secondary"
        class="mt-5"
        v-model="isDark"
        @change="changeTheme"
      ></v-switch>
      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
        <v-tooltip activator="parent" location="bottom"
          >Sem notificações</v-tooltip
        >
      </v-btn>
      <v-btn icon @click="dadosCadastrais = true">
        <v-avatar v-if="logo" class="ml-2" size="40">
          <img :src="logo" />
        </v-avatar>
        <v-icon v-else>mdi-account</v-icon>
        <v-tooltip activator="parent" location="bottom"
          >Meus dados cadastrais</v-tooltip
        >
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
        <v-tooltip activator="parent" location="bottom">Sair</v-tooltip>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <Loading :loading="loading" />
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-dialog v-model="dadosCadastrais" width="720">
      <FormDadosCadastrais
        @fechar="dadosCadastrais = false"
        @abrirAlteracaoSenha="
          dadosCadastrais = false;
          showUpdatePassword = true;
        "
      />
    </v-dialog>

    <v-dialog v-model="showUpdatePassword" width="720"
      ><FormAlteracaoSenha @fechar="showUpdatePassword = false"
    /></v-dialog>
  </v-app>
</template>

<script>
import UserService from "@/services/UserService";
import ApiService from "@/plugins/api";
import Loading from "@/components/Loading.vue";
import FormDadosCadastrais from "@/components/FormDadosCadastrais.vue";
import FormAlteracaoSenha from "@/components/FormAlteracaoSenha.vue";
import { mapState } from "vuex";
import store from "@/plugins/store";
export default {
  components: {
    Loading,
    FormDadosCadastrais,
    FormAlteracaoSenha,
  },
  data() {
    return {
      drawer: false,
      mini: true,
      items: [
        { title: "Dashboard", icon: "mdi-monitor-dashboard", link: "/interno/dashboard" },
        { title: "Clientes", icon: "mdi-home-group", link: "/interno/cliente" },
        { title: "Empresas", icon: "mdi-home-silo-outline", link: "/interno/empresa" },
        {
          title: "Usuários",
          icon: "mdi-account-group",
          link: "/interno/usuario",
        }
      ],
      dadosCadastrais: false,
      showUpdatePassword: false,
      logo: "",
    };
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    },
    async changeTheme() {
      if (this.isDark) store.dispatch("setLight");
      else store.dispatch("setDark");
      try {
        await UserService.updateTheme({
          userName: store.state.authToken.userName,
          tema: this.isDark ? "dark" : "light",
        });
      } catch (err) {
        console.log(err);
      }
    },
    async logout() {
      await ApiService.logout();
    },
  },
  computed: {
    ...mapState(["loading"]),
    ...mapState(["isDark"]),
  },
  mounted() {
    if (store.state.authToken.avatar)
      this.logo = "data:image/png;base64," + store.state.authToken.avatar;
  },
};
</script>

<style scoped>
img {
  object-fit: cover; /* Mantém a proporção da imagem */
  width: 100%; /* Faz a imagem ocupar todo o espaço disponível */
  height: 100%; /* Faz a imagem ocupar todo o espaço disponível */
}
</style>