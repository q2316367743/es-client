import dayjs, { Dayjs } from 'dayjs'

/**
 * 美化数据单位
 *
 * @param {number} value 需要美化的值
 */
export function prettyDataUnit(value: number) {
  let gb = 1024 * 1024 * 1024.0
  if (value > gb) {
    let temp = value / gb
    return temp.toFixed(2) + 'GB'
  }
  let mb = 1024 * 1024.0
  if (value > mb) {
    let temp = value / mb
    return temp.toFixed(2) + 'MB'
  }
  let b = 1024.0
  if (value > b) {
    let temp = value / b
    return temp.toFixed(2) + 'KB'
  }
  return value + 'B'
}

export function prettyDate(date?: number | string | Date) {
  const now = new Date().getTime()
  const old = date ? new Date(date).getTime() : new Date().getTime()
  const diffValue = now - old
  let result: string
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const year = month * 12

  const _year = diffValue / year
  const _month = diffValue / month
  const _week = diffValue / (7 * day)
  const _day = diffValue / day
  const _hour = diffValue / hour
  const _min = diffValue / minute

  if (_year >= 1) result = _year.toFixed(0) + '年前'
  else if (_month >= 1) result = _month.toFixed(0) + '个月前'
  else if (_week >= 1) result = _week.toFixed(0) + '周前'
  else if (_day >= 1) result = _day.toFixed(0) + '天前'
  else if (_hour >= 1) result = _hour.toFixed(0) + '个小时前'
  else if (_min >= 1) result = _min.toFixed(0) + '分钟前'
  else result = '刚刚'
  return result
}

export function generateUUID(): string {
  let d = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = ((d + Math.random() * 16) % 16) | 0
    d = Math.floor(d / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export function isJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function isNull(value?: any): boolean {
  return typeof value === 'undefined' || value === null
}

export function isNotNull(value?: any): boolean {
  return !isNull(value)
}

/**
 * 是否是空字符串
 * @param str
 */
export function isEmptyString(str?: any): boolean {
  if (!str) {
    return true
  }
  if (typeof str !== 'string') {
    return true
  }
  return str.trim() === ''
}

export function isNotEmptyString(str?: string) {
  return !isEmptyString(str)
}

export function isEmptyArray(arr?: Array<any>): boolean {
  if (!arr) {
    return true
  }
  if (!Array.isArray(arr)) {
    return true
  }
  return arr.length === 0
}

export function isNotEmptyArray(arr?: Array<any>): boolean {
  return !isEmptyArray(arr)
}

/**
 * If value is null or undefined, return default value.
 * @param value 检测值
 * @param defaultValue 默认值
 */
export function defaultIfNull<T>(value: T | null | undefined, defaultValue: T): T {
  return value && isNotNull(value) ? value : defaultValue
}

/**
 * If object is null or undefined, return default value.
 * @param value
 * @param attr
 * @param defaultValue
 */
export function ifObjectIsNull<T extends Record<string, any>, A extends T[K], K extends keyof T>(
  value: T | null | undefined,
  attr: K,
  defaultValue: A
): A {
  if (value) {
    return value[attr] ?? defaultValue
  } else {
    return defaultValue
  }
}

export function versionCompare(version1: string, version2: string): number {
  const v1 = version1.split('.').map(Number)
  const v2 = version2.split('.').map(Number)
  for (let i = 0; i < v1.length; i++) {
    if (v1[i] > v2[i]) {
      return 1
    } else if (v1[i] < v2[i]) {
      return -1
    }
  }
  return 0
}

export function isVersionUpdate(
  newVersion: string,
  oldVersion: string,
  minVersion: string
): boolean {
  // 新版本必须大于等于最小版本，旧版本必须小于最小版本
  return versionCompare(newVersion, minVersion) >= 0 && versionCompare(oldVersion, minVersion) < 0
}

/**
 * 获取一个值小于最大值，大于最小值
 */
export function getValueBetween(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * 版本是否小于指定版本
 * @param version 版本
 * @param levels 指定版本
 */
export function versionLess(version: string, ...levels: Array<number>): boolean {
  const v = version.split('.')
  if (!v.length) return false
  for (let i = 0; i < levels.length; i++) {
    if (parseInt(v[i] || '0') < levels[i]) {
      return true
    }
  }
  return false
}

/**
 * 版本是否大于等于指定版本
 * @param version 版本
 * @param levels 指定版本
 */
export function versionGreaterEqual(version: string, ...levels: Array<number>): boolean {
  return !versionLess(version, ...levels)
}

export function toDayOfBegin(day: Dayjs): Dayjs {
  return day.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)
}

export function toDayOfEnd(day: Dayjs): Dayjs {
  return day
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .add(1, 'day')
    .subtract(1, 'second')
}

export function toDateString(
  date: number | string | Date | null | undefined,
  format = 'YYYY-MM-DD HH:mm:ss'
) {
  return dayjs(date).format(format)
}

export function nonNullObj(obj: Record<string, any>) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key]
    }
    if (typeof obj[key] === 'object') {
      nonNullObj(obj[key] as Record<string, any>)
    }
  })
}
