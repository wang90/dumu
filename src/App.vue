<script setup>
  import { defineComponent, ref, reactive } from 'vue'
  import { NConfigProvider, NButton, NSpace } from 'naive-ui'
  import { darkTheme } from 'naive-ui'
  import TaskList from './components/TaskList.vue'
  import AddModel from './components/AddModel.vue'
  import Layout from './components/Layout.vue'
  import MFooter from './components/MFooter.vue'

  // 主题部分
  const theme = ref('darkTheme');

  const info = () => {
    showModal.value = false;
  }

const __list = [
  {
    title: 'test',
    value: '12313123',
  }
]
  // list 部分
  const list = reactive(__list)

  const setItemRef = ( __data ) => {
    const { title, value, describe } = __data;
      list.push({
        title,
        value,
        describe,
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
    <Layout>
      <template v-slot:content>
        <task-list 
          :list="list"
          @create="clickModel"
          @delTask="delItemRef"></task-list>
      </template>
      <template v-slot:footer>
       <m-footer></m-footer>
      </template>
      <template v-slot:header>
        <div>欢乐工作开心你我
          <n-button @click="clickModel">添加</n-button>
        </div>
      </template>
      <template v-slot:sider>
        <div>text</div>
      </template>
    </Layout>
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
