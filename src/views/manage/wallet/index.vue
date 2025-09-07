<script setup lang="ts">
import { Wallet } from "@/constants/t";
import {
  defaultTransform,
  useNaivePaginatedTable,
  useTableOperate,
} from "@/hooks/common/table";
import { $t } from "@/locales";
import { deleteWallet, selectWallets } from "@/service/api";
import { useAppStore } from "@/store/modules/app";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { NButton, NEllipsis, NPopconfirm } from "naive-ui";
import { h, reactive } from "vue";
import OperateDrawer from "./modules/operate-drawer.vue";

dayjs.extend(weekOfYear);
const appStore = useAppStore();

const searchParams: Api.SystemManage.UserSearchParams = reactive({
  current: 1,
  size: 10,
});

const toFix = (n?: any) => {
  return Number(n || 0).toFixed(1) + "K";
};

const sum = (array: string[]) => {
  return array.reduce((count, it, index, array) => {
    return count + Number(it);
  }, 0);
};

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
} = useNaivePaginatedTable({
  api: () => selectWallets(searchParams),
  transform: (response) => defaultTransform(response),
  onPaginationParamsChange: (params) => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    {
      type: "selection",
      align: "center",
      width: 50,
    },
    {
      key: "id",
      title: "ID",
      width: 100,
      render(rowData, rowIndex) {
        return h(NEllipsis, {}, { default: () => rowData.id });
      },
    },
    {
      key: "sum",
      title: "累计",
      width: 75,
      render: (row) => {
        return toFix(
          Number(row.alipay) +
            Number(row.wechat) +
            Number(row.cash) +
            Number(row.unionpay) +
            Number(row.eastmoney) +
            sum(row.fund) +
            sum(row.carpool),
        );
      },
    },

    {
      key: "created_at",
      title: "时间",
      width: 75,
      render(row) {
        return `${dayjs(row.created_at).week()}周`;
      },
    },
    {
      key: "alipay",
      title: "支付宝",
      width: 75,
      render(rowData, rowIndex) {
        return toFix(rowData.alipay);
      },
    },
    {
      key: "wechat",
      title: "微信",
      width: 75,
      render(rowData, rowIndex) {
        return toFix(rowData.wechat);
      },
    },
    {
      key: "unionpay",
      title: "银联",
      width: 75,
      render(rowData, rowIndex) {
        return toFix(rowData.unionpay);
      },
    },
    {
      key: "cash",
      title: "现金",
      width: 75,
      render(rowData, rowIndex) {
        return toFix(rowData.cash);
      },
    },
    {
      key: "eastmoney",
      title: "股票",
      width: 75,
      render(rowData, rowIndex) {
        return toFix(rowData.eastmoney);
      },
    },
    {
      key: "fund",
      title: "公积金",
      width: 125,
      render: (row) =>
        h(
          NEllipsis,
          {},
          { default: () => `[${row.fund.map((it) => toFix(it)).join(", ")}]` },
        ),
    },
    {
      key: "carpool",
      title: "顺风车",
      width: 125,
      render: (row) =>
        h(
          NEllipsis,
          {},
          {
            default: () => `[${row.carpool.map((it) => toFix(it)).join(", ")}]`,
          },
        ),
    },
    {
      key: "updated_at",
      title: "修改时间",
      width: 100,
      render: (row) => dayjs(row.updated_at).format("YYYY-MM-DD"),
    },
    {
      key: "operate",
      title: "操作",
      align: "center",
      fixed: "right",
      width: 150,
      render: (row: Wallet) => {
        return h("div", { class: "flex-center gap-8px" }, [
          h(
            NButton,
            {
              type: "primary",
              ghost: true,
              text: true,
              onClick: () => edit(row.id),
            },
            { default: () => "编辑" },
          ),
          h(
            NButton,
            {
              type: "success",
              ghost: true,
              size: "small",
              text: true,
              onClick: () => edit(row.id),
            },
            { default: () => "详情" },
          ),
          h(
            NPopconfirm,
            { onPositiveClick: () => handleDelete(row.id) },
            {
              default: () => "确认删除吗？",
              trigger: () =>
                h(
                  NButton,
                  { type: "error", ghost: true, size: "small", text: true },
                  { default: () => $t("common.delete") },
                ),
            },
          ),
        ]);
      },
    },
  ],
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted,
} = useTableOperate(data, "id", getData);

const handleBatchDelete = async () => {
  // request
  console.log(checkedRowKeys.value);
  onBatchDeleted();
};

const handleDelete = async (id: string) => {
  // request
  await deleteWallet({ id });
  onDeleted();
};

const edit = (id: string) => {
  handleEdit(id);
};
</script>

<template>
  <div
    class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto"
  >
    <NCard
      title="钱包列表"
      :bordered="false"
      size="small"
      class="card-wrapper sm:flex-1-hidden"
    >
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        bordered
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="720"
        :loading="loading"
        remote
        :row-key="(row) => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <OperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped>
.one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
