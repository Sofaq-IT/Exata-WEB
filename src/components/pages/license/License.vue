<template>
  <v-container>
    <v-card>
      <v-card-title>Dados do Contratante / Licença</v-card-title>
      <v-card-text>
        <v-divider></v-divider>
        <v-row class="mt-2">
          <v-col cols="8">
            <v-text-field
              v-model="licenca.empresa"
              label="Razão Social"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="licenca.cnpj"
              label="CNPJ"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="2">
            <v-row>
              <v-col cols="12">
                <div
                  v-if="contratante.logo"
                  style="border: 2px solid gray; padding: 20px"
                  class="mt-4 w-100"
                >
                  <v-img
                    :src="contratante.logo"
                    max-width="300"
                    class="mt-2 ml-2"
                  ></v-img>
                </div>
                <v-img
                  v-else
                  src="@/assets/no-img.png"
                  class="mt-4 w-100"
                  style="border: 2px solid gray"
                ></v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <ImageUploader
                  @saveImage:img="saveImage"
                  :enableCamera="false"
                  :enableUploadCrop="false"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="10" class="pt-5">
            <v-form class="pt-2" ref="form">
              <v-row>
                <v-col cols="3">
                  <v-text-field
                    v-model="cep"
                    label="CEP"
                    v-mask="'#####-###'"
                    @blur="getCEP"
                  ></v-text-field>
                </v-col>
                <v-col cols="9">
                  <v-text-field
                    v-model="contratante.rua"
                    label="Logradouro"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2">
                  <v-text-field
                    v-model="contratante.numero"
                    label="Número"
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="contratante.bairro"
                    label="Bairro"
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="contratante.complemento"
                    label="Complemento"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="7">
                  <v-text-field
                    v-model="contratante.cidade"
                    label="Cidade"
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="contratante.estado"
                    label="UF"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-5">
                <v-col cols="12" class="d-flex justify-end">
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
  </v-container>
</template>

<script>
import AuthService from "@/services/AuthService";
import ContractorService from "@/services/ContractorService";
import ViaCepService from "@/services/ViaCepService";
import AlertService from "@/plugins/alerts";
export default {
  name: "License",
  data() {
    return {
      licenca: {},
      contratante: {
        id: 0,
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        logo: "",
      },
      cep: "",
    };
  },
  created() {
    this.getLicense();
    this.getContractor();
  },
  methods: {
    async getLicense() {
      try {
        const resp = await AuthService.getLicense();
        this.licenca = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getContractor() {
      try {
        const resp = await ContractorService.getContractor();
        this.contratante = resp.data;
        this.contratante.logo =
          "data:image/png;base64," + this.contratante.logo;
      } catch (error) {
        console.log(error);
      }
    },
    async saveImage(img) {
      try {
        this.contratante.logo = img;
        await ContractorService.updateLogo(this.contratante);
        this.contratante.logo = "data:image/png;base64," + img;
      } catch (err) {
        console.log(err);
      }
    },
    async getCEP() {
      try {
        const resp = await ViaCepService.get(this.cep.replace("-", ""));
        this.contratante.rua = resp.data.logradouro;
        this.contratante.bairro = resp.data.bairro;
        this.contratante.cidade = resp.data.localidade;
        this.contratante.estado = resp.data.uf;
      } catch (error) {
        console.log(error);
      }
    },
    async cadastrar() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        this.contratante.logo = this.contratante.logo.replace(/^data:image\/\w+;base64,/, "");
        await ContractorService.update(this.contratante);
        this.contratante.logo = "data:image/png;base64," + this.contratante.logo;
        AlertService.sucesso("Dados alterados com sucesso!");
      }
    },
  },
};
</script>