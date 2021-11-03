<script setup>
import { defineProps, defineEmits } from 'vue'
import { NButton, NList, NListItem, NThing, NResult  } from 'naive-ui'

const emit = defineEmits();     // 声明触发事件 childClick
const props = defineProps({ list: Array });   

const delItemRef = ( index ) => {
    emit('delTask', index )
}
const createItem = () => {
    emit('create', true )
}
</script>

<template>
    <n-list>
        <n-list-item 
            v-for="( item, index ) in props.list" :name="index">
            <n-thing 
                :title="item.title" 
                :title-extra="item.value" 
                :description="item.descrip">
            </n-thing>
            <template #suffix>
                <n-button @click="delItemRef(index)">删除</n-button>
            </template>
        </n-list-item>
    </n-list>
    <n-result v-show="props.list.length === 0" status="404" title="列表空空" description="生活总归带点荒谬">
        <template #footer>
            <n-button @click="createItem">去添加</n-button>
        </template>
    </n-result>
</template>

<style scoped>
</style>
