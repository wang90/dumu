<template>
    <n-modal 
        :maskClosable="false"
        v-model:show="showModal">
        <n-card 
            style="width: 600px;" 
            :closable="true"
            @close="closeRef"
            :bordered="false" 
            size="huge">
                <template #header>添加信息</template>
                <m-from @over="setItemRef"></m-from>
        </n-card>
    </n-modal>
</template>

<script setup>
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import { NModal, NCard } from 'naive-ui'
import MFrom from './MFrom.vue'

const showModal = ref( false)
// props
const props = defineProps({ show: false })
// emit
const emit = defineEmits(['addTask','update:show']); 
// click
const setItemRef = ( __data ) => {
    const { title, value, descript } = __data
    emit('addTask', {
        value,
        title,
        descript,
    })
    closeRef()
}
const closeRef = () => {
    emit('update:show', false )
}

watchEffect(() => {
    showModal.value = props.show
})
</script>
