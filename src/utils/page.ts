import type { PDFDocument } from 'pdf-lib'
import { newId } from './id'

export class Page {
  readonly id: number
  constructor(
    readonly srcDocument: PDFDocument,
    readonly pageIndex: number,
  ) {
    this.id = newId()
  }
  get width(): number {
    return this.srcDocument.getPage(this.pageIndex).getWidth()
  }
  get height(): number {
    return this.srcDocument.getPage(this.pageIndex).getHeight()
  }
}