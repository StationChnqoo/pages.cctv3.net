<script setup lang="ts">
import { h, reactive } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import { deleteEndpoints, selectEndpoints } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

const appStore = useAppStore();

const searchParams: Api.SystemManage.UserSearchParams = reactive({
  current: 1,
  size: 10
});

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => selectEndpoints(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: '序号',
      align: 'center',
      width: 64,
      render: (_: any, index: number) => index + 1
    },
    {
      key: 'id',
      title: 'ID',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'host',
      title: '服务器',
      align: 'center',
      width: 100
    },
    {
      key: 'path',
      title: '路径',
      align: 'center',
      minWidth: 100
    },
    {
      key: 'method',
      title: '请求方式',
      align: 'center',
      width: 120
    },
    {
      key: 'request',
      title: '请求',
      align: 'center',
      minWidth: 200
    },
    {
      key: 'response',
      title: '响应',
      align: 'center',
      minWidth: 200
    },
    {
      key: 'curl',
      title: 'curl',
      align: 'center',
      minWidth: 200
    },
    {
      key: 'introduce',
      title: '概述',
      align: 'center',
      width: 100
    },
    {
      key: 'remarks',
      title: '注意',
      align: 'center',
      width: 100
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: (row: Api.SystemManage.User) => {
        return h('div', { class: 'flex-center gap-8px' }, [
          h(
            NButton,
            {
              type: 'primary',
              ghost: true,
              size: 'small',
              onClick: () => edit(row.id)
            },
            { default: () => $t('common.edit') }
          ),
          h(
            NPopconfirm,
            { onPositiveClick: () => handleDelete(row.id) },
            {
              default: () => $t('common.confirmDelete'),
              trigger: () =>
                h(NButton, { type: 'error', ghost: true, size: 'small' }, { default: () => $t('common.delete') })
            }
          )
        ]);
      }
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, 'id', getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);
  onBatchDeleted();
}

async function handleDelete(id: number) {
  // request
  await deleteEndpoints({ id });
  onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
