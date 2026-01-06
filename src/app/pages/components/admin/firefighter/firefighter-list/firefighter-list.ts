import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FirefighterService, FirefighterListItem } from '../../../../services/users/firefighter/firefighter.service';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-firefighter-list',
  templateUrl: './firefighter-list.html',
  // styleUrls: ['./firefighter-list.scss'],
  imports: [TableModule, ToolbarModule, ButtonModule, ConfirmDialogModule, CardModule, TooltipModule, MenuModule],
  providers: [ConfirmationService, MessageService]
})
export class FirefighterListComponent implements OnInit {
  onContextMenu(firefighter: FirefighterListItem) {
    this.selectedFirefighter = firefighter;
  }
  
  selectedFirefighter: FirefighterListItem | null = null;
  firefighterList: FirefighterListItem[] = [];
  loading = false;
  items: MenuItem[] | undefined;

  constructor(
    private firefighterService: FirefighterService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadFirefighters();
    this.items = [
      {
        label: 'حذف',
        icon: 'pi pi-trash',
        command: () => {
          if (this.selectedFirefighter) {
            this.delete(this.selectedFirefighter.firefighterId);
          }
        }
      },
      {
        label: 'ویرایش',
        icon: 'pi pi-pencil',
        command: () => {
          if (this.selectedFirefighter) {
            this.edit(this.selectedFirefighter.firefighterId);
          }
        }
      }
    ];
  }

  loadFirefighters() {
    this.loading = true;
    this.firefighterService.listFirefighters().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.firefighterList = res.data;
        }
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
    this.router.navigate(['/firefighters/add']);
  }

  edit(id: string) {
    this.router.navigate(['/firefighters/edit', id]);
  }

  delete(id: string) {
    this.confirmationService.confirm({
      message: 'آیا از حذف این آتشنشان مطمئن هستید؟',
      header: 'تایید حذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'بله',
      rejectLabel: 'خیر',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        this.loading = true;
        this.firefighterService.deleteFirefighter(id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.messageService.add({ severity: 'success', summary: 'موفق', detail: 'حذف شد' });
              this.zone.run(() => this.loadFirefighters());
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