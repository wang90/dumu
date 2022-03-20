<template>
   <div>Copyright © {{ year }} wang90</div>
</template>
<script setup>
import { ref } from 'vue'
const date = new Date();
const year = ref( date.getFullYear());
</script>
