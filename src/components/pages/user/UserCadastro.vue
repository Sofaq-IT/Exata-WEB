<template>
  <v-card>
    <v-card-title>Cadastro de Usuário</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="3" v-if="usuario.id">
          <v-row>
            <v-col cols="12">
              <!-- Imagem de Pré-visualização -->
              <v-img
                v-if="usuario.usuarioAvatar && usuario.usuarioAvatar.avatar"
                :src="usuario.usuarioAvatar.avatar"
                max-width="300"
                style="border: 2px solid gray"
                class="mt-2 ml-2"
              ></v-img>
              <v-img
                v-else
                src="@/assets/no-user.png"
                max-width="300"
                class="mt-4"
                style="border: 2px solid gray"
              ></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <ImageUploader @saveImage:img="saveImage" />
            </v-col>
          </v-row>
        </v-col>
        <v-col :cols="usuario.id ? '9' : '12'">
          <v-form ref="form" class="mt-5">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="usuario.userName"
                  label="Login"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="usuario.nome"
                  label="Nome"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="usuario.phoneNumber"
                  label="Telefone"
                  v-mask="'(##) #####-####'"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="usuario.email"
                  label="E-mail"
                  :rules="emailRules"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="usuario.perfilID"
                  item-title="descricao"
                  item-value="perfilID"
                  label="Perfil"
                  :items="perfis"
                ></v-select>
              </v-col>
              <v-col cols="6" v-if="usuario.id">
                <v-switch
                  label="Ativo"
                  color="primary"
                  v-model="usuario.ativo"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" v-if="!usuario.id">
                <v-text-field
                  v-model="usuario.senha"
                  label="Senha"
                  :type="showPass ? 'text' : 'password'"
                  :rules="[rules.required, rules.min]"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  counter
                  hint="Mínimo de 8 caracteres"
                  class="mb-3"
                  @click:append="showPass = !showPass"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  variant="outlined"
                  color="orange"
                  class="mr-2"
                  @click="this.$router.push('/interno/usuario')"
                  >Voltar</v-btn
                >
                <v-btn variant="outlined" color="secondary" @click="cadastrar"
                  >Salvar</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import AlertService from "@/plugins/alerts";
import UserService from "@/services/UserService";
import ImageUploader from "@/components/ImageUploader.vue";
export default {
  name: "UserCadastro",
  components: {
    ImageUploader,
  },
  data() {
    return {
      usuario: {
        id: null,
        userName: "",
        email: "",
        phoneNumber: "",
        ativo: true,
        nome: "",
        perfilID: null,
        senha: "",
        usuarioAvatar: {
          avatar: null,
        },
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
        min: (v) => v.length >= 8 || "Mínimo de 8 caracteres",
      },
      perfis: [],
      showPass: false,
    };
  },
  computed: {
    emailRules() {
      return [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
      ];
    },
  },
  created() {
    this.usuario.id = this.$route.params.id;
    if (this.usuario.id) {
      this.carregarDadosUsuario();
    }
    this.listProfiles();
  },
  methods: {
    async cadastrar() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        if (this.usuario.id) {
          try {
            await UserService.update(this.usuario);
            AlertService.sucesso(
              "Dados alterados com sucesso!",
              "/interno/usuario"
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await UserService.add(this.usuario);
            AlertService.sucesso(
              "Usuário cadastrado com sucesso!",
              "/interno/usuario"
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AlertService.erro("Por favor, preencha todos os campos obrigatórios.");
      }
    },
    async carregarDadosUsuario() {
      try {
        const response = await UserService.getById(this.usuario.id);
        this.usuario = response.data;

        if (this.usuario.usuarioAvatar && this.usuario.usuarioAvatar.avatar)
          this.usuario.usuarioAvatar.avatar =
            "data:image/png;base64," + this.usuario.usuarioAvatar.avatar;
      } catch (err) {
        console.log(err);
      }
    },
    async listProfiles() {
      try {
        const response = await UserService.listProfiles();
        this.perfis = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async saveImage(img) {
      try {
        await UserService.updateAvatar({
          login: this.usuario.userName,
          avatar: img,
        });

        if (!this.usuario.usuarioAvatar) {
          this.usuario.usuarioAvatar = {
            avatar: "data:image/png;base64," + img,
          };
        } else
          this.usuario.usuarioAvatar.avatar = "data:image/png;base64," + img;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>