<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ApiEndpoint } from '@/constants/t';
import { ApiEndpointSchema } from '@/constants/t';
import { insertEndpoints, updateEndpoints } from '@/service/api';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { nanoid } from '~/packages/utils/src';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: ApiEndpoint | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
// const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增接口',
    edit: '编辑接口'
  };
  return titles[props.operateType];
});

const model = ref(createDefaultModel());

function createDefaultModel(): ApiEndpoint {
  return ApiEndpointSchema.parse({});
}

// type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

// const rules: Record<RuleKey, App.Global.FormRule> = {
//   userName: defaultRequiredRule,
//   status: defaultRequiredRule
// };
const rules = {};

function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  if (props.operateType === 'add') {
    await insertEndpoints(model.value);
  } else if (props.operateType === 'edit') {
    await updateEndpoints(model.value);
  }
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

const onShow = () => {
  if (model.value.id) {
    // request
  } else {
    model.value.id = nanoid(11);
  }
};

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="540" @after-enter="onShow">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="id" path="id">
          <NInput v-model:value="model.id" disabled />
        </NFormItem>
        <NFormItem label="描述" path="introduce">
          <NInput v-model:value="model.introduce" type="textarea" />
        </NFormItem>
        <NFormItem label="主机" path="host">
          <NInput v-model:value="model.host" />
        </NFormItem>
        <NFormItem label="路径" path="path">
          <NInput v-model:value="model.path" />
        </NFormItem>
        <NFormItem label="方法" path="method">
          <NRadioGroup v-model:value="model.method" name="radiogroup">
            <NSpace>
              <NRadio v-for="(item, index) in ['GET', 'POST', 'PUT', 'DELETE']" :key="index" :value="item">
                {{ item }}
              </NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="请求（Request）" path="request">
          <NInput v-model:value="model.request" type="textarea" />
        </NFormItem>
        <NFormItem label="响应（Response）" path="response">
          <NInput v-model:value="model.response" type="textarea" />
        </NFormItem>
        <NFormItem label="CURL" path="curl">
          <NInput v-model:value="model.curl" type="textarea" />
        </NFormItem>
        <NFormItem label="其他注意事项" path="remarks">
          <NDynamicInput v-model:value="model.remarks" preset="pair" key-placeholder="键" value-placeholder="值" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
