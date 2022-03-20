<template>
    <n-data-table
        :key="( row ) => row.key"
        :columns="columns"
        :data="props.list"
        :pagination="pagination"
        row-class-name="table-row-class">
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
import { defineProps, h, defineEmits, reactive, ref } from 'vue'
import { NButton, NEmpty, NInput, NDialogProvider , useMessage, NIcon, NDataTable, } from 'naive-ui'
import CopyBtn from '/src/components/CopyBtn.vue'
import LinkBtn from '/src/components/LinkBtn.vue'
import DelBtn from '/src/components/DelBtn.vue'
import SaveBtn from '/src/components/SaveBtn.vue'
// emit
const emit = defineEmits([ 'delTask', 'create', 'saveTask' ])  // 声明触发事件 childClick
// props
const props = defineProps({ list: Array })
// click
const delItemRef = ( index ) => {
    emit('delTask', index )
}
const createItemRef = () => {
    emit( 'create', true )
}
const saveItemRef = ( index ) => {
    const __item =  props.list[index];
    emit( 'saveTask', {
        index: index,
        value: __item,
    })
}
// var
const pagination = ref(false);
const columns = reactive([
    {
        title: '标题',
        key: 'title',
        render ( row, index ) {
            return [
                h( NInput, {
                    value: row.title,
                    onUpdateValue( v ) {
                        props.list[index].title = v;
                    },
                }),
            ];
        }
    },
    {
        title: '内容',
        key: 'value',
        render ( row, index ) {
            const type = row.type;
            const btns = []
            if ( type === 'text' ) {
                btns.push(
                    h( NInput, {
                        value: row.value,
                        style: {
                            width: '90%'
                        },
                        onUpdateValue( v ) {
                            props.list[index].value = v;
                        },
                    })
                )
                btns.push(
                    h( CopyBtn, {
                        value: row.value,
                    })
                )
            } else {
                btns.push(
                    h( NInput, {
                        value: row.value,
                        style: {
                            width: '90%'
                        },
                        onUpdateValue( v ) {
                            props.list[index].value = v
                        },
                    })
                )
                btns.push(
                    h( LinkBtn, {
                        href: row.value,
                    })
                )
            }
            return btns;
        }
    },
    {
        title: '补充信息',
        key: 'descript',
        render ( row, index ) {
            return [
                h( NInput, {
                    value: row.descript,
                    onUpdateValue( v ) {
                        props.list[index].descript = v
                    },
                }),
            ]
        },
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
</script>


