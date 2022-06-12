<template>
    <n-data-table
      :bordered="false"
      :single-line="true"
      :columns="columns"
      :data="list"
      :pagination="pagination"> 
        <template #empty>
            <n-empty description="列表空空">
                <template #extra>
                    <n-button size="small"  
                        @click="createItemRef">去添加</n-button>
                </template>
            </n-empty>
        </template>
    </n-data-table>
</template>
<script setup>
import { defineEmits, h, defineProps, ref, reactive, watchEffect } from 'vue'
import { NButton, NEmpty, NInput, NDialogProvider , useMessage, NIcon, NDataTable, } from 'naive-ui'
import DelBtn from '/src/components/DelBtn.vue'
import SaveBtn from '/src/components/SaveBtn.vue'
import { TAG_KEY } from '../config/index';
import { useStorage } from 'vue3-storage'

const __tags_key = TAG_KEY;
console.log(__tags_key)

// default list
const storage = new useStorage();
// const __list = storage.getStorageSync( __tags_key ) || []

const __list = [
    { title: 'test'}
]
let list = reactive( __list );


const pagination = ref(false);
const columns = reactive([
    {
        title: '标签名',
        key: 'title',
        render ( row, index ) {
            return [
                h( NInput, {
                    value: row.title,
                    onUpdateValue( v ) {
                        list[index].title = v;
                    },
                }),
            ];
        }
    },
    {
        title: 'Action',
        key: 'actions',
        render ( row, index ) {
            const actions = [
                h( SaveBtn, {
                    index: index,
                    onSave: ( index ) => {
                        saveItemRef( index );
                    }
                }),
                h( DelBtn, {
                    index: index,
                    onDelete: ( index ) => {
                        delItemRef( index );
                    }
                }),
            ];
            return actions
        }
    },
])


const delItemRef = ( index ) => {
    list.splice( index, 1 )
    updateStroge();
}
const createItemRef = () => {
    list.push({
        title: '',
    })
}
const saveItemRef = ( index ) => {
    list.push({
        title: '',
    })
    updateStroge();
}

const updateStroge = () => {
    console.log(list)
    const __value = list.value;
    console.log(__tags_key);
    console.log(__value)

    storage.setStorage({
        key: __tags_key,
        data: __value,
        success: ( callback ) => {
            console.log( callback.errMsg )
        },
        fail: ( err ) => {
            console.log(err)
        }
    })
}




</script>
