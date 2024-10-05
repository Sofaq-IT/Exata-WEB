<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="6" class="text-center" v-if="enableCamera">
            <v-btn color="primary" @click="openCamera" icon>
              <v-icon>mdi-camera</v-icon>
              <v-tooltip activator="parent" location="bottom">Camera</v-tooltip>
            </v-btn>
          </v-col>
          <v-col :cols="enableCamera ? '6' : '12'" class="text-center">
            <v-btn color="success" @click="openFileDialog" icon>
              <v-icon>mdi-upload</v-icon>
              <v-tooltip activator="parent" location="bottom">Upload</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      style="display: none"
      @change="onFileChange"
    />

    <!-- Dialogo para Captura da Câmera -->
    <v-dialog v-model="cameraDialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Capturar Imagem</span>
        </v-card-title>
        <v-card-text>
          <video ref="video" width="100%" autoplay></video>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeCamera">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="captureImage">
            Capturar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogo para Edição da Imagem (Corte) -->
    <v-dialog v-model="cropDialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Imagem</span>
        </v-card-title>
        <v-card-text class="d-flex justify-center">
          <!-- Ajusta a imagem dentro do modal -->
          <div class="crop-container">
            <img ref="image" :src="capturedImage" class="cropper-image" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="closeCrop"> Cancelar </v-btn>
          <v-btn color="green darken-1" text @click="cropImage">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  props: {
    enableCamera: {
      type: Boolean,
      required: false,
      default: true,
    },
    enableUploadCrop: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      file: null,
      image: null,
      cameraDialog: false,
      cropDialog: false,
      videoStream: null,
      capturedImage: null,
      cropper: null,
    };
  },
  methods: {
    openFileDialog() {
      // Função para abrir o seletor de arquivos
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.capturedImage = reader.result; // Salva a imagem capturada

          if (this.enableUploadCrop)
            this.openCropDialog(); // Abre o diálogo de edição
          else {
            this.image = reader.result;            
            this.uploadImage();
          }
        };
      }
    },
    openCamera() {
      this.cameraDialog = true;
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.videoStream = stream;
          this.$refs.video.srcObject = stream;
        })
        .catch((err) => {
          console.error("Erro ao acessar a câmera: ", err);
        });
    },
    closeCamera() {
      this.cameraDialog = false;
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop());
      }
    },
    captureImage() {
      const canvas = document.createElement("canvas");
      const video = this.$refs.video;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      this.capturedImage = canvas.toDataURL("image/png");
      this.closeCamera();
      this.openCropDialog(); // Abre o diálogo de edição
    },
    openCropDialog() {
      this.cropDialog = true;
      this.$nextTick(() => {
        const imageElement = this.$refs.image;
        this.cropper = new Cropper(imageElement, {
          aspectRatio: 11 / 16, // Define a proporção do corte, você pode ajustar conforme necessário
          viewMode: 2, // Modo de visualização para cobrir o contêiner
          autoCropArea: 1,
          responsive: true, // Responsivo para dispositivos móveis
          background: false,
          movable: true,
          zoomable: true,
          scalable: true,
          cropBoxResizable: true,
          cropBoxMovable: true,
        });
      });
    },
    closeCrop() {
      this.cropDialog = false;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    },
    cropImage() {
      if (this.cropper) {
        const canvas = this.cropper.getCroppedCanvas();
        this.image = canvas.toDataURL("image/png"); // Converte a imagem cortada para base64
        this.closeCrop();
        this.uploadImage();
      }
    },
    uploadImage() {
      this.$emit(
        "saveImage:img",
        this.image.replace(/^data:image\/\w+;base64,/, "")
      );
    },
  },
};
</script>

<style scoped>
.img-preview {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
}

.crop-container {
  max-width: 100%;
  max-height: 400px; /* Limita a altura máxima */
  overflow: hidden;
  margin: 0 auto;
  position: relative; /* Adicionado para ajustes internos */
}

.crop-container img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  display: block;
}
</style>
