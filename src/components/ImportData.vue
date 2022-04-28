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
            <div class="file-box">
                <n-text>
                    输入的文本内容：
                </n-text>
                <n-space class="content">
                    <n-code
                        :code="code"
                        language="javascript"/>
                </n-space>
                <n-space style="justify-content: flex-end;">
                    <n-button class="save-btn"  @click="clicReloadkRef" size="small">重新传入</n-button>  
                    <n-button class="save-btn" @click="clicCancelkRef" size="small">放弃</n-button>
                    <n-button class="save-btn" @click="clickSaveRef" v-show="isUpload" size="small">保存</n-button>
                </n-space>
                <input type="file"
                    @change="getFileRef" 
                    hidden 
                    id="uploadFile" />
            </div>
        </n-card>
    </n-modal>
</template>
<style scoped>
.file-box  .content {
    height: 300px;
    overflow-y: scroll;
}
</style>

<script setup>
import { defineEmits, defineProps, ref, watchEffect,nextTick } from 'vue'
import { NModal,NSpace, NCard, NP ,NText, NIcon, NCode, NButton,useDialog } from 'naive-ui';
import { readFile } from '/src/libs/read-file.ts';
import { cond } from 'lodash';

const showModal = ref( false)
const dialog = useDialog();
const code = ref('暂无内容');
const isUpload = ref(false);
// props
const props = defineProps({ show: false })
// emit
const emit = defineEmits(['updataTask','update:show']); 
// click
const closeRef = () => {
    code.value = '暂无内容';
    isUpload.value = false;
    emit('update:show', false )
}

const clicReloadkRef = () => {
    dialog.success({
        title: '操作提示',
        content: '传错了，需要重新传？',
        positiveText: '是的',
        negativeText: '操作失误',
        maskClosable: false,
        onPositiveClick: () => {
            code.value = '等待新文件...'
            clickChooseFile();
        },
        onNegativeClick: () => {},
    })
}
const clicCancelkRef = () => {
    dialog.success({
        title: '操作提示',
        content: '不想搞了？没有保存哦',
        positiveText: '是的',
        negativeText: '再等等',
        maskClosable: false,
        onPositiveClick: () => {
            closeRef();
        },
        onNegativeClick: () => {},
    })
}
const clickSaveRef = () => {
    dialog.success({
        title: '操作提示',
        content: '搞定了，要更新内容？',
        positiveText: '是的',
        negativeText: '再等等',
        maskClosable: false,
        onPositiveClick: () => {
            console.log( code.value );
            const __value = code.value;
            console.log(__value);
            emit('updataTask', { value: __value });
            closeRef();
        },
        onNegativeClick: () => {},
    })
}

const clickChooseFile = () => {
    console.log('clickChooseFile')
    nextTick(() => {
        const file = document.getElementById('uploadFile');
        file.click();
    })
}
const getFileRef = (e) => {
    const file = e.target.files[0];
    if ( file.type === "application/json" ) {
        readFile( file ).then( text => {
            code.value = text;
            isUpload.value = true;
        }).catch( err => {
            console.log(err);
            code.value = '未传入内容';
            console.log('不行啊')
            isUpload.value = true;
        })
    } else {
        code.value = '未传入内容';
        isUpload.value = true;
        console.log('不行啊')
    }   
}

watchEffect(() => {
    showModal.value = props.show;
    if ( showModal.value === true ) {
        clickChooseFile();
    }
})
</script>
