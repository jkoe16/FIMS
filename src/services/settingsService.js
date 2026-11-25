import { db, unwrap } from '../lib/db';

export const USER_ROLES = { admin: '관리자', maintainer: '정비 담당', inspector: '점검자' };

export async function getSettings() {
  return unwrap(await db().from('system_settings').select('*').eq('id', 1).maybeSingle());
}

export async function updateSettings(values) {
  return unwrap(await db().from('system_settings').update(values).eq('id', 1).select().single());
}

export async function listUsers({ activeOnly = false } = {}) {
  let query = db().from('app_users').select('*').order('is_active', { ascending: false }).order('name');
  if (activeOnly) query = query.eq('is_active', true);
  return unwrap(await query);
}

export async function createUser(values) {
  return unwrap(await db().from('app_users').insert(values).select().single());
}

export async function updateUser(id, values) {
  return unwrap(await db().from('app_users').update(values).eq('id', id).select().single());
}
