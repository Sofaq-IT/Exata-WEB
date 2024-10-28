<template>
  <v-card>
    <v-card-title>Cadastro de Empresa</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5" @submit.prevent="cadastrar">
        <v-row>
          <v-col cols="12" md="4">
            <v-radio-group
              v-model="empresa.fisicaJuridica"
              label="Tipo de Pessoa"
              inline
            >
              <v-radio label="Física" value="F"></v-radio>
              <v-radio label="Jurídica" value="J"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="empresa.cpfCnpj"
              label="CPF / CNPJ"
              v-mask="cpfCnpjMask"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="empresa.apelidoNomeFantasia"
              label="Apelido / Nome Fantasia"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="empresa.nomeRazaoSocial"
              label="Nome / Razão Social"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="empresa.email"
              label="E-mail"
              :rules="emailRules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="empresa.telefone"
              label="Telefone"
              v-mask="'(##)#####-####'"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="mt-5">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="empresa.cep"
              label="CEP"
              v-mask="'#####-###'"
              :rules="[rules.required]"
              @blur="consultaCEP"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10">
            <v-text-field
              v-model="empresa.logradouro"
              label="Logradouro"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="empresa.numero"
              label="Número"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="empresa.complemento"
              label="Complemento"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="empresa.bairro"
              label="Bairro"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="empresa.cidade"
              label="Cidade"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field v-model="empresa.estado" label="UF"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" v-if="empresa.empresaID">
            <v-switch
              label="Ativo"
              color="primary"
              v-model="empresa.ativo"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              color="orange"
              class="mr-2"
              @click="this.$router.push('/interno/empresa')"
              >Voltar</v-btn
            >
            <v-btn variant="outlined" color="secondary" type="submit"
              >Salvar</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import AlertService from "@/plugins/alerts";
import CompanyService from "@/services/CompanyService";
import ViaCepService from "@/services/ViaCepService";
export default {
  name: "Company",
  data() {
    return {
      empresa: {
        empresaID: 0,
        fisicaJuridica: "F",
        cpfCnpj: "",
        nomeRazaoSocial: "",
        apelidoNomeFantasia: "",
        email: "",
        telefone: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        ativo: true,
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
      },
      emailRules: [
        (value) => !!value || "Este campo é obrigatório",
        (value) => /.+@.+\..+/.test(value) || "E-mail inválido",
      ],
    };
  },
  async created() {
    this.empresa.empresaID = this.$route.params.id ? this.$route.params.id : 0;
    if (this.empresa.empresaID) {
      await this.carregarDadosEmpresa();
    }
  },
  computed: {
    cpfCnpjMask() {
      if (this.empresa.fisicaJuridica == "F") {
        return "###.###.###-##";
      } else {
        return "##.###.###/####-##";
      }
    },
  },
  methods: {
    async cadastrar() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        if (this.empresa.empresaID) {
          try {
            await CompanyService.update(this.empresa);
            AlertService.sucesso(
              "Dados alterados com sucesso!",
              "/interno/empresa"
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await CompanyService.add(this.empresa);
            AlertService.sucesso(
              "Empresa cadastrado com sucesso!",
              "/interno/empresa"
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AlertService.erro("Por favor, preencha todos os campos obrigatórios.");
      }
    },
    async carregarDadosEmpresa() {
      try {
        const response = await CompanyService.getById(this.empresa.empresaID);
        this.empresa = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async consultaCEP() {
      try {
        const response = await ViaCepService.get(
          this.empresa.cep.replace("-", "")
        );
        this.empresa.logradouro = response.data.logradouro;
        this.empresa.bairro = response.data.bairro;
        this.empresa.cidade = response.data.localidade;
        this.empresa.estado = response.data.uf;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>