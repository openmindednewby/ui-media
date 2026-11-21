import { FilePreviewKind } from './FilePreviewKind';
import { firstFile, isAcceptedFile, previewKindOf } from './fileAccept';

const ACCEPT = ['application/pdf', 'image/*', '.jpg'];

describe('isAcceptedFile', () => {
  it('with an exact MIME match, accepts the file', () => {
    const file = { name: 'slip.pdf', type: 'application/pdf' };

    const accepted = isAcceptedFile(file, ACCEPT);

    expect(accepted).toBe(true);
  });

  it('with a type wildcard, accepts any subtype', () => {
    const file = { name: 'shot.png', type: 'image/png' };

    const accepted = isAcceptedFile(file, ACCEPT);

    expect(accepted).toBe(true);
  });

  it('with an extension entry and no MIME type, accepts by name', () => {
    const file = { name: 'PHOTO.JPG', type: '' };

    const accepted = isAcceptedFile(file, ACCEPT);

    expect(accepted).toBe(true);
  });

  it('with a Word file, rejects it', () => {
    const file = { name: 'note.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };

    const accepted = isAcceptedFile(file, ACCEPT);

    expect(accepted).toBe(false);
  });
});

describe('firstFile', () => {
  it('with no list, returns null', () => {
    const files = undefined;

    const file = firstFile(files);

    expect(file).toBeNull();
  });

  it('with two files, returns the first', () => {
    const a = new File(['a'], 'a.png', { type: 'image/png' });
    const b = new File(['b'], 'b.png', { type: 'image/png' });

    const file = firstFile([a, b]);

    expect(file).toBe(a);
  });
});

describe('previewKindOf', () => {
  it('with an image type, previews as an image', () => {
    const type = 'image/jpeg';

    const kind = previewKindOf(type);

    expect(kind).toBe(FilePreviewKind.Image);
  });

  it('with a PDF, previews as a document', () => {
    const type = 'application/pdf';

    const kind = previewKindOf(type);

    expect(kind).toBe(FilePreviewKind.Document);
  });
});
