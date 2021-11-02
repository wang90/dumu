<script setup>
  import { defineComponent, ref, reactive } from 'vue'
  import { NConfigProvider, NButton,NSpace } from 'naive-ui'
  import { darkTheme } from 'naive-ui'
  import TaskList from './components/TaskList.vue'
  import AddModel from './components/AddModel.vue'

  // 主题部分
  const theme = ref('darkTheme');

  const info = () => {
    showModal.value = false;
  }

  // list 部分
  const list = reactive([])

  const setItemRef = ( __data ) => {
    const { title, value } = __data;
      list.push({
        title,
        value,
    })
  }

  const delItemRef = ( index ) => {
    list.splice( index,1 );
  }

  // 添加信息部分
  const showModal = ref(false)
  const clickModel = () => {
    showModal.value = true;
  }

</script>

<template>
  <n-config-provider :theme="theme">
    <n-card>
      <n-space>
        <n-button @click="clickModel">添加</n-button>
        <div>showModal:{{ showModal }}</div>
      </n-space>
    </n-card>
    <task-list :list="list" @delTask="delItemRef"></task-list>
    <add-model v-model:show="showModal" @addTask="setItemRef"></add-model>
  </n-config-provider>
 
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
