<script setup lang="ts">
import { loginWithGoogle, logout, user } from '@/backend'
</script>
<template>
  <div>
    <button v-if="user" @click="logout">{{ user.username }} se déconnecter</button>
    <button v-else @click="loginWithGoogle">Se connecter avec Google</button>
  </div>
</template>