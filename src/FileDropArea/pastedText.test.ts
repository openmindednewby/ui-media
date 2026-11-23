import { pastedText } from './pastedText';

describe('pastedText', () => {
  it('with a link pasted on the page, offers the link', () => {
    const text = pastedText({ target: { tagName: 'DIV' }, text: 'blob:https://bank.example/1' });

    expect(text).toBe('blob:https://bank.example/1');
  });

  it('with text pasted into an input, offers nothing', () => {
    const text = pastedText({ target: { tagName: 'INPUT' }, text: 'blob:https://bank.example/1' });

    expect(text).toBe('');
  });

  it('with only whitespace pasted, offers nothing', () => {
    const text = pastedText({ target: null, text: '   ' });

    expect(text).toBe('');
  });
});
