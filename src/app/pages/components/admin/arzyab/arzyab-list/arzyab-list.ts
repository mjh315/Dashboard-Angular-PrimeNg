import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ArzyabListItem, ArzyabService } from '../../../../services/users/arzyab/arzyab.service';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';



@Component({
  selector: 'app-arzyab-list',
  templateUrl: './arzyab-list.html',
  styleUrls: ['./arzyab-list.scss'],
  imports: [TableModule, ToolbarModule, ButtonModule, ConfirmDialogModule, CardModule, TooltipModule, MenuModule],
  providers: [ConfirmationService, MessageService]
})
export class ArzyabList implements OnInit {
  onContextMenu(arzyab: ArzyabListItem) {
    this.selectArzyab = arzyab;
  }
  selectArzyab: ArzyabListItem | null = null;
  arzyabList: ArzyabListItem[] = [];
  loading = false;
  items: MenuItem[] | undefined;

  constructor(
    private arzyabService: ArzyabService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadArzyab();
    this.items = [
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        command: (event) => {
          if (this.selectArzyab != null) {
            this.delete(this.selectArzyab?.idArzyab)
          }
        }
      },
      {
        label: 'ویرایش',
        icon: 'pi pi-pencil',
        command: (event) => {
          if (this.selectArzyab != null) {
            this.edit(this.selectArzyab?.idArzyab)
          }
        }
      }
    ];
  }

  loadArzyab() {
    this.loading = true;

    this.arzyabService.listArzyab().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.arzyabList = res.data;
        }
        // اجرای تغییرات داخل Zone برای آپدیت جدول و توقف لودینگ
        this.zone.run(() => {
          this.loading = false;
          this.cd.detectChanges();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.loading = false;
          this.cd.detectChanges();
        });
      }
    });
  }



  add() {
    this.router.navigate(['/arzyab/add']);
  }

  edit(id: string) {
    this.router.navigate(['/arzyab/edit', id]);
  }

  delete(id: string) {
    this.confirmationService.confirm({
      message: 'آیا از حذف این ارزیاب مطمئن هستید؟',
      header: 'تایید حذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله',
      rejectLabel: 'خیر',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        this.loading = true;
        this.arzyabService.deleteArzyab(id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'حذف شد' });
              this.zone.run(() => this.loadArzyab());
            } else {
              this.messageService.add({ severity: 'error', summary: 'خطا', detail: res.message });
            }
            this.zone.run(() => {
              this.loading = false;
              this.cd.detectChanges();
            });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'خطا', detail: 'عملیات حذف انجام نشد' });
            this.zone.run(() => {
              this.loading = false;
              this.cd.detectChanges();
            });
          }
        });
      }
    });
  }


}
