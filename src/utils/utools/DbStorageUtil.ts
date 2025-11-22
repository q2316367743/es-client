import {del, get, set} from 'idb-keyval';
import {parseJsonWithBigIntSupport, stringifyJsonWithBigIntSupport} from "@/algorithm/format";

// 定义

export interface DbDoc extends Record<string, any> {
}

// 对象

export function getItem<T>(key: string): T | null {
  let value = localStorage.getItem(key);
  if (typeof value === 'undefined' || value == null) {
    return null;
  }
  return parseJsonWithBigIntSupport(value).value;

}

export function getItemByDefault<T>(key: string, defaultValue: T) {
  let value = localStorage.getItem(key);
  if (typeof value === 'undefined' || value == null) {
    return defaultValue;
  }
  const target = parseJsonWithBigIntSupport(value);
  return target.value || defaultValue;
}

export function setItem(key: string, value: any) {
  localStorage.setItem(key, stringifyJsonWithBigIntSupport({value: toRaw(value)}));
}

// --------------------------------------- 基础对象 ---------------------------------------

export interface DbList<T> {

  list: Array<T>;

}

export interface DbRecord<T> {

  record: T;

  rev?: string;

}

// --------------------------------------- 列表操作 ---------------------------------------

export async function listByAsync<T>(key: string): Promise<DbList<T>> {
  const res = await get(key);
  if (res) {
    return {
      list: res.value,
    };
  }
  return {list: []};
}

export async function saveListByAsync<T>(key: string, records: Array<T>) {
  await set(key, {value: toRaw(records)});
}

// --------------------------------------- 单一对象操作 ---------------------------------------

export async function getFromOne<T = any>(key: string): Promise<DbRecord<T> | null> {
  const res = await get(key);
  if (!res) {
    return null;
  }
  return Promise.resolve({
    record: res.value,
  });
}

export async function getFromOneByAsync<T extends Record<string, any>>(key: string, record: T): Promise<DbRecord<T>> {
  const res = await get(key);
  if (!res) {
    return {record}
  }
  return Promise.resolve({
    record: Object.assign(record, res.value),
  });
}

export async function saveOneByAsync<T>(key: string, value: T) {
  return set(key, {value: toRaw(value)});
}

export async function removeOneByAsync(key: string): Promise<void> {
  return del(key);
}


// --------------------------------------- 临时存储 ---------------------------------------

export function getStrBySession(key: string): string {
  return sessionStorage.getItem(key) || '';
}

export function setStrBySession(key: string, value: string) {
  sessionStorage.setItem(key, value);
}
