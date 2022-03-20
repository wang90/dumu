<template>
    <div class="m-header">
        <div>
            <span>{{ datetime }}</span>
            <span>{{ timestamp }}</span>
        </div>
        <n-button @click="clickRef" :bordered="false">
            <template #icon>
                <n-icon>
                    <ios-add-circle></ios-add-circle>
                </n-icon>
            </template>
        </n-button>
    </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import { NIcon, NButton } from 'naive-ui'
import { IosAddCircle } from '@vicons/ionicons4'
import { DoubleNumber } from '/src/libs/number';
// emit
const emit = defineEmits(['show'])
// click
const clickRef = () => {
    emit('show', true)
}

const date = new Date();
const __weeks = ['日','一','二','三','四','五','六']
const datetime = ref(` ${ date.getFullYear() } 年 ${ date.getMonth() + 1 } 月 ${ date.getDate() }日 星期${ __weeks[ date.getDay() ]} `)
const timestamp = ref(null);
setInterval(() => {
    const __date = new Date();
    timestamp.value = `${ DoubleNumber( __date.getHours()) }:${ DoubleNumber( __date.getMinutes()) }`;
}, 500 );

</script>
<style scoped>
.m-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
