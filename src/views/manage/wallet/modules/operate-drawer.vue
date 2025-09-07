<script setup lang="ts">
import type { Wallet } from "@/constants/t";
import { WalletSchema } from "@/constants/t";
import { useNaiveForm } from "@/hooks/common/form";
import { $t } from "@/locales";
import { insertEndpoints, insertWallet, updateEndpoints, updateWallet } from "@/service/api";
import { computed, ref, watch } from "vue";
import { nanoid } from "~/packages/utils/src";

defineOptions({
  name: "OperateDrawer",
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Wallet | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: "submitted"): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>("visible", {
  default: false,
});

const { formRef, validate, restoreValidation } = useNaiveForm();
// const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: "新增钱包",
    edit: "编辑钱包",
  };
  return titles[props.operateType];
});

const model = ref(createDefaultModel());

function createDefaultModel(): Wallet {
  return WalletSchema.parse({});
}

// type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

// const rules: Record<RuleKey, App.Global.FormRule> = {
//   userName: defaultRequiredRule,
//   status: defaultRequiredRule
// };
const rules = {};

function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === "edit" && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  if (props.operateType === "add") {
    await insertWallet(model.value);
  } else if (props.operateType === "edit") {
    await updateWallet(model.value);
  }
  window.$message?.success($t("common.updateSuccess"));
  closeDrawer();
  emit("submitted");
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
  <NDrawer
    v-model:show="visible"
    display-directive="show"
    :width="360"
    @after-enter="onShow"
  >
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="id" path="id">
          <NInput v-model:value="model.id" disabled />
        </NFormItem>
        <NFormItem label="支付宝" path="alipay">
          <NInput v-model:value="model.alipay" />
        </NFormItem>
        <NFormItem label="微信" path="wechat">
          <NInput v-model:value="model.wechat" />
        </NFormItem>
        <NFormItem label="银联" path="unionpay">
          <NInput v-model:value="model.unionpay" />
        </NFormItem>
        <NFormItem label="现金" path="cash">
          <NInput v-model:value="model.cash" />
        </NFormItem>
        <NFormItem label="股票" path="eastmoney">
          <NInput v-model:value="model.eastmoney" />
        </NFormItem>
        <n-form-item label="公积金" path="fund">
          <n-dynamic-tags v-model:value="model.fund" />
        </n-form-item>
        <n-form-item label="顺风车" path="carpool">
          <n-dynamic-tags v-model:value="model.carpool" />
        </n-form-item>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t("common.cancel") }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{
            $t("common.confirm")
          }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
