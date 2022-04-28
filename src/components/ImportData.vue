<template>
    <n-modal 
        :maskClosable="true"
        v-model:show="showModal">
        <n-card 
            style="width: 600px;" 
            :closable="true"
            @close="closeRef"
            :bordered="false" 
            size="huge">
            <template #header>上传文件</template>
            <div>
                <input type="file"
                    @change="getFileRef"  
                    hidden
                    ref="uploadFile" />
            </div>
        </n-card>
    </n-modal>
</template>

<script setup>
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import { NModal, NCard,NUpload, NUploadDragger, NP ,NText, NIcon } from 'naive-ui';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import { readFile } from '/src/libs/read-file.ts';

const showModal = ref( false)
const uploadFile = ref( null );
// props
const props = defineProps({ show: false })
// emit
const emit = defineEmits(['addTask','update:show']); 
// click
const setItemRef = ( __data ) => {
    const { title, value, descript,type } = __data
    emit('addTask', {
        value,
        title,
        descript,
        type,
    })
    closeRef()
}
const closeRef = () => {
    emit('update:show', false )
}

const clickChooseFile = () => {
    console.log('clickChooseFile')
    console.log(uploadFile)
    // console.log(uploadFile);
    // uploadFile.value.value.click();
}
const getFileRef = (e) => {
    console.log(e)
}

watchEffect(() => {
    showModal.value = props.show;
    console.log( showModal )
    if ( showModal.value === true ) {
        clickChooseFile();
    }
})
</script>
