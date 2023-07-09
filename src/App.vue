<template>
    <div class="terminal">
        <CommanHistory></CommanHistory>
        <CommanInput ref="inputRef"></CommanInput>
        <!-- <CommanOutput></CommanOutput> -->
    </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import CommanHistory from './components/CommanHistory.vue';
import CommanInput from './components/CommanInput.vue';
// import CommanOutput from './components/CommanOutput.vue';

const inputRef = ref(null);
const clickView =  () => {
    inputRef.value.handleFocus();
}

console.log( 'Dumu is start')

onMounted(() => {
    window.addEventListener('click', () => {
        clickView();
    })
})

</script>
<style>
.terminal {
    padding: 10px;
}
</style>
