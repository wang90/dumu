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
                <template #header>标签管理</template>
                <tags-tabel></tags-tabel>
        </n-card>
    </n-modal>
</template>

<script setup>
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import { NModal, NCard } from 'naive-ui'
import TagsTabel from '/src/components/TagsTabel.vue'



const showModal = ref( false )
// props
const props = defineProps({ show: false })
// emit
const emit = defineEmits(['update:show']); 

watchEffect(() => {
    showModal.value = props.show;
    console.log(props.show)
})

const closeRef = () => {
    emit('update:show', false )
}



</script>
<style scoped>

</style>