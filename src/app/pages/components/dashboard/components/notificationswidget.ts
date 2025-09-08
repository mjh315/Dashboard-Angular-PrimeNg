import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [ButtonModule, MenuModule],
    template: `<div dir="rtl">
<div class="card">
<div class="flex justify-between items-center mb-6">
<div class="font-semibold text-xl">اعلان‌ها</div>
<div>
<button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
<p-menu #menu [popup]="true" [model]="items"></p-menu>
</div>
</div>

    <span class="block text-muted-color font-medium mb-4">امروز</span>
    <ul class="p-0 mx-0 mt-0 mb-6 list-none" >
        <li class="flex items-center py-2 border-b border-surface">
            <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full ml-4 shrink-0">
                <i class="pi pi-dollar text-xl! text-blue-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
                >ریچارد جونز
                <span class="text-surface-700 dark:text-surface-100">یک تی‌شرت آبی به مبلغ <span class="text-primary font-bold">۷۹ دلار</span> خریداری کرده است</span>
            </span>
        </li>
        <li class="flex items-center py-2">
            <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full ml-4 shrink-0">
                <i class="pi pi-download text-xl! text-orange-500"></i>
            </div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">درخواست شما برای برداشت <span class="text-primary font-bold">۲۵۰۰ دلار</span> آغاز شده است.</span>
        </li>
    </ul>

    <span class="block text-muted-color font-medium mb-4">دیروز</span>
    <ul class="p-0 m-0 list-none mb-6">
        <li class="flex items-center py-2 border-b border-surface">
            <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full ml-4 shrink-0">
                <i class="pi pi-dollar text-xl! text-blue-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
                >کیسر وایک
                <span class="text-surface-700 dark:text-surface-100">یک ژاکت مشکی به مبلغ <span class="text-primary font-bold">۵۹ دلار</span> خریداری کرده است</span>
            </span>
        </li>
        <li class="flex items-center py-2 border-b border-surface">
            <div class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full ml-4 shrink-0">
                <i class="pi pi-question text-xl! text-pink-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"
                >جین دیویس
                <span class="text-surface-700 dark:text-surface-100">سوالی جدید در مورد محصول شما ارسال کرده است.</span>
            </span>
        </li>
    </ul>
    <span class="block text-muted-color font-medium mb-4">هفته گذشته</span>
    <ul class="p-0 m-0 list-none">
        <li class="flex items-center py-2 border-b border-surface">
            <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full ml-4 shrink-0">
                <i class="pi pi-arrow-up text-xl! text-green-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal">درآمد شما <span class="text-primary font-bold">۲۵٪</span> افزایش یافته است.</span>
        </li>
        <li class="flex items-center py-2 border-b border-surface">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full ml-4 shrink-0">
                <i class="pi pi-heart text-xl! text-purple-500"></i>
            </div>
            <span class="text-surface-900 dark:text-surface-0 leading-normal"><span class="text-primary font-bold">۱۲</span> کاربر محصولات شما را به لیست علاقه مندی‌های خود اضافه کرده‌اند.</span>
        </li>
    </ul>
</div>
</div>`
})
export class NotificationsWidget {
    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];
}
