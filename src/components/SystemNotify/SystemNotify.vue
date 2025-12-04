<template>
  <a-badge :count="hasUnread ? 1 : 0" dot>
    <a-button type="text" @click="openDrawer">
      <template #icon>
        <icon-notification />
      </template>
    </a-button>
  </a-badge>

  <a-drawer
    :visible="drawerVisible"
    @cancel="closeDrawer"
    title="系统通知"
    width="500px"
    placement="right"
    :footer="false"
  >
    <div class="notification-drawer">
      <a-list>
        <a-list-item v-for="a in pageItems" :key="a.id" @click="handleItemClick(a)" class="notification-item">
          <a-list-item-meta
            :title="renderTitle(a)"
            :description="a.description"
          />
          <div class="notification-item-footer">
            <span class="publish-date">{{ formatDate(a.published_at) }}</span>
            <a-tag v-if="isUnread(a.id)" color="red" size="small">NEW</a-tag>
          </div>
          <div class="notification-actions">
            <a-button v-if="isUnread(a.id)" size="mini" @click.stop="markAsRead(a.id)">标记已读</a-button>
            <a-button v-if="a.link" type="primary" size="mini" @click.stop="openLink(a)">打开链接</a-button>
          </div>
        </a-list-item>
      </a-list>

      <div class="pagination-wrapper" v-if="total > limit">
        <a-pagination
          :total="total"
          :page-size="limit"
          :current="currentPage"
          @change="handlePageChange"
          size="small"
        />
      </div>
    </div>
  </a-drawer>
</template>

<script lang="tsx" setup>
import {Button, Notification as ArcoNotification} from '@arco-design/web-vue';
import {AnnouncementResponse, getAnnouncements} from './AnnouncementApi';
import {Announcement} from './AnnouncementTypes';
import {openUrl} from "@/utils/BrowserUtil";

const drawerVisible = ref(false);
const currentPage = ref(1);
const offset = ref(0);
const limit = ref(10);
const total = ref(0);
const rawItems = ref<Announcement[]>([]);
const readAnnouncementIds = useLocalStorage<string[]>('readAnnouncementIds', []);
const readSet = computed(() => new Set(readAnnouncementIds.value));
const hasUnread = ref(false);
const firstPageNotified = ref(false);
const lastNotifiedId = useLocalStorage<string | null>('announcementLastNotifiedId', null);
const scanning = ref(false);

const visibleItems = computed(() => rawItems.value.filter(a => !isExpired(a)));
const sortedItems = computed(() => [...visibleItems.value].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()));
const pageItems = computed(() => sortedItems.value);

const isExpired = (a: Announcement) => {
  if (!a.expires_at) return false;
  return new Date() >= new Date(a.expires_at);
};

const isUnread = (id: string) => !readSet.value.has(id);

const formatDate = (s: string) => new Date(s).toLocaleString('zh-CN');

const markAsRead = (id: string) => {
  if (!readSet.value.has(id)) {
    readAnnouncementIds.value = [...readAnnouncementIds.value, id];
  }
  recomputeUnreadBadge();
  scanForUnreadAcrossPages();
};

const handleItemClick = (a: Announcement) => {
  markAsRead(a.id);
  if (a.link) {
    openUrl(a.link);
  }
};

const openLink = (a: Announcement) => {
  markAsRead(a.id);
  openUrl(a.link!);
};

const openDrawer = () => {
  drawerVisible.value = true;
};

const closeDrawer = () => {
  drawerVisible.value = false;
};

const handlePageChange = async (page: number) => {
  currentPage.value = page;
  offset.value = (page - 1) * limit.value;
  await fetchPage();
};

const fetchPage = async () => {
  const r: AnnouncementResponse = await getAnnouncements(offset.value, limit.value);
  if (r && r.success) {
    rawItems.value = r.data.announcements;
    total.value = r.data.count;
    recomputeUnreadBadge();
    if (currentPage.value === 1) maybeNotifyOnce();
    if (currentPage.value === 1) await scanForUnreadAcrossPages();
  }
};

const recomputeUnreadBadge = () => {
  hasUnread.value = sortedItems.value.some(a => isUnread(a.id));
};

const maybeNotifyOnce = () => {
  console.log("maybeNotifyOnce")
  if (firstPageNotified.value) return;
  const unread = sortedItems.value.filter(a => isUnread(a.id));
  if (unread.length === 0) {
    firstPageNotified.value = true;
    return;
  }
  const latest = unread[0];
  const within7Days = (new Date().getTime() - new Date(latest.published_at).getTime()) <= 7 * 24 * 60 * 60 * 1000;
  if (within7Days) {
    let notif: any;
    notif = ArcoNotification.info({
      title: latest.title,
      content: () => (
        <div>
          <div style="margin-bottom:8px;">{latest.description ?? latest.title}</div>
          <div>
            <Button size="mini" onClick={() => { markAsRead(latest.id); notif?.close?.(); }}>关闭</Button>
            {latest.link && (
              <Button type="primary" size="mini" style="margin-left:8px" onClick={() => {
                markAsRead(latest.id);
                window.open(latest.link as string, '_blank');
                notif?.close?.();
              }}>查看</Button>
            )}
          </div>
        </div>
      ),
      position: 'topRight',
      closable: false,
      duration: 3600000
    });
    lastNotifiedId.value = latest.id;
  }
  firstPageNotified.value = true;
};

const scanForUnreadAcrossPages = async () => {
  if (scanning.value) return;
  scanning.value = true;
  try {
    let foundUnread = sortedItems.value.some(a => isUnread(a.id));
    const pages = Math.ceil(total.value / limit.value);
    if (!foundUnread) {
      for (let p = 2; p <= pages; p++) {
        const r: AnnouncementResponse = await getAnnouncements((p - 1) * limit.value, limit.value);
        if (r && r.success) {
          const list = r.data.announcements.filter(a => !isExpired(a));
          const unreadExists = list.some(a => !readSet.value.has(a.id));
          if (unreadExists) {
            foundUnread = true;
            break;
          }
        } else {
          break;
        }
      }
    }
    hasUnread.value = foundUnread;
  } finally {
    scanning.value = false;
  }
};

const renderTitle = (a: Announcement) => isUnread(a.id) ? `【未读】${a.title}` : a.title;

onMounted(() => {
  fetchPage();
});
</script>

<style scoped lang="less">
.notification-drawer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notification-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.notification-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.publish-date {
  font-size: 12px;
  color: #888;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.notification-item {
  cursor: pointer;
}
</style>
