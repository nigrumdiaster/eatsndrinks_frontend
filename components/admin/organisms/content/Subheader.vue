<template>
    <div class="flex items-center justify-between bg-white h-12 rounded-xl shadow-md m-2 px-5">
        <!-- Title on the Left -->
        <PageTitle :pageTitle="pageTitle" />

        <!-- Breadcrumb on the Right -->
         <slot name="breadcrumb">
             <Breadcrumb>
                <BreadcrumbItem href="/">Home</BreadcrumbItem>
                <BreadcrumbItem>Trống</BreadcrumbItem>
                <BreadcrumbItem href="/">Trống</BreadcrumbItem>
            </Breadcrumb>
        </slot>
    </div>
</template>

<script lang="ts" setup>
import PageTitle from '~/components/admin/atoms/Title/PageTitle.vue';
import Breadcrumb from '~/components/admin/molecules/Breadcrumb.vue';
import BreadcrumbItem from '~/components/admin/atoms/Breadcrumb/BreadcrumbItem.vue';

defineProps({
    pageTitle: String,
});
</script>