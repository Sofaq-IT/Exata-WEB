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
          <v-col cols="12" md="8" v-if="cliente.clienteID > 0">
            <v-alert color="secondary">
              Já existe um cliente em nossa base de dados com o CPF/CNPJ
              informado.<br />
              Nesse caso, não é possível alterar os dados do cliente.<br />
              Ao salvar, será criado um vínculo entre sua empresa e o cliente e,
              assim você poderá realizar operações para esse cliente.
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.cpfCnpj"
              label="CPF / CNPJ"
              v-mask="cpfCnpjMask"
              :rules="[rules.required]"
              @blur="consultaPorCpfCnpj"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="planos"
              item-title="descricao"
              item-value="id"
              v-model="cliente.plano"
              placeholder="Selecione um plano"
              :rules="requiredRules"
              label="Plano"
              :disabled="perfilID !== 1"
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.apelidoNomeFantasia"
              label="Apelido / Nome Fantasia"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="cliente.nomeRazaoSocial"
              label="Nome / Razão Social"
              :rules="[rules.required]"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="cliente.email"
              label="E-mail"
              :rules="emailRules"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="cliente.telefone"
              label="Telefone"
              v-mask="'(##)#####-####'"
              :disabled="cliente.clienteID > 0"
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
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="10">
            <v-text-field
              v-model="cliente.logradouro"
              label="Logradouro"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="cliente.numero"
              label="Número"
              :rules="[rules.required]"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="cliente.complemento"
              label="Complemento"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="cliente.bairro"
              label="Bairro"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="cliente.cidade"
              label="Cidade"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model="cliente.estado"
              label="UF"
              :disabled="cliente.clienteID > 0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" v-if="cliente.clienteID">
            <v-switch
              label="Ativo"
              color="primary"
              v-model="cliente.ativo"
              :disabled="cliente.clienteID > 0"
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
import store from "@/plugins/store";
import AlertService from "@/plugins/alerts";
import CustomerService from "@/services/CustomerService";
import ViaCepService from "@/services/ViaCepService";
export default {
  name: "Customer",
  data() {
    return {
      perfilID: 0,
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
        plano: 1
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
      },
      emailRules: [
        (value) => !!value || "Este campo é obrigatório",
        (value) => /.+@.+\..+/.test(value) || "E-mail inválido",
      ],
      planos: [
        { id: 1, descricao: "Básico" },
        { id: 2, descricao: "Intermediário" },
        { id: 3, descricao: "Avançado" },
      ],
    };
  },
  async created() {
    this.perfilID = store.state.authToken.perfilID;
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
    async consultaPorCpfCnpj() {
      try {
        const response = await CustomerService.getByCpfCnpj(
          this.cliente.cpfCnpj.replace(/\D/g, "")
        );

        if (response.data) this.cliente = response.data;
        else {
          this.cliente = {
            clienteID: 0,
            fisicaJuridica: this.cliente.fisicaJuridica,
            cpfCnpj: this.cliente.cpfCnpj,
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
            plano: 1
          };
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>