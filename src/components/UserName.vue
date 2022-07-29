<template>
    <span class="user-name">[{{ User.host }}]</span>
</template>
<script setup lang="ts">
import { UseInfoStore } from '../stores/UserInfoStore';
const User = UseInfoStore();

</script>
