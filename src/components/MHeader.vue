<template>
    <div class="m-header">
        <div>text</div>
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
import { IosAddCircle } from '@vicons/ionicons4';

const emit = defineEmits(['show']); 
const clickRef = () => {
    emit('show', true);
}

</script>
<style scoped>
.m-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
