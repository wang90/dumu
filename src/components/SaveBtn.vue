<template>
    <n-message-provider>
        <n-button class="save-btn" @click="clickRef" size="small">保存</n-button>
    </n-message-provider>
</template>

<script setup>
import { NIcon, NButton, NMessageProvider, useMessage } from 'naive-ui'
// emit
const emit = defineEmits(['save']);
// props
const props = defineProps({ index: Number });  
// add msg
const message = useMessage()
// click
const clickRef = () => {
    message.success('保存成功')
    emit('save', props.index );
}
</script>
<style scoped>
.save-btn {
    margin-right: 6px;
}
</style>