<template>
    <n-message-provider>
        <n-button :bordered="false" 
            @click="clickRef" 
            size="small" class="copy-btn">
            <template #icon>
                <n-icon>
                    <md-copy></md-copy>
                </n-icon>
            </template>
        </n-button>
    </n-message-provider>
</template>

<script setup>
import { NIcon, NButton, NMessageProvider, useMessage } from 'naive-ui'
import { MdCopy } from '@vicons/ionicons4'
import { copyText } from 'vue3-clipboard'

// props
const props = defineProps({ value: String })
// add msg
const message = useMessage()
// click
const clickRef = () => {
    copyText( props.value , undefined, ( error, event ) => {
        if ( error ) {
            message.error('复制失败')
        } else {
            message.success('复制成功')
        }
    })
}



</script>
<style scoped>
.copy-btn {
    position: absolute;
}
</style>