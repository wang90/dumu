<template>
    <div class="terminal" @click="clickView">
        <CommanHistory></CommanHistory>
        <CommanInput></CommanInput>
        <!-- <CommanOutput></CommanOutput> -->
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import CommanHistory from './components/CommanHistory.vue';
import CommanInput from './components/CommanInput.vue';
// import CommanOutput from './components/CommanOutput.vue';

const clickView =  () => {
    
}

console.log( 'Dumu is start')

</script>
<style>
.terminal {
    padding: 10px;
}
</style>
