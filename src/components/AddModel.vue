<script setup>
import { defineEmits, defineProps, ref , watchEffect } from 'vue'
import { NModal, NButton, NCard } from 'naive-ui';

const showModal = ref( false)
const props = defineProps({ show: false })

const emit = defineEmits(); 

const setItemRef = () => {
    emit( 'addTask', 
        {
            'value': 'set',
            "title": '6666',
        }
    )
    close();
}
const close = () => {
    emit('update:show', false);
}

watchEffect(()=>{
    showModal.value = props.show;
}); 
</script>

<template>
  <n-modal 
    :maskClosable="false"
    v-model:show="showModal">
    <n-card 
      style="width: 600px;" 
      :closable="true"
      @close="close"
      :bordered="false" 
      size="huge">
        <template #header>添加信息{{ showModal }}</template>
        <n-button @click="setItemRef">添加</n-button>
    </n-card>
  </n-modal>
</template>

<style scoped>
</style>
