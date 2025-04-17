// Mock for PDFDocument
export class MockPDFDocument {
  private static counter = 0;
  readonly id: number;
  private mockPages: any[] = [];

  constructor(pageCount = 1) {
    this.id = MockPDFDocument.counter++;
    this.mockPages = Array(pageCount).fill({ width: 595, height: 842 });
  }

  getPageCount(): number {
    return this.mockPages.length;
  }

  getPage(index: number) {
    return {
      getWidth: () => this.mockPages[index].width,
      getHeight: () => this.mockPages[index].height,
    };
  }

  copyPages() {
    return Promise.resolve([{ width: 595, height: 842 }]);
  }

  addPage() {
    // Implementation not needed for tests
  }

  save() {
    return Promise.resolve(new Uint8Array([1, 2, 3]));
  }
}

// Mock for Page class
export class MockPage {
  readonly id: number;
  readonly width: number = 595;
  readonly height: number = 842;

  constructor(public srcDocument: any, public pageIndex: number, id = 0) {
    this.id = id;
  }
}

// Mock for PDFJs and related types
export const mockPDFJs = {
  getDocument: () => ({
    promise: Promise.resolve({
      getPage: () => Promise.resolve({
        getViewport: () => ({ width: 595, height: 842 }),
        render: () => ({ promise: Promise.resolve() })
      })
    })
  }),
  GlobalWorkerOptions: {
    workerSrc: 'mocked-worker-url'
  }
};

export type MockRenderTask = {
  promise: Promise<void>;
  cancel: () => void;
};

export type MockPDFDocumentLoadingTask = {
  promise: Promise<any>;
  destroy: () => Promise<void>;
};