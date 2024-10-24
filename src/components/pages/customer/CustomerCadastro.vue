<template>
  <v-card>
    <v-card-title>Cadastro de Cliente</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5" @submit.prevent="cadastrar">
        <v-row>
          <v-col cols="12" md="4">
            <v-radio-group
              v-model="cliente.fisicaJuridica"
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
              v-model="cliente.cpfCnpj"
              label="CPF / CNPJ"
              v-mask="cpfCnpjMask"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.apelidoNomeFantasia"
              label="Apelido / Nome Fantasia"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="cliente.nomeRazaoSocial"
              label="Nome / Razão Social"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="cliente.email"
              label="E-mail"
              :rules="emailRules"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="cliente.telefone"
              label="Telefone"
              v-mask="'(##)#####-####'"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="mt-5">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.cep"
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
              v-model="cliente.logradouro"
              label="Logradouro"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="cliente.numero"
              label="Número"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="cliente.complemento"
              label="Complemento"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.bairro"
              label="Bairro"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="cliente.cidade"
              label="Cidade"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field v-model="cliente.estado" label="UF"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" v-if="cliente.clienteID">
            <v-switch
              label="Ativo"
              color="primary"
              v-model="cliente.ativo"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              color="orange"
              class="mr-2"
              @click="this.$router.push('/interno/cliente')"
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
import CustomerService from "@/services/CustomerService";
import ViaCepService from "@/services/ViaCepService";
export default {
  name: "Customer",
  data() {
    return {
      cliente: {
        clienteID: 0,
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
    this.cliente.clienteID = this.$route.params.id ? this.$route.params.id : 0;
    if (this.cliente.clienteID) {
      await this.carregarDadosCliente();
    }
  },
  computed: {
    cpfCnpjMask() {
      if (this.cliente.fisicaJuridica == "F") {
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
        if (this.cliente.clienteID) {
          try {
            await CustomerService.update(this.cliente);
            AlertService.sucesso(
              "Dados alterados com sucesso!",
              "/interno/cliente"
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await CustomerService.add(this.cliente);
            AlertService.sucesso(
              "Cliente cadastrado com sucesso!",
              "/interno/cliente"
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AlertService.erro("Por favor, preencha todos os campos obrigatórios.");
      }
    },
    async carregarDadosCliente() {
      try {
        const response = await CustomerService.getById(this.cliente.clienteID);
        this.cliente = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async consultaCEP() {
      try {
        const response = await ViaCepService.get(
          this.cliente.cep.replace("-", "")
        );
        this.cliente.logradouro = response.data.logradouro;
        this.cliente.bairro = response.data.bairro;
        this.cliente.cidade = response.data.localidade;
        this.cliente.estado = response.data.uf;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>