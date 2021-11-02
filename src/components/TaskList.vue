<script setup>
import { defineProps, defineEmits } from 'vue'
import { NCollapse, NButton, NCollapseItem } from 'naive-ui'

const emit = defineEmits();     // 声明触发事件 childClick
const props = defineProps({ list: Array });   

const delItemRef = ( index ) => {
    emit('delTask', index )
}
</script>

<template>
    <n-collapse>
        <n-collapse-item 
            v-for="(item, index ) in props.list"
            :title="item.title" :name="index">
            <div>{{item.value}}</div>
            <n-button @click="delItemRef(index)">删除</n-button>
        </n-collapse-item>
    </n-collapse>
</template>

<style scoped>
</style>
