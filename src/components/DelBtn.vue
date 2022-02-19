<template>
    <n-dialog-provider>
        <n-button @click="clickRef" size="small">删除</n-button>
    </n-dialog-provider>
</template>

<script setup>
import { NButton, NDialogProvider, useDialog } from 'naive-ui'
const emit = defineEmits(['delete']);
// props
const props = defineProps({ index: Number })
// add dialog
const dialog = useDialog()
// click
const clickRef = () => {
    dialog.success({
        title: '删除提示？',
        content: '你确定删除该记录？',
        positiveText: '确定',
        negativeText: '不删除',
        maskClosable: false,
        onPositiveClick: () => {
            emit('delete', props.index )
        },
        onNegativeClick: () => {},
    })
}
</script>