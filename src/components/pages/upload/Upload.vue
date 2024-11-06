<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="12">
          <a
            href="https://pontualmainstorage.blob.core.windows.net/exata/exata-modelo-importacao.xlsx"
          >
            <v-btn variant="outlined" color="grey" size="small">
              Arquivo padrão para Download
              <v-icon icon="mdi-download" end></v-icon>
            </v-btn>
          </a>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">Importações Realizadas</v-col>
        <v-col cols="2" class="d-flex justify-end">
          <v-btn
            variant="outlined"
            color="secondary"
            size="small"
            @click="showCadastro = true"
            >Novo Upload<v-icon icon="mdi-plus-thick" end></v-icon
          ></v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="uploads"
          item-value="uploadID"
          class="elevation-1"
          :items-per-page="-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.cliente.apelidoNomeFantasia }}</td>
              <td>{{ item.nomeArquivoEntrada }}</td>
              <td>
                <a :href="item.urlStorage">
                  <v-btn variant="outlined" color="blue" size="small">
                    Baixar Arquivo
                  </v-btn>
                </a>
              </td>
              <td align="center">{{ item.tamanho }}</td>
              <td align="center">{{ item.qtdeRegistros }}</td>
              <td>
                <v-chip v-if="item.statusAtual === 0" color="primary" outlined
                  >IMPORTADO</v-chip
                >
                <v-chip v-if="item.statusAtual === 1" color="success" outlined
                  >PROCESSADO</v-chip
                >
                <v-chip v-if="item.statusAtual === 2" color="error" outlined
                  >ERRO</v-chip
                >
              </td>
              <td>{{ item.dataCadastroFormatada }}</td>
              <td>
                <v-btn
                  v-if="item.statusAtual === 0"
                  class="ma-2"
                  color="success"
                  size="small"
                  variant="outlined"
                  @click="visualizarDetalhes(item.uploadID)"
                >
                  Visualizar
                  <v-icon icon="mdi-magnify" end></v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
  <v-dialog v-model="showCadastro">
    <v-card>
      <v-card-title>Nova Importação</v-card-title>
      <v-card-text>
        <v-stepper
          hide-actions
          v-model="step"
          :items="['Passo 1 - Upload', 'Passo 2 - Dados Importados']"
        >
          <template v-slot:item.1>
            <v-card flat>
              <v-form ref="formUpload">
                <v-card flat>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-select
                          :items="clientes"
                          item-title="apelidoNomeFantasia"
                          item-value="clienteID"
                          v-model="upload.clienteID"
                          placeholder="Selecione um cliente"
                          :rules="requiredRules"
                          label="Cliente"
                        >
                        </v-select>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-date-input
                          readonly
                          v-model="upload.dataReferencia"
                          label="Data de Referência"
                          prepend-icon=""
                          prepend-inner-icon="$calendar"
                          v-mask="'##/##/####'"
                          :rules="requiredRules"
                        ></v-date-input>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-file-input
                          v-model="file"
                          label="Faça upload aqui do arquivo que deseja importar"
                          prepend-icon="mdi-upload"
                          outlined
                          show-size
                          placeholder="Nenhum arquivo selecionado"
                          :rules="requiredRules"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <!-- Botão Next alinhado à direita -->
                    <v-btn
                      outlined
                      color="blue"
                      @click="validarUpload"
                      :disabled="!file || executingUpload"
                    >
                      <v-icon right>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
              <v-progress-linear
                color="cyan"
                indeterminate
                v-if="executingUpload"
              ></v-progress-linear>
            </v-card>
          </template>

          <template v-slot:item.2>
            <v-card flat>
              <v-card-text>
                <v-data-table
                  :headers="headersUpload"
                  :items="dadosImportados"
                  class="elevation-1"
                  :items-per-page="-1"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td v-for="header in uploadHeaders" :key="header">
                        {{ item[header] }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <!-- Botão Back alinhado à esquerda -->
                <v-btn outlined color="blue" @click="step = 1">
                  <v-icon left>mdi-arrow-left</v-icon>
                </v-btn>

                <v-spacer></v-spacer>

                <!-- Botão Next alinhado à direita -->
                <v-btn outlined color="blue" @click="closeUpload">
                  FINALIZAR PROCESSO
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showDetalhes">
    <v-card>
      <v-card-title>Detalhes da Importação</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headersUpload"
          :items="dadosImportados"
          class="elevation-1"
          :items-per-page="-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td v-for="header in uploadHeaders" :key="header">
                {{ item[header] }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { VDateInput } from 'vuetify/labs/VDateInput'
import axios from "axios";
import store from "@/plugins/store";
import AlertService from "@/plugins/alerts";
import DataTable from "@/components/DataTable.vue";
import UploadService from "@/services/UploadService";
import CustomerService from "@/services/CustomerService";

export default {
  name: "Upload",
  components: {
    DataTable,
    VDateInput
  },
  data() {
    return {
      showCadastro: false,
      showDetalhes: false,
      executingUpload: false,
      step: 1,
      file: null,
      dadosImportados: [],
      requiredRules: [(v) => !!v || "Campo obrigatório"],
      clientes: [],
      upload: {
        clienteID: null,
        dataReferencia: null,
      },
      uploads: [],
      headers: [
        { title: "Cliente" },
        { title: "Arquivo enviado" },
        { title: "Link para download" },
        { title: "Tamanho arquivo (em MB)" },
        { title: "Qtde Registros" },
        { title: "Status atual" },
        { title: "Data Cadastro" },
        { title: "Ações" },
      ],
      uploadHeaders: [],
    };
  },
  methods: {
    async listUploads() {
      try {
        const resp = await UploadService.list();
        this.uploads = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    async listCustomers() {
      try {
        const resp = await CustomerService.listAll();
        this.clientes = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    closeUpload() {
      this.showCadastro = false;
      this.step = 1;
      this.dadosImportados = [];
      this.file = null;
      this.listUploads();
    },
    async validarUpload() {
      const validation = await this.$refs.formUpload.validate();
      if (validation.valid) {
        this.executingUpload = true;
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("uploadDTO", JSON.stringify(this.upload));

        try {
          const response = await axios.post(
            import.meta.env.VITE_API_URL + "/upload/importarArquivo/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + store.state.authToken.token,
              },
            }
          );

          this.uploadHeaders = Object.keys(response.data[0]);
          this.dadosImportados = response.data;
          this.step = 2;
          this.executingUpload = false;
        } catch (error) {
          AlertService.erro("Ocorreu um erro: " + error.message);

          this.executingUpload = false;
        }
      }
    },
    async visualizarDetalhes(uploadID) {
      try {
        const resp = await UploadService.details(uploadID);
        this.dadosImportados = resp.data;
        this.uploadHeaders = Object.keys(resp.data[0]);
        this.showDetalhes = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    await this.listUploads();
    await this.listCustomers();
  },
};
</script>