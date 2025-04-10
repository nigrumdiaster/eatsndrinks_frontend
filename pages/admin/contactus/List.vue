<template>
  <AdminLayout pageTitle="Liên hệ">
    <template #breadcrumb>
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Quản lý sản phẩm</BreadcrumbItem>
        <BreadcrumbItem href="/admin/orders">Sản phẩm</BreadcrumbItem>
      </Breadcrumb>
    </template>
    <div class="flex w-full">
      <div class="w-1/4 border-r overflow-y-auto">
        <div class="p-4">
          <input v-model="searchQuery" @input="filterEmails" type="text" placeholder="Tìm kiếm email hoặc nội dung..."
            class="w-full p-2 border rounded" />
        </div>
        <ul>
          <li v-for="email in filteredEmails" :key="email.id" @click="selectEmail(email.id)"
            :class="{ 'bg-gray-200': email.id === selectedEmail?.id }"
            class="p-4 cursor-pointer border-b hover:bg-gray-100 flex justify-between items-center">
            <div>
              <p class="font-bold">{{ email.subject }}</p>
              <p class="text-sm text-gray-600">{{ email.email }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">{{ formatDate(email.created_at) }}</p>
              <p class="text-xs font-semibold" :class="email.is_replied ? 'text-green-600' : 'text-red-600'">
                {{ email.is_replied ? 'Đã trả lời' : 'Chưa trả lời' }}
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div class="w-3/4 p-4">
        <div v-if="selectedEmail" class="mt-4">
          <h2 class="text-xl font-bold">{{ selectedEmail.subject }}</h2>
          <p class="text-gray-600">From: {{ selectedEmail.email }}</p>
          <p class="text-gray-500 text-sm">Gửi ngày: {{ formatDate(selectedEmail.created_at) }}</p>
          <p v-if="selectedEmail.is_replied" class="text-green-600 font-semibold">Trạng thái: Đã trả lời</p>
          <p v-else class="text-red-600 font-semibold">Trạng thái: Chưa trả lời</p>
          <div class="border p-4 mt-2">{{ selectedEmail.content }}</div>
          <h3 class="text-lg font-bold">Reply:</h3>



          <ClientOnly>
            <Editor v-model="editorData" />
          </ClientOnly>

          <button @click="sendReply" class="mt-2 p-2 bg-blue-500 text-white rounded">
            <span>Send</span>
          </button>
        </div>

        <p v-else>Chọn tin nhắn để xem nội dung</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRuntimeConfig, useCookie } from '#imports';
import Breadcrumb from "~/components/admin/molecules/Breadcrumb.vue";
import BreadcrumbItem from "~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue";
import { defineAsyncComponent } from 'vue';
const Editor = defineAsyncComponent(() =>
  import("~/components/admin/editor.client.vue")
);

interface Email {
  id: number;
  name: string;
  email: string;
  subject: string;
  content: string;
  created_at: string;
  is_replied: boolean;
}
const editorData = ref<string>('');
const emails = ref<Email[]>([]);
const searchQuery = ref<string>('');
const selectedEmail = ref<Email | null>(null);
const config = useRuntimeConfig();
const token = useCookie("access_token");

const filteredEmails = computed(() => {
  return emails.value.filter(email =>
    email.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    email.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchContactList = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/contact/contacts`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch emails');
    emails.value = await response.json();
  } catch (error) {
    console.error('Error fetching emails:', error);
  }
};

const selectEmail = async (id: number) => {
  try {
    const response = await fetch(`${config.public.apiBase}/contact/contacts/${id}/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch email details');
    selectedEmail.value = await response.json();
  } catch (error) {
    console.error('Error fetching email details:', error);
  }
};

const sendReply = async () => {
  if (!editorData.value.trim() || !selectedEmail.value) {
    alert('Reply content cannot be empty');
    return;
  }
  try {
    const response = await fetch(`${config.public.apiBase}/contact/reply/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact_id: selectedEmail.value.id,
        subject: `Re: ${selectedEmail.value.subject}`,
        message: editorData.value,
      }),
    });
    if (!response.ok) throw new Error('Failed to send reply');

    alert('Reply sent successfully!');

    await fetchContactList();
    await selectEmail(selectedEmail.value.id);
    editorData.value = '';
  } catch (error) {
    console.error('Error sending reply:', error);
    alert('Failed to send reply.');
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

onMounted(() => {
  fetchContactList();
});
</script>