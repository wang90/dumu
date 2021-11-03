<script setup>
import { defineEmits, defineProps, ref, reactive, watchEffect } from 'vue'
import { NModal, NButton, NCard} from 'naive-ui';
import MFrom from './MFrom.vue';

const showModal = ref( false)
const props = defineProps({ show: false })
const emit = defineEmits(); 

const setItemRef = ( __data ) => {
    const { title, value, describe } = __data;
    emit( 'addTask', {
        value,
        title,
        describe,
    })
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
        <m-from @over="setItemRef"></m-from>
    </n-card>
  </n-modal>
</template>

<style scoped>
</style>
