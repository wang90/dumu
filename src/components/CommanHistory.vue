<template>
    <div class="common-history">
        <div class="comman-line " 
            v-for="( common, index ) in CommonList.list">
            <div v-if="common.type==='common'">
                <UserName></UserName>
                <span class="comman-text">{{ common.comman }}</span>
            </div>
            <div class="comman-text" v-else-if="common.type==='text'">
                <span>{{ common.comman }}</span>
            </div>
            <div class="comman-text" v-else-if="common.type==='table'">
               <span>{{ common.comman }}</span>
            </div>
           
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, reactive } from 'vue';
import UserName from './UserName.vue';
import { CommanStore } from '../stores/CommanStore';
const CommonList = CommanStore();

</script>


<style>

</style>