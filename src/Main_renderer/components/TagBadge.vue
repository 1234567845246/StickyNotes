<template>
<div class="tag-badge">
    <span class="tag-color" :style="{backgroundColor:tag.color}">
    </span>
    <span class="tag-name">
        {{ tag.name }}
    </span>
    <span v-if="count !== undefined" class="tag-count">
        {{ count }}
    </span>
</div>
</template>

<script setup lang="ts">
import { Tag } from '../../type';

defineProps<{tag:Tag;count?:number}>();

</script>


<style lang="css" scoped>
.tag-badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--baseColor-gray0);
  border: 1px solid #eee;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 14px;
  cursor: default;
}

.tag-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.tag-name {
  font-weight: 500;
  color: var(--baseColor-gray6);
}

.tag-count {
  margin-left: 5px;
  color: var(--baseColor-gray4);
  font-size: 12px;
}

</style>