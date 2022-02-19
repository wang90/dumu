<template>
    <n-form
        :label-width="80"
        :model="formValue"
        :rules="rules"
        :size="size"
        ref="formRef">
        <n-form-item :label="rules.title.label" path="title">
            <n-input :placeholder="rules.title.message" v-model:value="formValue.title"  />
        </n-form-item>
        <n-form-item :label="rules.value.label" path="value">
            <n-input :placeholder="rules.value.message" v-model:value="formValue.value" />
        </n-form-item>
        <n-form-item :label="rules.descript.label" path="phone">
            <n-input :placeholder="rules.descript.message" v-model:value="formValue.descript" />
        </n-form-item>
        <n-form-item>
            <n-button @click="handleValidateClick" attr-type="button">提交</n-button>
        </n-form-item>
    </n-form>
</template>

<script setup>
import { defineEmits, defineProps, ref, reactive, watchEffect } from 'vue'
import { NButton, NInput, NForm , NFormItem } from 'naive-ui'
// props
const props = defineProps({ show: false })
// emit
const emit = defineEmits(['over'])
// var 
const formRef = ref(null)
const size = ref('medium')
const formValue = reactive({
    title: '',
    value: '',
    descript: '',
})
const rules = reactive({
    title: {
        label: '标题',
        required: true,
        message: '请输入标题',
        trigger: ['input', 'blur']
    },
    value: {
        label: '内容',
        required: true,
        message: '请输入内容',
        trigger: ['input', 'blur']
    },
    descript: {
        label:'补充信息',
        required: false,
        message: '请输入补充内容',
        trigger: ['input', 'blur']
    },
})
// click
const handleValidateClick = ( e ) => {
    formRef.value.validate((errors) => {
        if (!errors) {
            emit('over', formValue )
        } else {
            console.log(errors)
            console.log('error')
        }
    })
}
</script>