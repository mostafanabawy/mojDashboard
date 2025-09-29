import { Component, input } from '@angular/core';
interface Stat {
  statValue: string;
  statLabel: string;
}

interface Operation {
  title?: string;
  span: string;
  flex?: string;
  blockSpan?: string;
  stats: Stat[];
}

type OperationsArray = Operation[];
@Component({
  selector: 'app-stats-block',
  templateUrl: './stats-block.component.html'
})
export class StatsBlockComponent {
  getCombinedClasses(stat: any, item: any, i: number, last: boolean): string {
    let classes = [];

/* 
    if (stat.statLabel === 'الاتفاقيات والتعاون الدولي') {
      classes.push('!bg-[#EDEDD8ff]');
    }
    if (
      item.title === 'الترجمة والجريدة الرسمية' ||
      stat.statLabel === 'ترجمة + مراجعة ترجمة تشريعات'
    ) {
      classes.push('!bg-[#EEEBF7ff]');
    } */

    // Layout logic
    if (i === 0) classes.push('rounded-br-lg');
    if (last) classes.push('rounded-bl-lg');
    if (item.span === '1') classes.push('rounded-lg');
    if (item.flex !== 'true') classes.push('flex-col');
    if (item.flex === 'true') classes.push('ltr:flex-row rtl:flex-row-reverse justify-between');

    return classes.join(' ');
  }
  statsBlocks = input.required<OperationsArray>();
}
