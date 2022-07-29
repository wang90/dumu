<template>
    <div class="common-input comman-line">
        <UserName></UserName>
        <input class="common-input comman-text" 
            type="text"
            ref="input"
            @keydown.enter="entry"
            @input="input" 
            v-model="value" />
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import UserName from './UserName.vue';
import { CommanStore } from '../stores/CommanStore';
const CommonList = CommanStore();
const value = ref();
const entry = () => {
    let inputText = value.value;
    console.log( inputText );
    CommonList.input( inputText );
    value.value = '';
}
const input = () => {
    // console.log( value.value);
}


</script>

<style>
</style>