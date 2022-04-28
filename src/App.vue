<template>
    
    <n-config-provider :theme="theme">
        <n-message-provider>
        <n-dialog-provider>        
        <n-layout position="absolute">
            <n-layout-header bordered position="absolute" style="height: 64px; padding: 24px;">
                <m-header 
                    @show="clickModelRef"
                    @create="clickCreateRef"
                    @share="clickShareRef"></m-header>
            </n-layout-header>
            <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px;">
                <n-layout-sider
                    collapse-mode="width"
                    collapsed-width="5"
                    width="120"
                    show-trigger="arrow-circle"
                    content-style="padding: 24px;"
                    :collapsed="collapsed"
                    @click="updateCollapsed"
                    bordered>
                    <m-sider></m-sider>
                </n-layout-sider>
                <n-layout-content>
                    <task-list 
                        :list="list"
                        @create="clickModelRef"
                        @saveTask="saveTaskRef"
                        @delTask="delItemRef"></task-list>
                </n-layout-content>
            </n-layout>
            <n-layout-footer position="absolute" bordered style="height: 64px; padding: 24px;">
               <m-footer></m-footer>
            </n-layout-footer>
        </n-layout>
        <add-model v-model:show="showModal" @addTask="setItemRef"></add-model>
        <import-data v-model:show="showImport" @updataTask="setReloadRef"></import-data>
        </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>

<script setup>
    import { defineComponent, ref, reactive } from 'vue';
    import exportAnalysisHooks from '/src/libs/create-file';
    import { 
        NSpace, NConfigProvider, NIcon, NButton,
        NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NLayoutSider, 
        NDialogProvider,NMessageProvider,useMessage,
    } from 'naive-ui'
    // components
    import TaskList from './components/TaskList.vue'
    import AddModel from './components/AddModel.vue'
    import ImportData from './components/ImportData.vue'
    import MFooter from './components/MFooter.vue'
    import MHeader from './components/MHeader.vue'
    import MSider from './components/MSider.vue'
    // config
    import { darkTheme } from 'naive-ui'
    import { useStorage } from 'vue3-storage'
    import { NOTE_KEY, SLIDER_KEY } from './config/index'

    // bind storage
    const storage = useStorage()
    const __note_key = NOTE_KEY;
    const __slider_key = SLIDER_KEY;

    // 主题部分
    const theme = ref(darkTheme);

    // default list
    const __list = storage.getStorageSync( __note_key ) || []
    let list = reactive( __list );

    // default sldier collapesed;
    const __collapsed = storage.getStorageSync( __slider_key );
    const collapsed = ref( __collapsed );
    const updateCollapsed = (e) => {
        collapsed.value = !collapsed.value;
        storage.setStorage({
            key: __slider_key,
            data: collapsed.value,
            success:() => {
                console.log(123);
            }
        })
    }

    // click
    const setItemRef = ( __data ) => {
        const { title, value, descript, type } = __data;
        list.push({
            title,
            value,
            descript,
            type,
        })
        storage.setStorage({
            key: __note_key,
            data: list,
            success: ( callback ) => {
                console.log( callback.errMsg );
            }
        })
    }
    const saveTaskRef = ( __json ) => {
        const { index ,value } = __json;
        list[index] = value;
        storage.setStorage({
            key: __note_key,
            data: list,
            success: ( callback ) => {
                console.log(callback.errMsg)
            },
            fail: ( err ) => {
                console.log(err)
            }
        })
    }
    const delItemRef = ( index ) => {
        list.splice( index, 1 )
        storage.setStorage({
            key: __note_key,
            data: list,
            success: ( callback ) => {
                console.log(callback.errMsg)
            }
        });
    }
    const setReloadRef = ( ) => {
        console.log('setReloadRef')
    }

    // 添加信息部分
    const showModal = ref(false);
    const showImport = ref(false);
    const clickModelRef = () => {
        showModal.value = true
    }
    const clickShareRef = () => {
        const __list = storage.getStorageSync( __note_key ) || [];
        const date = new Date();
        exportAnalysisHooks( JSON.stringify(
            {
                name: 'Location Note App',
                date: date,
                data: __list
            }, null, 2 ), `${ date }-导出文件`);
    }
    const clickCreateRef = () => {
        console.log('clickCreateRef')
        showImport.value = true;
    }

</script>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
