<script setup>
import { defineEmits, defineProps, ref, reactive, watchEffect } from 'vue'
import { NLayout, NLayoutHeader, NH2, NLayoutSider, NLayoutFooter } from 'naive-ui';
</script>
<template>
 <n-layout position="absolute">
      <n-layout-header style="height: 64px; padding: 24px;" bordered>
          <slot name="header"></slot>
      </n-layout-header>
      <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px;">
        <n-layout-sider bordered content-style="padding: 24px;">
            <slot name="sider"></slot>
        </n-layout-sider>
        <n-layout content-style="padding: 24px;">
          <slot name="content"></slot>
        </n-layout>
      </n-layout>
      <n-layout-footer
        bordered
        position="absolute"
        style="height: 64px; padding: 24px;">
        <slot name="footer"></slot>
      </n-layout-footer>
    </n-layout>
</template>
<style scoped></style>