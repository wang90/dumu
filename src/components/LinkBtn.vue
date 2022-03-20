<template>
    <n-message-provider>
        <n-button :bordered="false" 
            @click="clickRef" 
            size="small" class="link-btn">
            <template #icon>
                <n-icon>
                    <ios-link></ios-Link>
                </n-icon>
            </template>
        </n-button>
    </n-message-provider>
</template>

<script setup>
import { NIcon, NButton, NMessageProvider, useMessage } from 'naive-ui'
import { IosLink } from '@vicons/ionicons4'

// props
const props = defineProps({ href: String })
const clickRef = () => {
    window.open( props.href, '_blank');
}

</script>
<style scoped>
.link-btn {
    position: absolute;
}
</style>