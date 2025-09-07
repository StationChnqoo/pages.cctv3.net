import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/systemManage/getAllRoles',
    method: 'get'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/systemManage/getUserList',
    method: 'get',
    params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function selectEndpoints(params?: any) {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/api/endpoints',
    method: 'get',
    params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function insertEndpoints(params?: any) {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/api/endpoints',
    method: 'post',
    data: params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function updateEndpoints(params?: any) {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/api/endpoints',
    method: 'put',
    data: params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function deleteEndpoints(params?: any) {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/api/endpoints',
    method: 'delete',
    params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function selectWallets(params?: any) {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/api/wallet',
    method: 'get',
    params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function insertWallet(params?: any) {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/api/wallet',
    method: 'post',
    data: params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function updateWallet(params?: any) {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/api/wallet',
    method: 'put',
    data: params
  });
}

/**
 *
 * @param params
 * @returns
 */
export function deleteWallet(params?: any) {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/api/wallet',
    method: 'delete',
    params
  });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/systemManage/getMenuList/v2',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}
