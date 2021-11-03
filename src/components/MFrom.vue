<script setup>
import { defineEmits, defineProps, ref, reactive, watchEffect } from 'vue'
import { NButton,NMessageProvider, NInput,NForm , NFormItem} from 'naive-ui';

const formRef = ref(null)
const props = defineProps({ show: false })
const emit = defineEmits();

const formValue = reactive({
    title: '',
    value: '',
    describe: ''
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
    describe: {
        label:'补充信息',
        required: false,
        message: '请输入补充内容',
        trigger: ['input', 'blur']
    },
})

const handleValidateClick = (e) => {
    formRef.value.validate((errors) => {
        if (!errors) {
            console.log("succsess")
            emit('over', formValue )
        } else {
            console.log(errors)
            console.log('error')
        }
    })
}


</script>
<template>

<n-form
    :label-width="80"
    :model="formValue"
    :rules="rules"
    :size="size"
    ref="formRef"
  >
    <n-form-item :label="rules.title.label" path="title">
      <n-input :placeholder="rules.title.message" v-model:value="formValue.title"  />
    </n-form-item>
    <n-form-item :label="rules.value.label" path="value">
      <n-input :placeholder="rules.value.message" v-model:value="formValue.value" />
    </n-form-item>
    <n-form-item :label="rules.describe.label" path="phone">
      <n-input :placeholder="rules.describe.message" v-model:value="formValue.describe" />
    </n-form-item>
    <n-form-item>
      <n-button @click="handleValidateClick" attr-type="button">提交</n-button>
    </n-form-item>
  </n-form>
</template>
<style scoped></style>