<template>
  <v-container>
    <v-row>
      <v-col cols="10" offset="1">
        <h2>Chat</h2>
        <v-card class="mt-5">
          <v-card-text class="chatContainer">
            <ChatBubble
              message="Olá, como posso te ajudar hoje?"
              :isSender="true"
              avatar-src="https://randomuser.me/api/portraits/men/75.jpg"
            />
            <ChatBubble
              message="Preciso de informações sobre o seu produto."
              :isSender="false"
              avatar-src="https://randomuser.me/api/portraits/women/75.jpg"
            />
            <ChatBubble
              message="Olá, como posso te ajudar hoje?"
              :isSender="true"
              avatar-src="https://randomuser.me/api/portraits/men/75.jpg"
            />
            <ChatBubble
              message="Preciso de informações sobre o seu produto."
              :isSender="false"
              avatar-src="https://randomuser.me/api/portraits/women/75.jpg"
            />
            <ChatBubble
              message="Olá, como posso te ajudar hoje?"
              :isSender="true"
              avatar-src="https://randomuser.me/api/portraits/men/75.jpg"
            />
            <ChatBubble
              message="Preciso de informações sobre o seu produto."
              :isSender="false"
              avatar-src="https://randomuser.me/api/portraits/women/75.jpg"
            />
            <ChatBubble
              message="Olá, como posso te ajudar hoje?"
              :isSender="true"
              avatar-src="https://randomuser.me/api/portraits/men/75.jpg"
            />
            <ChatBubble
              message="Preciso de informações sobre o seu produto."
              :isSender="false"
              avatar-src="https://randomuser.me/api/portraits/women/75.jpg"
            />
            <ChatBubble
              message="Olá, como posso te ajudar hoje?"
              :isSender="true"
              avatar-src="https://randomuser.me/api/portraits/men/75.jpg"
            />
            <ChatBubble
              message="Preciso de informações sobre o seu produto."
              :isSender="false"
              avatar-src="https://randomuser.me/api/portraits/women/75.jpg"
            />
            <ChatBubble
              message="Olá, como posso te ajudar hoje?"
              :isSender="true"
              avatar-src="https://randomuser.me/api/portraits/men/75.jpg"
            />
            <ChatBubble
              message="Preciso de informações sobre o seu produto."
              :isSender="false"
              avatar-src="https://randomuser.me/api/portraits/women/75.jpg"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" offset="1">
        <v-text-field label="Digite sua mensagem"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn style="height: 55px" color="grey-lighten-2"
          ><v-icon>mdi-send</v-icon>
          <v-tooltip activator="parent" location="right"
            >Enviar</v-tooltip
          ></v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChatBubble from "@/components/ChatBubble.vue";

export default {
  components: {
    ChatBubble,
  },
};
</script>

<style>
.chatContainer {
  height: 650px;
  overflow-y: auto;
  padding: 50px;
}
</style>