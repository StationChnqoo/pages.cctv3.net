<script setup lang="ts">
import { h, reactive } from 'vue';
import { NButton, NEllipsis, NPopconfirm, NTag } from 'naive-ui';
import type { ApiEndpoint } from '@/constants/t';
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
      align: 'center'
    },
    // {
    //   key: 'index',
    //   title: '序号',
    //   align: 'center',
    //   width: 50,
    //   render: (_: any, index: number) => index + 1
    // },
    {
      key: 'id',
      title: 'ID',
      align: 'center'
    },
    {
      key: 'introduce',
      title: '简介',
      minWidth: 150,
      render: row => h(NEllipsis, { style: '' }, { default: () => row.introduce })
    },
    {
      key: 'path',
      title: '路径',
      minWidth: 250,
      render: row => h(NEllipsis, {}, { default: () => row.path })
    },
    {
      key: 'host',
      title: '主机',
      minWidth: 100,
      render: row => h(NEllipsis, {}, { default: () => row.host })
    },
    {
      key: 'method',
      title: '方法',
      render: row => h(NTag, { type: 'success' }, { default: () => row.method })
    },
    {
      key: 'request',
      title: '请求体',
      minWidth: 150,
      render: row => h(NEllipsis, { style: '' }, { default: () => row.request })
    },
    {
      key: 'response',
      title: '响应体',
      minWidth: 150,
      render: row => h(NEllipsis, { style: '' }, { default: () => row.response })
    },
    {
      key: 'curl',
      title: '可运行CURL',
      minWidth: 150,
      render: row => h(NEllipsis, { style: '' }, { default: () => row.curl })
    },
    {
      key: 'remarks',
      title: '其他备注',
      minWidth: 150,
      render: row => h(NEllipsis, { style: '' }, { default: () => row.remarks.join('') || '--' })
    },
    {
      key: 'operate',
      title: '操作',
      align: 'center',
      minWidth: 250,
      fixed: 'right',
      render: (row: ApiEndpoint) => {
        return h('div', { class: 'flex-center gap-8px' }, [
          h(
            NButton,
            {
              type: 'primary',
              ghost: true,
              text: true,
              onClick: () => edit(row.id)
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              type: 'success',
              ghost: true,
              size: 'small',
              text: true,
              onClick: () => edit(row.id)
            },
            { default: () => '详情' }
          ),
          h(
            NPopconfirm,
            { onPositiveClick: () => handleDelete(row.id) },
            {
              default: () => '删除',
              trigger: () =>
                h(
                  NButton,
                  { type: 'error', ghost: true, size: 'small', text: true },
                  { default: () => $t('common.delete') }
                )
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

async function handleDelete(id: string) {
  // request
  await deleteEndpoints({ id });
  onDeleted();
}

function edit(id: string) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard title="接口列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="1080"
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

<style scoped>
.one-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
