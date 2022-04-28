<template>
    <div class="m-header">
        <div>
            <span>{{ datetime }}</span>
            <span>{{ timestamp }}</span>
        </div>
        <div>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-button @click="clickCreateRef" :bordered="false">
                        <template #icon>
                            <n-icon>
                                <ios-add-circle></ios-add-circle>
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <span>导入</span>
            </n-tooltip>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-button @click="clickAddRef" :bordered="false">
                        <template #icon>
                            <n-icon>
                                <ios-add-circle></ios-add-circle>
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <span>新建</span>
            </n-tooltip>
            <n-tooltip trigger="hover">
                <template #trigger>
                    <n-button @click="clickShareRef" :bordered="false">
                        <template #icon>
                            <n-icon>
                                <ios-share-alt></ios-share-alt>
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <span>导出</span>
            </n-tooltip>
        </div>
    </div>
</template>

<script setup>
import { defineComponent, ref, reactive } from 'vue'
import { NIcon, NButton, NTooltip, useDialog } from 'naive-ui'
import { IosAddCircle, IosShareAlt } from '@vicons/ionicons4'
import { DoubleNumber } from '/src/libs/number';

const dialog = useDialog();
// emit
const emit = defineEmits(['show'])
// click
const clickAddRef = () => {
    emit('show', true)
}
const clickShareRef = () => {
    dialog.success({
        title: '友情提示',
        content: '导出文件可能会几秒钟时间，请耐心等待。',
        positiveText: '确定',
        negativeText: '放弃',
        maskClosable: false,
        onPositiveClick: () => {
            emit('share', true);
        },
        onNegativeClick: () => {},
    })
}
const clickCreateRef = () => {
     dialog.success({
        title: '友情提示',
        content: '导入文件会将当前历史文档清除，确定要这么做吗？',
        positiveText: '确定',
        negativeText: '放弃',
        maskClosable: false,
        onPositiveClick: () => {
            console.log('倒入')
            emit('create', true);
        },
        onNegativeClick: () => {},
    })
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
